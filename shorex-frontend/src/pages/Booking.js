import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Booking() {
  const { planId } = useParams();

  const plans = [
    {
      id: 1,
      title: "1 Hour",
      hours: 1,
      actualPrice: 80,
      offerPrice: 80,
      note: "Best for quick gaming session",
    },
    {
      id: 2,
      title: "2 Hours",
      hours: 2,
      actualPrice: 160,
      offerPrice: 160,
      note: "Regular 2 hours package",
    },
    {
      id: 3,
      title: "3 Hours",
      hours: 3,
      actualPrice: 240,
      offerPrice: 225,
      note: "Actual ₹240, offer price ₹225",
    },
    {
      id: 4,
      title: "5 Hours",
      hours: 5,
      actualPrice: 400,
      offerPrice: 375,
      note: "Actual ₹400, offer price ₹375",
    },
    {
      id: 5,
      title: "10 Hours",
      hours: 10,
      actualPrice: 800,
      offerPrice: 700,
      note: "Actual ₹800, offer price ₹700",
    },
    {
      id: 6,
      title: "10 Hours Day Pass",
      hours: 10,
      actualPrice: 800,
      offerPrice: 600,
      note: "Validity 1 day",
    },
  ];

  const selectedPlan = plans.find((p) => p.id === Number(planId)) || plans[0];

  const today = new Date().toISOString().split("T")[0];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    selectedGame: "",
    bookingDate: "",
    startTime: "",
    pcCount: 1,
    isNewCustomer: false,
  });

  const bookingPreview = useMemo(() => {
    const freeHours =
      formData.isNewCustomer && selectedPlan.hours === 2 ? 1 : 0;

    return {
      planName: selectedPlan.title,
      paidHours: selectedPlan.hours,
      freeHours,
      totalHours: selectedPlan.hours + freeHours,
      actualPrice: selectedPlan.actualPrice,
      finalPrice: selectedPlan.offerPrice,
      pcCount: Number(formData.pcCount),
      totalAmount: selectedPlan.offerPrice * Number(formData.pcCount),
      offerText:
        formData.isNewCustomer && selectedPlan.hours === 2
          ? "New Customer Offer Applied: 1 Hour Free"
          : selectedPlan.actualPrice !== selectedPlan.offerPrice
          ? "Package Offer Applied"
          : "No offer applied",
    };
  }, [formData.isNewCustomer, formData.pcCount, selectedPlan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.bookingDate === today && formData.startTime < getCurrentTime()) {
      setError("Please select current or future time for today's booking.");
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
        totalPrice: bookingPreview.totalAmount,
        
      };

      await api.post("/bookings", payload);

      const msg = `Hi Shorex Esports,
Booking Details:

Name: ${formData.username}
Full Name: ${formData.fullName}
Phone: ${formData.phone}
Game: ${formData.selectedGame}
Package: ${selectedPlan.title}
PCs: ${formData.pcCount}
Date: ${formData.bookingDate}
Time: ${formData.startTime}

Please confirm my slot.`;

const encodedMsg = encodeURIComponent(msg);

const whatsappNumber = "917558757877"; // your number with country code

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

window.open(whatsappUrl, "_blank");

setMessage("Booking created. Please confirm on WhatsApp.");

      setFormData({
        fullName: "",
        username: "",
        phone: "",
        selectedGame: "",
        bookingDate: "",
        startTime: "",
        pcCount: 1,
        isNewCustomer: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="page booking-page">
      <div className="booking-layout">
        <div className="booking-card left-panel">
          <h2>{selectedPlan.title} Package</h2>

          <p className="price">
            {selectedPlan.actualPrice !== selectedPlan.offerPrice && (
              <span className="actual-price">₹{selectedPlan.actualPrice}</span>
            )}{" "}
            ₹{selectedPlan.offerPrice}
          </p>

          <p>{selectedPlan.note}</p>

          <div className="new-offer-card">
            <h3>New Customer Offer</h3>
            <p>First time at Shorex Esports?</p>
            <h4>Book 2 Hours & Get 1 Hour Free</h4>
            <p className="offer-small">
              This offer is only for new first-time customers and only on 2 hours package.
            </p>
          </div>

          <div className="preview-box">
            <h3>Booking Summary</h3>
            <p>Package: {bookingPreview.planName}</p>
            <p>Selected Game: {formData.selectedGame || "Not selected"}</p>
            <p>PCs Required: {bookingPreview.pcCount}</p>
            <p>Paid Hours: {bookingPreview.paidHours}</p>
            <p>Free Hours: {bookingPreview.freeHours}</p>
            <p>Total Play Time: {bookingPreview.totalHours} hour(s)</p>

            {bookingPreview.actualPrice !== bookingPreview.finalPrice && (
              <p>
                Actual Price:{" "}
                <span className="actual-price">₹{bookingPreview.actualPrice}</span>
              </p>
            )}

            <p>Package Price Per PC: ₹{bookingPreview.finalPrice}</p>
            <p>Total Amount: ₹{bookingPreview.totalAmount}</p>
            <p>{bookingPreview.offerText}</p>
          </div>
        </div>

        <div className="booking-card right-panel">
          <h2>Book Your Slot</h2>

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
              placeholder="Enter mobile number"
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

            <select
              name="pcCount"
              value={formData.pcCount}
              onChange={handleChange}
              required
            >
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
              min={formData.bookingDate === today ? getCurrentTime() : "00:00"}
              required
            />

            

            {formData.isNewCustomer && selectedPlan.hours !== 2 && (
              <p className="offer-warning">
                New customer free hour offer is only valid on 2 hours package.
              </p>
            )}

            <button type="submit" className="btn-primary full-width">
              Confirm Booking
            </button>
          </form>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Booking;