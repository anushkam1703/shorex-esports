import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("today");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const loadBookings = () => {
    api
      .get("/admin/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getBookingDateTimes = (booking) => {
  const start = new Date(`${booking.bookingDate}T${booking.startTime}`);
  let end = new Date(`${booking.bookingDate}T${booking.endTime}`);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
};

const isOngoingBooking = (booking) => {
  if (!booking.bookingDate || !booking.startTime || !booking.endTime) {
    return false;
  }

  const now = new Date();
  const { start, end } = getBookingDateTimes(booking);

  return (
    booking.status === "CONFIRMED" &&
    now >= start &&
    now <= end
  );
};

 const hasBookingEnded = (booking) => {
  if (!booking.bookingDate || !booking.startTime || !booking.endTime) {
    return false;
  }

  const now = new Date();
  const { end } = getBookingDateTimes(booking);

  return now > end;
};

  const cancelBooking = async (id) => {
    await api.put(`/admin/bookings/${id}/cancel`);
    loadBookings();
  };

  const completeBooking = async (id) => {
    await api.put(`/admin/bookings/${id}/complete`);
    loadBookings();
  };

  const confirmBooking = async (id) => {
    await api.put(`/admin/bookings/${id}/confirm`);
    loadBookings();
  };

  const getPcNumbers = (booking) => {
    if (booking.assignedPcs && booking.assignedPcs.length > 0) {
      return booking.assignedPcs.map((pc) => pc.pcNumber || pc).join(", ");
    }
    return "Not assigned";
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (filter === "today" && b.bookingDate !== today) return false;
      if (filter === "tomorrow" && b.bookingDate !== tomorrow) return false;

      const text = `
        ${b.id}
        ${b.bookingType}
        ${b.fullName}
        ${b.username}
        ${b.phone}
        ${b.selectedGame}
        ${b.planName}
        ${b.status}
        ${getPcNumbers(b)}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [bookings, filter, search, today, tomorrow]);

  const stats = useMemo(() => {
    const todayBookings = bookings.filter((b) => b.bookingDate === today);

    return {
      total: todayBookings.length,
      pending: todayBookings.filter((b) => b.status === "PENDING").length,
      confirmed: todayBookings.filter((b) => b.status === "CONFIRMED").length,
      completed: todayBookings.filter((b) => b.status === "COMPLETED").length,
      revenue: todayBookings
        .filter((b) => b.status !== "CANCELLED")
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0),
    };
  }, [bookings, today]);

  const generateReport = () => {
    const headers = [
      "ID",
      "Type",
      "User",
      "Phone",
      "Game",
      "Plan",
      "PC Count",
      "Assigned PCs",
      "Date",
      "Time",
      "Amount",
      "Status",
    ];

    const rows = filteredBookings.map((b) => [
      b.id,
      b.bookingType,
      b.username,
      b.phone,
      b.selectedGame,
      b.planName,
      b.pcCount,
      getPcNumbers(b),
      b.bookingDate,
      `${b.startTime} - ${b.endTime}`,
      b.totalPrice,
      b.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shorex-${filter}-${today}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

 const endBookingEarly = async (booking) => {
  if (!isOngoingBooking(booking)) {
    alert("End Early is allowed only while booking is currently active.");
    return;
  }

  const now = new Date();

  const pad = (n) => String(n).padStart(2, "0");

  const actualEndDateTimeString =
    `${now.getFullYear()}-` +
    `${pad(now.getMonth() + 1)}-` +
    `${pad(now.getDate())}T` +
    `${pad(now.getHours())}:` +
    `${pad(now.getMinutes())}:00`;

  try {
    await api.post(
      `/admin/bookings/${booking.id}/end-early?actualEndDateTime=${actualEndDateTimeString}`
    );

    alert("Booking ended early and remaining time credit saved.");
    loadBookings();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to end booking early");
  }
};


  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div>
          <h1 className="section-title admin-title">Dashboard</h1>
          <p className="admin-subtitle">
            Manage bookings, Walk-ins, Confirmations and Reports.
          </p>
        </div>

        <div className="admin-actions top-actions">
          <Link to="/admin/add-booking" className="btn-primary">
            Add Walk-in Booking
          </Link>

          <Link to="/admin/history" className="btn-secondary">
            History
          </Link>

          <button className="btn-secondary" onClick={loadBookings}>
            Refresh
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin-login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p>Today Bookings</p>
          <h2>{stats.total}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Pending</p>
          <h2>{stats.pending}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Confirmed</p>
          <h2>{stats.confirmed}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Completed</p>
          <h2>{stats.completed}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Revenue</p>
          <h2>₹{stats.revenue}</h2>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="filter-buttons">
          <button
            className={filter === "today" ? "filter-btn active-filter" : "filter-btn"}
            onClick={() => setFilter("today")}
          >
            Today
          </button>

          <button
            className={filter === "tomorrow" ? "filter-btn active-filter" : "filter-btn"}
            onClick={() => setFilter("tomorrow")}
          >
            Tomorrow
          </button>

          <button
            className={filter === "all" ? "filter-btn active-filter" : "filter-btn"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        <input
          className="admin-search"
          type="text"
          placeholder="Search by user, phone, game, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn-primary generate-btn" onClick={generateReport}>
          Generate Report
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>User</th>
              <th>Phone</th>
              <th>Game</th>
              <th>Plan</th>
              <th>PC Count</th>
              <th>Assigned PCs</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => (
              <tr
                key={b.id}
                className={isOngoingBooking(b) ? "ongoing-row" : ""}
              >
                <td>{b.id}</td>
                <td>{b.bookingType}</td>
               <td>{b.username}{b.isNewCustomer && (<span className="new-customer-badge">NEW</span>)}</td>
                <td>{b.phone}</td>
                <td>{b.selectedGame}</td>
                <td>{b.planName}</td>
                <td>{b.pcCount}</td>
                <td>{getPcNumbers(b)}</td>
                <td>{b.bookingDate}</td>
                <td>
                  {b.startTime} - {b.endTime}
                </td>
                <td>₹{b.totalPrice}</td>
                <td><span className={`status-badge ${String(b.status).toLowerCase()}`}>
                      {b.status}
                    </span>

                    {b.offerApplied && (
                    <div className="offer-text">
                      {b.offerApplied}
                    </div>
                  )}

  {b.hasCredit && b.remainingMinutes > 0 && (
    <div className="credit-text">
      Credit: {b.remainingMinutes} min
    </div>
  )}
</td>
              <td>
                {/* Confirm */}
                {b.status === "PENDING" && (
                  <button
                    className="admin-btn confirm-btn"
                    onClick={() => confirmBooking(b.id)}
                  >
                    Confirm
                  </button>
                )}

                {/* End Early → only when LIVE */}
                {b.status === "CONFIRMED" && isOngoingBooking(b) && (
                  <button
                    className="admin-btn early-btn"
                    onClick={() => endBookingEarly(b)}
                  >
                    End Now & Save Credit
                  </button>
                )}

                {/* Complete → only if NOT already ended */}
                {b.status === "CONFIRMED" && !hasBookingEnded(b) && (
                  <button
                    className="admin-btn complete-btn"
                    onClick={() => completeBooking(b.id)}
                  >
                    Complete
                  </button>
                )}

                {/* Cancel */}
                {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                  <button
                    className="admin-btn cancel-btn"
                    onClick={() => cancelBooking(b.id)}
                  >
                  Cancel
                  </button>
                )}
              </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="13" className="empty-table-text">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;