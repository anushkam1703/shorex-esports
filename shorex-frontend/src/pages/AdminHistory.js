import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminHistory() {
    
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

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

  // ✅ AUTO REFRESH
  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ✅ LIVE BOOKING CHECK
  const isOngoingBooking = (booking) => {
    if (!booking.bookingDate || !booking.startTime || !booking.endTime) {
      return false;
    }

    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];

    if (booking.bookingDate !== todayDate) return false;

    const currentTime = now.toTimeString().slice(0, 8);

    return (
      booking.status === "CONFIRMED" &&
      currentTime >= booking.startTime &&
      currentTime <= booking.endTime
    );
  };

  const getPcNumbers = (booking) => {
    if (booking.assignedPcs && booking.assignedPcs.length > 0) {
      return booking.assignedPcs.map((pc) => pc.pcNumber || pc).join(", ");
    }
    return "Not assigned";
  };

 const filteredBookings = useMemo(() => {
  return bookings.filter((b) => {
    const bookingDateOnly = String(b.bookingDate).split("T")[0];

    if (bookingDateOnly !== selectedDate) return false;

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
}, [bookings, selectedDate, search]);

  const totalRevenue = filteredBookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

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

    const csv =
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v || ""}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shorex-history-${selectedDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1>Booking History</h1>

        <div className="admin-actions">
          <Link to="/admin" className="btn-secondary">
            Dashboard
          </Link>

          <Link to="/admin/add-booking" className="btn-primary">
            Add Walk-in Booking
          </Link>

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

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p>Date</p>
          <h2>{selectedDate}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Total Bookings</p>
          <h2>{filteredBookings.length}</h2>
        </div>

        <div className="admin-stat-card">
          <p>Revenue</p>
          <h2>₹{totalRevenue}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn-secondary" onClick={loadBookings}>
          Refresh
        </button>

        <button className="btn-primary" onClick={generateReport}>
          Generate Report
        </button>
      </div>

      {/* Table */}
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
              <td>{b.username}</td>
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
              <td>{b.status}</td>
            </tr>
          ))}

          {filteredBookings.length === 0 && (
            <tr>
              <td colSpan="12">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


export default AdminHistory;