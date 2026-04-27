import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import arena1 from "../assets/arena1.png";
import arena2 from "../assets/arena2.png";
import arena3 from "../assets/arena3.png";

function Home() {
  return (
    <div className="home-premium">
      <section className="premium-hero">
        <div className="hero-glow hero-glow-left"></div>
        <div className="hero-glow hero-glow-right"></div>

        <div className="premium-hero-card">
          <img src={logo} alt="Shorex Esports" className="hero-logo" />

          <h1>ShoreX- Where Every Click Counts</h1>

          <p className="premium-hero-text">
            Premium PC gaming experience with RTX powered systems, 300Hz displays,
            pro gaming accessories, and a neon arena built for squads, solo players,
            and competitive gamers.
          </p>

          <div className="premium-hero-actions">
            <Link to="/games" className="btn-primary">
              Book Your Slot
            </Link>

            <a
              href="https://wa.me/917558757877?text=Hi%20Shorex%20Esports%2C%20I%20want%20to%20book%20a%20gaming%20slot"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-head">
          <p className="premium-tag">WHY SHOREX</p>
          <h2>Built for serious gaming sessions</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <span>⚡</span>
            <h3>Latest RTX 5060 Graphic Card Gaming PCs</h3>
            <p>High-performance PCs ready for smooth modern gaming.</p>
          </div>

          <div className="feature-card">
            <span>🖥️</span>
            <h3>300Hz Display</h3>
            <p>Fast refresh rate displays for responsive gameplay.</p>
          </div>

          <div className="feature-card">
            <span>🎧</span>
            <h3>Noise-Isolating Headsets</h3>
            <p>Stay focused with clear audio and immersive sound.</p>
          </div>

          <div className="feature-card">
            <span>🖱️</span>
            <h3>Precision Gaming Mouse</h3>
            <p>Accurate control for FPS, MOBA, and competitive games.</p>
          </div>
        </div>
      </section>

      <section className="premium-section arena-section">
        <div className="section-head">
          <p className="premium-tag">AMBIENCE</p>
          <h2>Step into the arena</h2>
        </div>

        <div className="arena-grid">
          <div className="arena-image large">
            <img src={arena1} alt="Shorex gaming setup" />
          </div>

          <div className="arena-image">
            <img src={arena2} alt="Shorex PC gaming arena" />
          </div>

          <div className="arena-image">
            <img src={arena3} alt="Shorex esports ambience" />
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-head">
          <p className="premium-tag">POPULAR GAMES</p>
          <h2>Play your favourite PC titles</h2>
        </div>

        <div className="games-strip">
          <span>Valorant</span>
          <span>Counter Strike</span>
          <span>Dota 2</span>
          <span>GTA 5</span>
          <span>PUBG PC</span>
          <span>Other PC Games</span>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-head">
          <p className="premium-tag">HOW IT WORKS</p>
          <h2>Book in seconds. Play without hassle.</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <b>01</b>
            <h3>Select Package</h3>
            <p>Choose your hourly gaming package.</p>
          </div>

          <div className="step-card">
            <b>02</b>
            <h3>Pick Game & Time</h3>
            <p>Select game, date, time, and number of PCs.</p>
          </div>

          <div className="step-card">
            <b>03</b>
            <h3>Confirm Booking</h3>
            <p>Submit your booking and confirm with the owner.</p>
          </div>

          <div className="step-card">
            <b>04</b>
            <h3>Start Playing</h3>
            <p>Arrive at Shorex and enjoy your slot.</p>
          </div>
        </div>
      </section>

      <section className="premium-cta">
        <div>
          <p className="premium-tag">VISIT US</p>
          <h2>Ready to level up?</h2>
          <p>
            Shop No. 102, First Floor, The Centrum, Bhumkar Chowk Road,
            Ashok Nagar, Tathawade - 411033
          </p>
        </div>

        <div className="cta-actions">
          <Link to="/games" className="btn-primary">
            Book Now
          </Link>

          <a
            href="https://www.instagram.com/shorex_esports/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;