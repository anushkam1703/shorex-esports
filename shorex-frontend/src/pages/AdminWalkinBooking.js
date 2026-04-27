import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminWalkinBooking() {
  const plans = [
    { id: 1, title: "1 Hour", hours: 1, offerPrice: 80 },
    { id: 2, title: "2 Hours", hours: 2, offerPrice: 160 },
    { id: 3, title: "3 Hours", hours: 3, offerPrice: 225 },
    { id: 4, title: "5 Hours", hours: 5, offerPrice: 375 },
    { id: 5, title: "10 Hours", hours: 10, offerPrice: 700 },
    { id: 6, title: "10 Hours Day Pass", hours: 10, offerPrice: 600 },
  ];

  const today = new Date().toISOString().split("T")[0];

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    selectedGame: "",
    planId: 1,
    bookingDate: today,
    startTime: "",
    pcCount: 1,
    isNewCustomer: false,
  });

  const selectedPlan =
    plans.find((p) => p.id === Number(formData.planId)) || plans[0];

  const preview = useMemo(() => {
    const freeHours =
      formData.isNewCustomer && selectedPlan.hours === 2 ? 1 : 0;

    return {
      totalHours: selectedPlan.hours + freeHours,
      totalAmount: selectedPlan.offerPrice * Number(formData.pcCount),
      freeHours,
    };
  }, [formData.isNewCustomer, formData.pcCount, selectedPlan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        phone: onlyNumbers,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
const payload = {
  fullName: formData.fullName,
  username: formData.username,
  phone: formData.phone,
  selectedGame: formData.selectedGame,
  gameId: 1,
  pcCount: Number(formData.pcCount),
  bookingDate: formData.bookingDate,
  startTime: formData.startTime ? `${formData.startTime}:00` : "",
  paidHours: selectedPlan.hours,
  planName: selectedPlan.title,
  totalPrice: preview.totalAmount,
  
  bookingType: "WALK_IN",
};

      await api.post("/bookings", payload);

      setMessage("Walk-in booking added successfully.");

      setFormData({
        fullName: "",
        username: "",
        phone: "",
        selectedGame: "",
        planId: 1,
        bookingDate: today,
        startTime: "",
        pcCount: 1,
        
      });
    } catch (err) {
  console.log(err.response?.data);
  setError(err.response?.data?.message || err.response?.data?.error || "Failed to add walk-in booking");
}
  };

  return (
    <div className="page">
      <h1 className="section-title">Add Walk-in Booking</h1>

      <div className="admin-actions">
        <Link to="/admin" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="booking-layout">
        <div className="booking-card">
          <h2>Booking Details</h2>

          <form onSubmit={handleSubmit} className="booking-form">
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Mobile number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />

            <select
              name="selectedGame"
              value={formData.selectedGame}
              onChange={handleChange}
              required
            >
              <option value="">Select game</option>
              <option value="Valorant">Valorant</option>
              <option value="Counter Strike">Counter Strike</option>
              <option value="Dota 2">Dota 2</option>
              <option value="GTA 5">GTA 5</option>
              <option value="PUBG PC">PUBG PC</option>
              <option value="Other">Other</option>
            </select>

            <select name="planId" value={formData.planId} onChange={handleChange}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - ₹{p.offerPrice}
                </option>
              ))}
            </select>

            <select name="pcCount" value={formData.pcCount} onChange={handleChange}>
              <option value="1">1 PC</option>
              <option value="2">2 PCs</option>
              <option value="3">3 PCs</option>
              <option value="4">4 PCs</option>
              <option value="5">5 PCs</option>
              <option value="6">6 PCs</option>
              <option value="7">7 PCs</option>
              <option value="8">8 PCs</option>
              <option value="9">9 PCs</option>
              <option value="10">10 PCs</option>
            </select>

            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              min={today}
              required
            />

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

        

            <button className="btn-primary full-width" type="submit">
              Add Walk-in Booking
            </button>
          </form>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="booking-card">
          <h2>Summary</h2>
          <div className="preview-box">
            <p>Type: WALK-IN</p>
            <p>Full Name: {formData.fullName || "Not entered"}</p>
            <p>Username: {formData.username || "Not entered"}</p>
            <p>Phone: {formData.phone || "Not entered"}</p>
            <p>Game: {formData.selectedGame || "Not selected"}</p>
            <p>Package: {selectedPlan.title}</p>
            <p>PCs: {formData.pcCount}</p>
            <p>Paid Hours: {selectedPlan.hours}</p>
            <p>Free Hours: {preview.freeHours}</p>
            <p>Total Play Time: {preview.totalHours} hour(s)</p>
            <p>Total Amount: ₹{preview.totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminWalkinBooking;