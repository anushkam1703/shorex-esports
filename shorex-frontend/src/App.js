import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWalkinBooking from "./pages/AdminWalkinBooking";
import AdminLogin from "./pages/AdminLogin";
import AdminHistory from "./pages/AdminHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/booking/:planId" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-booking" element={<AdminWalkinBooking />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/history" element={<AdminHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;