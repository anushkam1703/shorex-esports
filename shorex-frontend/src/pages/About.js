import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

function About() {
  return (
    <div className="page about-page premium-about-page">
      <div className="about-premium-card">
        <p className="premium-tag">FOR GAMERS, BY A GAMER</p>

        <h1>About Shorex Esports</h1>

        <p className="owner-note">
          Shorex Esports was started from a real passion for gaming. As a gamer,
          I wanted to create a place where players can enjoy smooth gameplay,
          premium setups, and a proper gaming arena vibe with friends and squads.
        </p>

        <p>
          Our aim is simple — give gamers a comfortable, exciting, and reliable
          space to play their favourite PC games without hassle.
        </p>

        <div className="about-specs">
          <div>⚡ Latest RTX 5060 Graphic Card Gaming PCs</div>
          <div>🖥️ 300 Hz Display</div>
          <div>🎧 Noise-Isolating Headsets</div>
          <div>🖱️ Lightweight High Precision Gaming Mouse</div>
        </div>

        <div className="owner-signature">
          Built with passion for every gamer who wants to level up.
        </div>

        {/* ✅ CONTACT SECTION WITH REAL ICONS */}
        <div className="about-contact-grid">
          <a
            href="https://wa.me/917558757877"
            target="_blank"
            rel="noreferrer"
            className="contact-pill whatsapp"
          >
            <FaWhatsapp />
            WhatsApp
          </a>

          <a
            href="https://www.instagram.com/shorex_esports/"
            target="_blank"
            rel="noreferrer"
            className="contact-pill instagram"
          >
            <FaInstagram />
            Instagram
          </a>

         <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=shorex.esports@gmail.com"
  target="_blank"
  rel="noreferrer"
  className="contact-pill email"
>
  <FaEnvelope />
  Email
</a>
        </div>
      </div>
    </div>
  );
}

export default About;