import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/admin/login", form);

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Invalid admin username or password");
    }
  };

  return (
    <div className="page contact-page">
      <div className="info-card">
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit} className="booking-form">
          <input
            type="text"
            placeholder="Admin username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Admin password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button type="submit" className="btn-primary full-width">
            Login
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;