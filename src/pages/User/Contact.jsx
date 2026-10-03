import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .cu-page {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #f7f9fc;
    color: #33415c;
    padding-bottom: 60px;
    overflow-x: hidden;
  }

  /* ---- Hero ---- */
  .cu-hero {
    background: linear-gradient(135deg, #0f1f4b 0%, #1a3a7a 100%);
    padding: 64px 20px 140px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cu-hero::before {
    content: '';
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: #2a7de1;
    opacity: 0.14;
    top: -140px; right: -90px;
  }
  .cu-hero-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #5badff;
    text-transform: uppercase;
    margin-bottom: 12px;
    opacity: 0;
    animation: cuFadeUp 0.6s ease 0.05s forwards;
  }
  .cu-hero h1 {
    font-size: clamp(28px, 5.5vw, 46px);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.6px;
    opacity: 0;
    animation: cuFadeUp 0.6s ease 0.15s forwards;
  }
  .cu-hero p {
    font-size: 14px;
    color: #a8c4e8;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0;
    animation: cuFadeUp 0.6s ease 0.25s forwards;
  }

  @keyframes cuFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ============================
     TWO IMAGE STYLES SECTION
  ============================== */
  .cu-images-wrap {
    max-width: 1000px;
    margin: -95px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 40px;
    flex-wrap: wrap;
  }

  /* ---- Style A: Polaroid, straight border, slight tilt ---- */
  @keyframes cuPolaroidIn {
    from { opacity: 0; transform: translateY(40px) rotate(0deg); }
    to   { opacity: 1; transform: translateY(0) rotate(-4deg); }
  }
  .cu-img-polaroid {
    background: #ffffff;
    padding: 12px 12px 44px;
    border-radius: 4px;
    box-shadow: 0 18px 40px rgba(15,31,75,0.28);
    width: 220px;
    transform: rotate(-4deg);
    opacity: 0;
    animation: cuPolaroidIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    position: relative;
    cursor: default;
  }
  .cu-img-polaroid:hover {
    transform: rotate(0deg) translateY(-8px) scale(1.03);
    box-shadow: 0 26px 54px rgba(15,31,75,0.34);
  }
  .cu-img-polaroid img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 2px;
    display: block;
  }
  .cu-img-polaroid-caption {
    position: absolute;
    bottom: 12px; left: 0; right: 0;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #0f1f4b;
    font-family: 'Inter', sans-serif;
  }

  /* ---- Style B: Organic blob border + floating glow ---- */
  @keyframes cuBlobIn {
    from { opacity: 0; transform: translateY(40px) rotate(0deg) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) rotate(3deg) scale(1); }
  }
  @keyframes cuFloat {
    0%, 100% { transform: rotate(3deg) translateY(0); }
    50%      { transform: rotate(3deg) translateY(-10px); }
  }
  @keyframes cuGlowPulse {
    0%, 100% { box-shadow: 0 0 0 6px rgba(90,173,255,0.15), 0 20px 45px rgba(15,31,75,0.25); }
    50%      { box-shadow: 0 0 0 10px rgba(90,173,255,0.28), 0 20px 45px rgba(15,31,75,0.25); }
  }
  .cu-img-blob {
    width: 230px;
    height: 260px;
    border-radius: 42% 58% 63% 37% / 47% 41% 59% 53%;
    overflow: hidden;
    border: 5px solid #ffffff;
    opacity: 0;
    position: relative;
    transform-origin: center;
    animation:
      cuBlobIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s forwards,
      cuFloat 5s ease-in-out 1.2s infinite,
      cuGlowPulse 3.4s ease-in-out 1.2s infinite;
    transition: border-radius 0.6s ease, transform 0.35s ease;
    cursor: default;
  }
  .cu-img-blob:hover {
    border-radius: 50%;
    transform: rotate(0deg) scale(1.05);
  }
  .cu-img-blob img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cu-img-blob-badge {
    position: absolute;
    bottom: 14px; left: 50%;
    transform: translateX(-50%);
    background: #0f1f4b;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    padding: 5px 12px;
    border-radius: 50px;
    white-space: nowrap;
    text-transform: uppercase;
  }

  /* ============================
     Main content
  ============================== */
  .cu-container {
    max-width: 1000px;
    margin: 56px auto 0;
    padding: 0 20px;
  }

  .cu-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 28px;
    align-items: start;
  }

  /* ---- Info card ---- */
  .cu-info-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(15,31,75,0.07);
    padding: 28px 24px;
  }
  .cu-info-title {
    font-size: 18px;
    font-weight: 800;
    color: #0f1f4b;
    margin: 0 0 6px;
  }
  .cu-info-sub {
    font-size: 13px;
    color: #7a8bb0;
    margin: 0 0 22px;
    line-height: 1.6;
  }
  .cu-info-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px 0;
    border-top: 1px solid #eef1f8;
  }
  .cu-info-item:first-of-type { border-top: none; }
  .cu-info-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: #eaf1ff;
    color: #2a7de1;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cu-info-text strong { display: block; font-size: 13px; color: #0f1f4b; margin-bottom: 2px; }
  .cu-info-text span, .cu-info-text a {
    font-size: 13px; color: #6b7ba0; line-height: 1.5; text-decoration: none;
  }
  .cu-info-text a:hover { color: #2a7de1; }

  .cu-map-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #2a7de1;
    text-decoration: none;
    border-bottom: 1px dashed rgba(42,125,225,0.5);
    width: fit-content;
  }

  /* ---- Form card ---- */
  .cu-form-card {
    background: #0f1f4b;
    border-radius: 16px;
    padding: 30px 26px;
    box-shadow: 0 10px 34px rgba(15,31,75,0.22);
  }
  .cu-form-title { font-size: 18px; font-weight: 800; color: #fff; margin: 0 0 6px; }
  .cu-form-sub { font-size: 13px; color: #a8c4e8; margin: 0 0 22px; line-height: 1.6; }

  .cu-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .cu-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .cu-field label { font-size: 12px; font-weight: 700; color: #c7d3ea; }
  .cu-field input, .cu-field textarea {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13.5px;
    color: #ffffff;
    font-family: inherit;
    outline: none;
    transition: border 0.2s, background 0.2s;
    resize: vertical;
  }
  .cu-field input::placeholder, .cu-field textarea::placeholder { color: #7f92bc; }
  .cu-field input:focus, .cu-field textarea:focus {
    border-color: #5badff;
    background: rgba(255,255,255,0.09);
  }

  .cu-submit-btn {
    width: 100%;
    background: #2a7de1;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 13px 0;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, transform 0.15s;
    margin-top: 6px;
  }
  .cu-submit-btn:hover { background: #1a63c5; transform: translateY(-1px); }
  .cu-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .cu-success {
    display: flex; align-items: center; gap: 10px;
    background: rgba(45,158,45,0.15);
    border: 1px solid rgba(45,158,45,0.35);
    color: #7be08a;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 14px;
  }

  /* ============================
     MOBILE
  ============================== */
  @media (max-width: 860px) {
    .cu-grid { grid-template-columns: 1fr; }
    .cu-form-row { grid-template-columns: 1fr; gap: 0; }
  }

  @media (max-width: 640px) {
    .cu-hero { padding: 48px 16px 200px; }
    .cu-images-wrap { margin-top: -180px; gap: 22px; }
    .cu-img-polaroid { width: 150px; }
    .cu-img-polaroid img { height: 150px; }
    .cu-img-blob { width: 160px; height: 190px; }
    .cu-container { margin-top: 32px; padding: 0 14px; }
    .cu-info-card, .cu-form-card { padding: 22px 18px; border-radius: 14px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cu-hero-eyebrow, .cu-hero h1, .cu-hero p,
    .cu-img-polaroid, .cu-img-blob {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: replace with real API call, e.g.
    // await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, { method: "POST", body: JSON.stringify(form) })
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }, 900);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cu-page">

        {/* Hero */}
        <div className="cu-hero">
          <span className="cu-hero-eyebrow">GET IN TOUCH</span>
          <h1>Contact Us</h1>
          <p>
            Questions about a booking, a service package, or becoming a partner? Our team is
            ready to help — reach out any way that suits you.
          </p>
        </div>

        {/* Two animated image styles */}
        <div className="cu-images-wrap">
          <div className="cu-img-polaroid">
            <img src="/contact-team.jpg" alt="Doorstep Car Wash technician at work" />
            <div className="cu-img-polaroid-caption">Our Team, On the Job</div>
          </div>

          <div className="cu-img-blob">
            <img src="/contact-office.jpg" alt="Doorstep Car Wash office" />
            <div className="cu-img-blob-badge">Our Office</div>
          </div>
        </div>

        {/* Main content */}
        <div className="cu-container">
          <div className="cu-grid">

            {/* Info card */}
            <div className="cu-info-card">
              <h2 className="cu-info-title">Contact Information</h2>
              <p className="cu-info-sub">
                Reach us directly, or drop your details in the form and we'll get back to you
                within a few hours.
              </p>

              <div className="cu-info-item">
                <div className="cu-info-icon"><MapPin size={16} /></div>
                <div className="cu-info-text">
                  <strong>Office Address</strong>
                  <span>D/705 7th Floor Om Shanti Gold Plus, Beside Om Shanti Nagar 2,lambh Vatva Road,Narol , Ahmedabad, Gujarat ,382405</span>
                  <br />
                  <a
                    className="cu-map-link"
                    href="https://maps.google.com/?q=Door+Step+Car+Wash,Narol,Ahmedabad,Gujarat,382405"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map →
                  </a>
                </div>
              </div>

              <div className="cu-info-item">
                <div className="cu-info-icon"><Phone size={16} /></div>
                <div className="cu-info-text">
                  <strong>Call Us</strong>
                  <a href="tel:+919898249789">+91 9898249789</a>
                </div>
              </div>

              <div className="cu-info-item">
                <div className="cu-info-icon"><Mail size={16} /></div>
                <div className="cu-info-text">
                  <strong>Email</strong>
                  <a href="mailto:doorstepcarwash99@gmail.com">doorstepcarwash99@gmail.com</a>
                </div>
              </div>

              <div className="cu-info-item">
                <div className="cu-info-icon"><Clock size={16} /></div>
                <div className="cu-info-text">
                  <strong>Working Hours</strong>
                  <span>Mon – Sun: 8:00 AM – 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="cu-form-card">
              <h2 className="cu-form-title">Send Us a Message</h2>
              <p className="cu-form-sub">Fill in your details and we'll respond as soon as possible.</p>

              <form onSubmit={handleSubmit}>
                <div className="cu-form-row">
                  <div className="cu-field">
                    <label>Full Name</label>
                    <input
                      type="text" name="name" placeholder="John Doe"
                      value={form.name} onChange={handleChange} required
                    />
                  </div>
                  <div className="cu-field">
                    <label>Phone Number</label>
                    <input
                      type="tel" name="phone" placeholder="+91 98765 43210"
                      value={form.phone} onChange={handleChange} required
                    />
                  </div>
                </div>

                <div className="cu-field">
                  <label>Email Address</label>
                  <input
                    type="email" name="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required
                  />
                </div>

                <div className="cu-field">
                  <label>Message</label>
                  <textarea
                    name="message" rows={4} placeholder="How can we help you?"
                    value={form.message} onChange={handleChange} required
                  />
                </div>

                <button type="submit" className="cu-submit-btn" disabled={submitting}>
                  <Send size={15} /> {submitting ? "Sending..." : "Send Message"}
                </button>

                {submitted && (
                  <div className="cu-success">
                    <CheckCircle2 size={16} /> Message sent! We'll get back to you shortly.
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}