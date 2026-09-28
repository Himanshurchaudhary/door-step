import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @keyframes logoSlideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes linkFadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mobileMenuOpen {
    from { opacity: 0; transform: translateY(-8px); max-height: 0; }
    to   { opacity: 1; transform: translateY(0); max-height: 600px; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 2px 10px rgba(26,46,110,0.18); }
    50%       { box-shadow: 0 4px 20px rgba(26,140,255,0.45); }
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 68px;
    background: #ffffff;
    box-shadow: 0 2px 10px rgba(0,0,80,0.10);
    position: sticky;
    top: 0;
    z-index: 100;
    overflow: visible;
    transition: height 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }
  .navbar.scrolled {
    height: 56px;
    box-shadow: 0 4px 20px rgba(0,0,80,0.18);
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(6px);
  }

  /* ── Logo ── */
  .navbar-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; user-select: none;
    animation: logoSlideIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  .navbar.scrolled .navbar-logo img { width: 80px !important; height: 48px !important; }
  .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
  .logo-door { font-size: 1.25rem; font-weight: 800; color: #1a2e6e; letter-spacing: -0.5px; }
  .logo-door span { color: #1a8cff; }
  .logo-sub { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.16em; color: #1a8cff; text-transform: uppercase; }

  /* ── Nav links ── */
  .navbar-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .navbar-links > li {
    opacity: 0;
    animation: linkFadeDown 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .navbar-links > li:nth-child(1) { animation-delay: 0.10s; }
  .navbar-links > li:nth-child(2) { animation-delay: 0.18s; }
  .navbar-links > li:nth-child(3) { animation-delay: 0.26s; }
  .navbar-links > li:nth-child(4) { animation-delay: 0.34s; }

  .navbar-links a {
    position: relative; text-decoration: none; color: #1a2e6e;
    font-size: 0.95rem; font-weight: 600; letter-spacing: 0.01em;
    transition: color 0.2s; white-space: nowrap; padding-bottom: 2px;
  }
  .navbar-links a::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0%; height: 2px; background: #1a8cff; border-radius: 2px;
    transition: width 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  .navbar-links a:hover { color: #1a8cff; }
  .navbar-links a:hover::after { width: 100%; }

  /* Mobile buttons li — desktop pe hide */
  .mobile-only-li { display: none !important; }

  /* ── Desktop right buttons ── */
  .navbar-right { display: flex; align-items: center; gap: 10px; }

  .btn-book {
  display: inline-flex; align-items: center; gap: 7px;
  background: #1a2e6e; color: #ffffff; border: none;
  border-radius: 28px; padding: 10px 20px; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background 0.2s, transform 0.15s, color 0.2s, opacity 0.2s;
  animation: linkFadeDown 0.45s 0.42s cubic-bezier(0.22,1,0.36,1) forwards,
             pulseGlow 3s ease-in-out 1.5s infinite;
}
.btn-book:hover {
  background: #1a8cff;
  color: #ffffff !important;
  opacity: 1 !important;
  transform: translateY(-2px) scale(1.03);
  animation: pulseGlow 0s;
}
  .btn-book:active { transform: translateY(0) scale(0.98); }

  .btn-track {
    display: inline-flex; align-items: center; gap: 6px;
    border: 1.5px solid #1a2e6e; color: #1a2e6e; background: transparent;
    border-radius: 28px; padding: 8px 16px; font-size: 0.85rem; font-weight: 700;
    cursor: pointer; white-space: nowrap; text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .btn-track:hover { background: #1a2e6e; color: #fff; }

  .btn-partner {
    display: inline-flex; align-items: center; gap: 6px;
    border: 1.5px solid #6366F1; color: #6366F1; background: transparent;
    border-radius: 28px; padding: 8px 16px; font-size: 0.85rem; font-weight: 700;
    cursor: pointer; white-space: nowrap; text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .btn-partner:hover { background: #6366F1; color: #fff; }

  /* ── Hamburger ── */
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .hamburger span {
    display: block; width: 24px; height: 2.5px; background: #1a2e6e;
    border-radius: 2px;
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease;
    transform-origin: center;
  }
  .hamburger.active span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
  .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.active span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

  /* ── Mobile ── */
  @media (max-width: 900px) {
    .navbar { padding: 0 18px; }
    .hamburger { display: flex; }

    /* Desktop buttons hide */
    .btn-track, .btn-partner, .btn-book { display: none !important; }

    .navbar-links {
      display: none;
      position: absolute;
      top: 68px; left: 0; right: 0;
      background: #fff;
      flex-direction: column;
      gap: 0; align-items: flex-start;
      box-shadow: 0 6px 16px rgba(0,0,80,0.10);
      padding: 8px 0 0;
      overflow: hidden;
    }
    .navbar-links.open {
      display: flex;
      animation: mobileMenuOpen 0.32s cubic-bezier(0.22,1,0.36,1) both;
    }
    .navbar-links > li {
      opacity: 1 !important;
      animation: linkFadeDown 0.3s cubic-bezier(0.22,1,0.36,1) both;
      width: 100%;
    }
    .navbar-links.open > li:nth-child(1) { animation-delay: 0.05s; }
    .navbar-links.open > li:nth-child(2) { animation-delay: 0.10s; }
    .navbar-links.open > li:nth-child(3) { animation-delay: 0.15s; }
    .navbar-links.open > li:nth-child(4) { animation-delay: 0.20s; }

    .navbar-links a { display: block; padding: 12px 24px; }

    /* Show mobile buttons li */
    .mobile-only-li {
      display: block !important;
      width: 100%;
      opacity: 1 !important;
      animation: none !important;
    }

    .mobile-menu-btns {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 20px 20px;
      border-top: 1px solid #F1F5F9;
      margin-top: 6px;
      width: 100%;
    }

    .btn-track-mob {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      border: 1.5px solid #1a2e6e; color: #1a2e6e; background: transparent;
      border-radius: 28px; padding: 11px 18px; font-size: 0.9rem; font-weight: 700;
      text-decoration: none; width: 100%;
      transition: background 0.2s, color 0.2s;
    }
    .btn-track-mob:hover { background: #1a2e6e; color: #fff; }

    .btn-partner-mob {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      border: 1.5px solid #6366F1; color: #6366F1; background: transparent;
      border-radius: 28px; padding: 11px 18px; font-size: 0.9rem; font-weight: 700;
      text-decoration: none; width: 100%;
      transition: background 0.2s, color 0.2s;
    }
    .btn-partner-mob:hover { background: #6366F1; color: #fff; }

    .btn-book-mob {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: #1a2e6e; color: #ffffff !important; border: none;
  border-radius: 28px; padding: 11px 18px; font-size: 0.9rem; font-weight: 700;
  text-decoration: none; width: 100%; cursor: pointer; font-family: inherit;
  transition: background 0.2s;
}
    .btn-book-mob:hover { background: #1a8cff; }
  }

  @media (prefers-reduced-motion: reduce) {
    .navbar-logo, .navbar-links li, .btn-book { animation: none; opacity: 1; }
    .hamburger span, .navbar-links a::after, .navbar, .btn-book { transition: none; }
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();   // ← NEW


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setMenuOpen(false);
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    close();
    const scrollToSection = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname === "/") {
      scrollToSection();
    } else {
      navigate("/");
      setTimeout(scrollToSection, 300);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img
            src="/logo.webp"
            alt="Doorstep Car Wash"
            style={{
              width: "100px", height: "60px",
              objectFit: "contain",
              transition: "width 0.3s, height 0.3s",
            }}
          />
          <div className="logo-text">
            <span className="logo-door">DOOR<span>STEP</span></span>
            <span className="logo-sub">Car Wash · We Come To You</span>
          </div>
        </a>

        {/* Nav links */}
        <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
          <li><a href="#packages" onClick={(e) => handleNavClick(e, "packages")}>Services</a></li>
          <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")}>How It Works</a></li>
                    <li><a href="#About" onClick={(e) => handleNavClick(e, "About")}>About</a></li>


          {/* Mobile-only buttons — desktop pe CSS se hide */}
          <li className="mobile-only-li">
            <div className="mobile-menu-btns">
              <a href="/user/portal" className="btn-track-mob" onClick={close}>⏱ Track Booking</a>
              <a href="/partner/portal" className="btn-partner-mob" onClick={close}>🔧 Partner Login</a>
              <a
                href="/packages"
                className="btn-book-mob"
                onClick={close}
                style={{ color: "#ffffff" }}
              >
                Book Now →
              </a>
            </div>
          </li>
        </ul>

        {/* Desktop right side */}
        <div className="navbar-right">
          <a href="/user/portal" className="btn-track">⏱ Track Booking</a>
          <a href="/partner/portal" className="btn-partner">🔧 Partner Login</a>
          <a href="/packages" className="btn-book">Book Now →</a>
          <button
            className={`hamburger${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

      </nav>
    </>
  );
}