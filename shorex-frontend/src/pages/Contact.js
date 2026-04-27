import { FaWhatsapp, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const mapLink = "https://maps.app.goo.gl/jX5UZV2jA9jHnazd6";

  return (
    <div className="page contact-page">
      <div className="contact-container upgraded-contact">
        <div className="booking-card contact-card">
          <h1>Contact Us</h1>

          <p className="contact-note">
            For quick response, contact us on WhatsApp, Instagram, or call directly.
          </p>

          <form className="booking-form">
            <input type="text" placeholder="Enter your name" required />
            <input type="text" placeholder="Enter your mobile number" required />
            <textarea placeholder="Enter your message" rows="5" required></textarea>

            <button type="submit" className="btn-primary full-width">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h3>Visit Shorex Esports</h3>

            <p>
              <FaMapMarkerAlt /> Shop No. 102, First Floor, The Centrum,
              Bhumkar Chowk Road, Ashok Nagar, Tathawade - 411033
            </p>

            <p>
              <FaPhoneAlt /> +91 7558757877
            </p>
            
            <p>
            <FaEnvelope />
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=shorex.esports@gmail.com&su=Gaming%20Inquiry&body=Hi%20Shorex%20Esports,%20I%20want%20to%20know%20about%20booking."
              target="_blank"
              rel="noreferrer"
              className="email-link"
            >
            shorex.esports@gmail.com
            </a>
            </p>
          </div>
        </div>

        <div className="contact-side-panel">
          <h2>Quick Contact</h2>
          <p>Prefer instant response? Choose below:</p>

          <div className="contact-cards">
            <a
              href="https://wa.me/917558757877?text=Hi%20Shorex%20Esports%2C%20I%20want%20to%20book%20a%20gaming%20slot"
              target="_blank"
              rel="noreferrer"
              className="quick-contact-card whatsapp-card"
            >
              <FaWhatsapp />
              <div>
                <strong>WhatsApp</strong>
                <span>Quick booking response</span>
              </div>
            </a>

            <a
              href="https://www.instagram.com/shorex_esports/"
              target="_blank"
              rel="noreferrer"
              className="quick-contact-card instagram-card"
            >
              <FaInstagram />
              <div>
                <strong>Instagram</strong>
                <span>DM us anytime</span>
              </div>
            </a>

            <a
              href="tel:+917558757877"
              className="quick-contact-card call-card"
            >
              <FaPhoneAlt />
              <div>
                <strong>Call Now</strong>
                <span>Direct contact</span>
              </div>
            </a>

            <a
               href="https://mail.google.com/mail/?view=cm&fs=1&to=shorex.esports@gmail.com&su=Gaming%20Slot%20Inquiry&body=Hi%20Shorex%20Esports,%20I%20want%20to%20know%20about%20booking."
              target="_blank"
              rel="noreferrer"
              className="quick-contact-card email-card"
            >
              <FaEnvelope />
              <div>
                <strong>Email</strong>
                <span>shorex.esports@gmail.com</span>
              </div>
            </a>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=The%20Centrum%20Bhumkar%20Chowk%20Road%20Tathawade&output=embed"
              title="Shorex Esports Location"
              loading="lazy"
            ></iframe>

            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="map-link"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;