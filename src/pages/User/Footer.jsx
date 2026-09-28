import { MapPin, Phone, Mail, Clock } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  .footer-section {
    background: #0f1f4b;
    color: #c7d3ea;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    padding: 56px 20px 0;
    position: relative;
    overflow: hidden;
  }

  .footer-blob {
    position: absolute;
    border-radius: 50%;
    background: #2a7de1;
    opacity: 0.08;
    pointer-events: none;
  }
  .footer-blob-1 { width: 320px; height: 320px; top: -140px; right: -100px; }
  .footer-blob-2 { width: 220px; height: 220px; bottom: -100px; left: -80px; }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ---- Top grid ---- */
  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
    gap: 36px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  /* ---- Brand column ---- */
  .footer-brand-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
    .footer-brand-logo img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: #ffffff;
  flex-shrink: 0;
}
  .footer-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
  .footer-logo-door { font-size: 1.05rem; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; }
  .footer-logo-door span { color: #5badff; }
  .footer-logo-sub { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.14em; color: #5badff; text-transform: uppercase; }

  .footer-desc {
    font-size: 13px;
    line-height: 1.7;
    color: #9fb0d4;
    margin: 0 0 18px;
    max-width: 280px;
  }

  .footer-socials { display: flex; gap: 10px; }
  .footer-social-btn {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #c7d3ea;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .footer-social-btn:hover {
    background: #2a7de1;
    color: #fff;
    transform: translateY(-2px);
  }

  /* ---- Heading ---- */
  .footer-heading {
    font-size: 14px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 18px;
    letter-spacing: 0.3px;
  }

  /* ---- Links column ---- */
  .footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .footer-links a {
    color: #9fb0d4;
    text-decoration: none;
    font-size: 13.5px;
    transition: color 0.2s, padding-left 0.2s;
    display: inline-block;
  }
  .footer-links a:hover { color: #5badff; padding-left: 4px; }

  /* ---- Contact / office column ---- */
  .footer-contact { display: flex; flex-direction: column; gap: 16px; }
  .footer-contact-item { display: flex; gap: 10px; align-items: flex-start; }
  .footer-contact-icon {
    width: 30px; height: 30px; flex-shrink: 0;
    border-radius: 8px;
    background: rgba(90,173,255,0.12);
    display: flex; align-items: center; justify-content: center;
    color: #5badff;
  }
  .footer-contact-text { font-size: 13px; line-height: 1.55; color: #c7d3ea; }
  .footer-contact-text strong { display: block; color: #fff; font-size: 12px; font-weight: 700; margin-bottom: 2px; }
  .footer-contact-text a { color: #c7d3ea; text-decoration: none; }
  .footer-contact-text a:hover { color: #5badff; }

  .footer-map-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 700;
    color: #5badff;
    text-decoration: none;
    border-bottom: 1px dashed rgba(90,173,255,0.5);
    width: fit-content;
  }
  .footer-map-link:hover { color: #ffffff; }

  /* ---- Bottom bar ---- */
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 0;
    flex-wrap: wrap;
  }
  .footer-bottom-text { font-size: 12px; color: #7f92bc; }
  .footer-bottom-links { display: flex; gap: 18px; flex-wrap: wrap; }
  .footer-bottom-links a { font-size: 12px; color: #7f92bc; text-decoration: none; transition: color 0.2s; }
  .footer-bottom-links a:hover { color: #5badff; }

  /* ============================
     MOBILE
  ============================== */
  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 32px 20px;
    }
  }

  @media (max-width: 600px) {
    .footer-section { padding: 40px 18px 0; }
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
      padding-bottom: 28px;
    }
    .footer-desc { max-width: 100%; }
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      padding: 18px 0 24px;
    }
    .footer-heading { margin-bottom: 12px; }
  }
`;

// ── Inline social icons (lucide-react doesn't export brand/logo icons) ──
const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 10-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.56 1.53-3.98 3.87-3.98 1.12 0 2.3.2 2.3.2v2.5h-1.3c-1.28 0-1.68.8-1.68 1.6V12h2.86l-.46 2.89h-2.4v6.98A10 10 0 0022 12z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 5.9c-.77.35-1.6.58-2.46.68a4.3 4.3 0 001.88-2.38 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.14 12.14 0 013 4.9a4.28 4.28 0 001.32 5.71c-.7-.02-1.36-.22-1.94-.53v.05a4.28 4.28 0 003.43 4.2c-.62.17-1.28.2-1.94.07a4.29 4.29 0 004 2.98A8.58 8.58 0 012 18.57 12.1 12.1 0 008.29 20.4c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0022 5.9z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
    </svg>
);

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <>
            <style>{styles}</style>
            <footer className="footer-section">
                <div className="footer-blob footer-blob-1" />
                <div className="footer-blob footer-blob-2" />

                <div className="footer-container">
                    <div className="footer-grid">

                        {/* Brand */}
                        <div>
                            <div className="footer-brand-logo">
                                <img src="/footer.png" alt="Doorstep Car Wash" />
                                <div className="footer-logo-text">
                                    <span className="footer-logo-door">DOOR<span>STEP</span></span>
                                    <span className="footer-logo-sub">Car Wash · We Come To You</span>
                                </div>
                            </div>
                            <p className="footer-desc">
                                Professional car wash & detailing, delivered right to your doorstep. Book in minutes, relax while we handle the rest.
                            </p>
                            <div className="footer-socials">
                                <a href="#" className="footer-social-btn" aria-label="Facebook"><FacebookIcon /></a>
                                <a href="#" className="footer-social-btn" aria-label="Instagram"><InstagramIcon /></a>
                                <a href="#" className="footer-social-btn" aria-label="Twitter"><TwitterIcon /></a>
                                <a href="#" className="footer-social-btn" aria-label="Youtube"><YoutubeIcon /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="/">Home</a></li>
                                <li><a href="#packages">Services</a></li>
                                <li><a href="#how-it-works">How It Works</a></li>
                                <li><a href="/user/portal">Track Booking</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="footer-heading">Valuable Link</h4>
                            <ul className="footer-links">
                                <li><a href="/packages">Packages</a></li>
                                <li><a href="/about">About</a></li>
                                <li><a href="/term">Terms & Conditions</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/contact">Contact Us</a></li>









                            </ul>
                        </div>

                        {/* Contact / Office Location */}
                        <div>
                            <h4 className="footer-heading">Get In Touch</h4>
                            <div className="footer-contact">

                                <div className="footer-contact-item">
                                    <div className="footer-contact-icon"><MapPin size={15} /></div>
                                    <div className="footer-contact-text">
                                        <strong>Office Address</strong>
                                        123, Business Street, Patna, Bihar – 800001, India
                                        <br />
                                        <a
                                            className="footer-map-link"
                                            href="https://www.google.com/maps/search/?api=1&query=Patna+Bihar"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Map →
                                        </a>
                                    </div>
                                </div>

                                <div className="footer-contact-item">
                                    <div className="footer-contact-icon"><Phone size={15} /></div>
                                    <div className="footer-contact-text">
                                        <strong>Call Us</strong>
                                        <a href="tel:+911234567890">+91 12345 67890</a>
                                    </div>
                                </div>

                                <div className="footer-contact-item">
                                    <div className="footer-contact-icon"><Mail size={15} /></div>
                                    <div className="footer-contact-text">
                                        <strong>Email</strong>
                                        <a href="mailto:support@doorstepcarwash.com">support@doorstepcarwash.com</a>
                                    </div>
                                </div>

                                <div className="footer-contact-item">
                                    <div className="footer-contact-icon"><Clock size={15} /></div>
                                    <div className="footer-contact-text">
                                        <strong>Working Hours</strong>
                                        Mon – Sun: 8:00 AM – 8:00 PM
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Bottom bar */}
                    <div className="footer-bottom">
                        <span className="footer-bottom-text">
                            © {2026} Doorstep Car Wash. All rights reserved.
                        </span>
                        <div className="footer-bottom-links">
                            <a href="/term">Terms & Conditions</a>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/user/deleteaccount">Delete Account</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}