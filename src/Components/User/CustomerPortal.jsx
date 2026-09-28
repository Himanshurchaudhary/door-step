// CustomerPortal.jsx
import React, { useEffect, useState } from "react";

const API_BASE  = `${import.meta.env.VITE_API_URL}/api`;
const TOKEN_KEY = "userToken";

const STATUS_COLOR = {
  pending:     { bg: "#FEF9EE", text: "#92610A", dot: "#F59E0B", label: "Pending" },
  confirmed:   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6", label: "Confirmed" },
  in_progress: { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6", label: "In Progress" },
  completed:   { bg: "#F0FDF4", text: "#166534", dot: "#22C55E", label: "Completed" },
  cancelled:   { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", label: "Cancelled" },
};

const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtTime = (t) => {
  if (!t || !/^\d{2}:\d{2}$/.test(t)) return t || "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export default function CustomerPortal() {
  const [token, setToken]       = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);

  // Load data after login
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/customer-auth/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setBookings(d.data);
          setStats(d.stats);
        } else {
          // Token expired
          handleLogout();
        }
      })
      .catch(() => handleLogout())
      .finally(() => setLoading(false));

    fetch(`${API_BASE}/customer-auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setCustomer(d.data); });
  }, [token]);

  const handleLogin = (tok, cust) => {
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setCustomer(cust);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setCustomer(null);
    setBookings([]);
    setStats(null);
    setSelected(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="cp-root">
      <style>{CSS}</style>

      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-brand">
          <div className="cp-brand-dot" />
          <span className="cp-brand-name">User Dashboard</span>
        </div>
        <div className="cp-header-right">
          {customer && (
            <div className="cp-user-chip">
              <div className="cp-user-avatar">{customer.name?.[0]?.toUpperCase()}</div>
              <span>{customer.name}</span>
            </div>
          )}
          <button className="cp-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="cp-body">
        {/* Stats strip */}
        {stats && (
          <div className="cp-stats-strip">
            {[
              { label: "Total",      value: stats.total,      color: "#6366F1" },
              { label: "Pending",    value: stats.pending,    color: "#F59E0B" },
              { label: "Confirmed",  value: stats.confirmed,  color: "#3B82F6" },
              { label: "In Progress",value: stats.inProgress, color: "#8B5CF6" },
              { label: "Completed",  value: stats.completed,  color: "#22C55E" },
              { label: "Cancelled",  value: stats.cancelled,  color: "#EF4444" },
              { label: "Total Spent",value: fmt(stats.totalSpent), color: "#0F172A", big: true },
            ].map((s) => (
              <div className="cp-stat" key={s.label}>
                <div className="cp-stat-val" style={{ color: s.color, fontSize: s.big ? 15 : 22 }}>{s.value}</div>
                <div className="cp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section title */}
        <div className="cp-section-title">My Bookings</div>

        {loading ? (
          <div className="cp-center"><div className="cp-spinner" /><p>Loading bookings…</p></div>
        ) : bookings.length === 0 ? (
          <div className="cp-center">
            <div style={{ fontSize: 40 }}>📭</div>
            <p style={{ fontWeight: 600, color: "#334155", margin: "8px 0 4px" }}>No bookings yet</p>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>Aapki koi booking nahi mili.</p>
          </div>
        ) : (
          <div className="cp-bookings-grid">
            {bookings.map((b) => (
              <BookingCard key={b.id} b={b} onClick={() => setSelected(b)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <BookingModal b={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]    = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      setError("10 digit mobile number daalo");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/customer-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token, data.customer);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server se connect nahi ho paaya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-login-root">
      <style>{CSS}</style>
      <div className="cp-login-card">
        <div className="cp-login-brand">
          <div className="cp-brand-dot lg" />
          <span className="cp-brand-name lg">User Dashboard</span>
        </div>
        <h2 className="cp-login-title">Track Your Bookings</h2>
        <p className="cp-login-sub">Apna registered mobile number daalo</p>

        <div className="cp-login-input-wrap">
          <span className="cp-login-prefix">+91</span>
          <input
            className="cp-login-input"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10 digit mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {error && <div className="cp-login-error">{error}</div>}

        <button
          className="cp-login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="cp-spinner sm" /> : "View My Bookings →"}
        </button>

        <p className="cp-login-note">
          Password nahi chahiye — sirf woh number jo booking mein use kiya tha.
        </p>
      </div>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ b, onClick }) {
  const sc = STATUS_COLOR[b.status] || {};
  return (
    <div className="cp-bk-card" onClick={onClick}>
      <div className="cp-bk-card-top">
        <div>
          <div className="cp-bk-id">Booking #{b.id}</div>
          <div className="cp-bk-datetime">{fmtDate(b.bookingDate)} · {fmtTime(b.bookingTime)}</div>
        </div>
        <span className="cp-status-pill" style={{ background: sc.bg, color: sc.text }}>
          <span className="cp-dot" style={{ background: sc.dot }} />
          {sc.label}
        </span>
      </div>

      <div className="cp-bk-info-row">
        <InfoChip icon="🏙️" label={b.cityName} />
        <InfoChip icon="🚗" label={b.carTypeName} />
        {b.packageName && <InfoChip icon="📦" label={b.packageName} accent />}
      </div>

      {b.partner ? (
        <div className="cp-bk-partner-strip">
          <span className="cp-partner-label">👷 Assigned Partner</span>
          <span className="cp-partner-name">{b.partner.name}</span>
        </div>
      ) : (
        <div className="cp-bk-partner-strip unassigned">
          <span className="cp-partner-label">Partner not assigned yet</span>
        </div>
      )}

      <div className="cp-bk-footer">
        <span className="cp-bk-total">{fmt(b.totalPrice)}</span>
        <span className="cp-bk-view-hint">View details →</span>
      </div>
    </div>
  );
}

// ── Booking Detail Modal ──────────────────────────────────────────────────────
function BookingModal({ b, onClose }) {
  const sc = STATUS_COLOR[b.status] || {};
  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="cp-modal-hd">
          <div>
            <div className="cp-modal-bk-id">Booking #{b.id}</div>
            <div className="cp-modal-datetime">{fmtDate(b.bookingDate)} · {fmtTime(b.bookingTime)}</div>
          </div>
          <div className="cp-modal-hd-right">
            <span className="cp-status-pill" style={{ background: sc.bg, color: sc.text }}>
              <span className="cp-dot" style={{ background: sc.dot }} />
              {sc.label}
            </span>
            <button className="cp-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="cp-modal-body">

          {/* Service */}
          <ModalSection title="Service Details">
            <ModalGrid>
              <ModalField label="City"     value={b.cityName} />
              <ModalField label="Car Type" value={b.carTypeName} />
              {b.packageName && <ModalField label="Package" value={b.packageName} accent />}
            </ModalGrid>
            {b.addons?.length > 0 && (
              <div className="cp-addons-wrap">
                <div className="cp-addons-label">Add-ons</div>
                <div className="cp-addons-list">
                  {b.addons.map((a) => (
                    <div key={a.id} className="cp-addon-row">
                      <span>+ {a.name}</span>
                      <span className="cp-addon-price">{fmt(a.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ModalSection>

          {/* Address */}
          <ModalSection title="Service Address">
            {b.addressType === "full_address" ? (
              <p className="cp-address-text">{b.fullAddress || "—"}</p>
            ) : (
              <div className="cp-loc-wrap">
                <span>📍 {b.latitude && b.longitude
                  ? `${Number(b.latitude).toFixed(5)}, ${Number(b.longitude).toFixed(5)}`
                  : "Location not available"}</span>
                {b.latitude && b.longitude && (
                 <a 
                    href={`https://maps.google.com/?q=${b.latitude},${b.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="cp-maps-link"
                  >Open in Google Maps →</a>
                )}
              </div>
            )}
          </ModalSection>

          {/* Partner */}
          <ModalSection title="Assigned Partner">
            {b.partner ? (
              <div className="cp-partner-card">
                <div className="cp-partner-avatar">
                  {b.partner.profilePic
                    ? <img src={b.partner.profilePic} alt={b.partner.name} className="cp-partner-img" />
                    : <span>{b.partner.name?.[0]?.toUpperCase()}</span>}
                </div>
                <div className="cp-partner-info">
                  <div className="cp-partner-card-name">{b.partner.name}</div>
                  {b.partner.mobile && (
                    <a href={`tel:${b.partner.mobile}`} className="cp-partner-phone">
                      📞 {b.partner.mobile}
                    </a>
                  )}
                  {b.partner.aadharAddress && (
                    <div className="cp-partner-aadhar">
                      <div className="cp-partner-aadhar-label">Aadhar Address</div>
                      <div className="cp-partner-aadhar-val">{b.partner.aadharAddress}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="cp-no-partner">
                <span>⏳</span>
                <p>Partner abhi assign nahi hua. Jald hi assign kiya jayega.</p>
              </div>
            )}
          </ModalSection>

          {/* Notes */}
          {b.notes && (
            <ModalSection title="Notes">
              <p className="cp-notes-text">{b.notes}</p>
            </ModalSection>
          )}
        </div>

        {/* Footer total */}
        <div className="cp-modal-footer">
          <span className="cp-modal-total-label">Total Amount</span>
          <span className="cp-modal-total-val">{fmt(b.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────
const InfoChip = ({ icon, label, accent }) => (
  <span className={`cp-info-chip ${accent ? "accent" : ""}`}>
    {icon} {label}
  </span>
);

const ModalSection = ({ title, children }) => (
  <div className="cp-modal-section">
    <div className="cp-modal-section-title">{title}</div>
    {children}
  </div>
);

const ModalGrid = ({ children }) => <div className="cp-modal-grid">{children}</div>;

const ModalField = ({ label, value, accent }) => (
  <div className="cp-modal-field">
    <span className="cp-mf-label">{label}</span>
    <span className={`cp-mf-val ${accent ? "accent" : ""}`}>{value}</span>
  </div>
);

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cp-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F8FAFC; min-height: 100vh; color: #0F172A;
}

/* ── Header ── */
.cp-header {
  background: #0F172A; color: #fff;
  padding: 14px 20px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.cp-header-brand { display: flex; align-items: center; gap: 10px; }
.cp-brand-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
}
.cp-brand-dot.lg { width: 16px; height: 16px; }
.cp-brand-name { font-size: 14px; font-weight: 800; letter-spacing: 1px; }
.cp-brand-name.lg { font-size: 22px; letter-spacing: 2px; color: #0F172A; }
.cp-header-right { display: flex; align-items: center; gap: 10px; }
.cp-user-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.1); border-radius: 20px;
  padding: 5px 12px; font-size: 13px; font-weight: 500;
}
.cp-user-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg,#6366F1,#8B5CF6);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}
.cp-logout-btn {
  background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px; padding: 6px 14px; font-size: 12.5px; font-weight: 500;
  cursor: pointer; font-family: inherit;
}
.cp-logout-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Body ── */
.cp-body { max-width: 900px; margin: 0 auto; padding: 20px 16px; }

/* ── Stats strip ── */
.cp-stats-strip {
  display: grid; grid-template-columns: repeat(7, 1fr);
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden; margin-bottom: 20px;
}
.cp-stat {
  padding: 14px 10px; text-align: center;
  border-right: 1px solid #F1F5F9;
}
.cp-stat:last-child { border-right: none; }
.cp-stat-val   { font-size: 22px; font-weight: 800; line-height: 1; }
.cp-stat-label { font-size: 10px; color: #64748B; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

/* ── Section title ── */
.cp-section-title {
  font-size: 13px; font-weight: 700; color: #94A3B8;
  text-transform: uppercase; letter-spacing: 0.07em;
  margin-bottom: 14px;
}

/* ── Bookings grid ── */
.cp-bookings-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 14px;
}

/* ── Booking card ── */
.cp-bk-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden; cursor: pointer;
  transition: box-shadow 0.15s, transform 0.1s;
}
.cp-bk-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  transform: translateY(-2px);
}
.cp-bk-card-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 14px 14px 10px;
}
.cp-bk-id       { font-size: 11px; font-weight: 700; color: #94A3B8; font-family: monospace; }
.cp-bk-datetime { font-size: 12.5px; color: #334155; font-weight: 500; margin-top: 2px; }

.cp-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap;
}
.cp-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.cp-bk-info-row {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 0 14px 10px;
}
.cp-info-chip {
  display: inline-flex; align-items: center; gap: 4px;
  background: #F1F5F9; color: #475569;
  font-size: 11.5px; font-weight: 500;
  padding: 3px 9px; border-radius: 20px;
}
.cp-info-chip.accent {
  background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE;
}

.cp-bk-partner-strip {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; background: #F0FDF4;
  border-top: 1px solid #F1F5F9;
}
.cp-bk-partner-strip.unassigned { background: #F8FAFC; }
.cp-partner-label { font-size: 11px; color: #64748B; }
.cp-partner-name  { font-size: 12.5px; font-weight: 700; color: #166534; }

.cp-bk-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-top: 1px solid #F1F5F9;
  background: #F8FAFC;
}
.cp-bk-total     { font-size: 16px; font-weight: 800; color: #0F172A; }
.cp-bk-view-hint { font-size: 11.5px; color: #6366F1; font-weight: 600; }

/* ── Modal ── */
.cp-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
  animation: cp-fade 0.15s ease;
}
@keyframes cp-fade { from { opacity: 0; } to { opacity: 1; } }

.cp-modal {
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  animation: cp-pop 0.2s ease;
}
@keyframes cp-pop {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.cp-modal-hd {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 20px 20px 14px; border-bottom: 1px solid #F1F5F9;
}
.cp-modal-bk-id   { font-size: 12px; font-weight: 700; color: #94A3B8; font-family: monospace; }
.cp-modal-datetime { font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 2px; }
.cp-modal-hd-right { display: flex; align-items: center; gap: 10px; }
.cp-modal-close {
  background: #F1F5F9; border: none; border-radius: 8px;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 14px; color: #64748B;
}
.cp-modal-close:hover { background: #E2E8F0; }

.cp-modal-body { padding: 4px 0; }
.cp-modal-section { padding: 14px 20px; border-bottom: 1px solid #F8FAFC; }
.cp-modal-section:last-child { border-bottom: none; }
.cp-modal-section-title {
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #94A3B8; margin-bottom: 10px;
}
.cp-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.cp-modal-field { display: flex; flex-direction: column; gap: 2px; }
.cp-mf-label { font-size: 10.5px; color: #94A3B8; }
.cp-mf-val   { font-size: 13.5px; color: #0F172A; font-weight: 500; }
.cp-mf-val.accent { color: #4338CA; font-weight: 700; }

.cp-addons-wrap { margin-top: 10px; }
.cp-addons-label { font-size: 11px; color: #94A3B8; margin-bottom: 6px; }
.cp-addons-list { display: flex; flex-direction: column; gap: 4px; }
.cp-addon-row {
  display: flex; justify-content: space-between;
  font-size: 13px; color: #475569;
  padding: 5px 0; border-top: 1px dashed #E2E8F0;
}
.cp-addon-price { font-weight: 600; color: #334155; }

.cp-address-text { font-size: 13.5px; color: #334155; line-height: 1.5; }
.cp-loc-wrap { display: flex; flex-direction: column; gap: 6px; font-size: 13.5px; color: #334155; }
.cp-maps-link { font-size: 12.5px; font-weight: 600; color: #6366F1; text-decoration: none; }
.cp-maps-link:hover { text-decoration: underline; }

/* ── Partner card in modal ── */
.cp-partner-card {
  display: flex; gap: 14px; align-items: flex-start;
  background: #F8FAFC; border: 1px solid #E2E8F0;
  border-radius: 10px; padding: 14px;
}
.cp-partner-avatar {
  width: 48px; height: 48px; border-radius: 12px;
  background: linear-gradient(135deg,#6366F1,#8B5CF6);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0;
  overflow: hidden;
}
.cp-partner-img { width: 100%; height: 100%; object-fit: cover; }
.cp-partner-info { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.cp-partner-card-name { font-size: 15px; font-weight: 700; color: #0F172A; }
.cp-partner-phone {
  font-size: 13px; font-weight: 600; color: #6366F1;
  text-decoration: none;
}
.cp-partner-phone:hover { text-decoration: underline; }
.cp-partner-aadhar { margin-top: 6px; }
.cp-partner-aadhar-label {
  font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em;
  color: #94A3B8; margin-bottom: 3px;
}
.cp-partner-aadhar-val {
  font-size: 12.5px; color: #334155; line-height: 1.5;
  background: #EEF2FF; padding: 6px 10px; border-radius: 6px;
  border: 1px solid #C7D2FE;
}

.cp-no-partner {
  display: flex; align-items: center; gap: 10px;
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 10px; padding: 12px 14px;
  font-size: 13px; color: #92610A;
}

.cp-notes-text {
  font-size: 13.5px; color: #334155; line-height: 1.5;
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 9px; padding: 10px 14px;
}

.cp-modal-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  border-radius: 0 0 16px 16px;
}
.cp-modal-total-label { font-size: 13px; color: #64748B; font-weight: 500; }
.cp-modal-total-val   { font-size: 22px; font-weight: 800; color: #0F172A; }

/* ── Login page ── */
.cp-login-root {
  min-height: 100vh; background: #F8FAFC;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; font-family: 'Inter', system-ui, sans-serif;
}
.cp-login-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 20px;
  padding: 36px 32px; width: 100%; max-width: 380px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  text-align: center;
}
.cp-login-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.cp-login-title { font-size: 22px; font-weight: 800; color: #0F172A; }
.cp-login-sub   { font-size: 13px; color: #64748B; }

.cp-login-input-wrap {
  display: flex; align-items: center;
  border: 1.5px solid #E2E8F0; border-radius: 10px;
  overflow: hidden; width: 100%; background: #F8FAFC;
  margin-top: 4px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cp-login-input-wrap:focus-within {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  background: #fff;
}
.cp-login-prefix {
  padding: 12px 12px; font-size: 13.5px; font-weight: 600;
  color: #64748B; border-right: 1.5px solid #E2E8F0;
  background: #F1F5F9; white-space: nowrap;
}
.cp-login-input {
  flex: 1; border: none; outline: none; background: transparent;
  padding: 12px 14px; font-size: 15px; font-family: monospace;
  color: #0F172A; letter-spacing: 1px;
}
.cp-login-input::placeholder { color: #CBD5E1; letter-spacing: 0; }

.cp-login-error {
  width: 100%; background: #FEF2F2; color: #991B1B;
  border: 1px solid #FECACA; border-radius: 8px;
  padding: 10px 14px; font-size: 13px; text-align: left;
}
.cp-login-btn {
  width: 100%; padding: 13px;
  background: #0F172A; color: #fff;
  border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700; font-family: inherit;
  cursor: pointer; margin-top: 4px;
  transition: background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.cp-login-btn:hover:not(:disabled) { background: #1E293B; }
.cp-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.cp-login-note {
  font-size: 11.5px; color: #94A3B8; line-height: 1.5;
  margin-top: 4px;
}

/* ── Spinner ── */
.cp-spinner {
  width: 28px; height: 28px; border: 3px solid #E2E8F0;
  border-top-color: #6366F1; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.cp-spinner.sm { width: 18px; height: 18px; border-width: 2.5px; }
@keyframes spin { to { transform: rotate(360deg); } }

.cp-center {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 60px 20px; color: #64748B;
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .cp-stats-strip { grid-template-columns: repeat(4, 1fr); }
  .cp-stat:nth-child(n+5) { border-top: 1px solid #F1F5F9; }
  .cp-bookings-grid { grid-template-columns: 1fr; }
  .cp-modal-grid { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .cp-stats-strip { grid-template-columns: repeat(2, 1fr); }
  .cp-login-card { padding: 28px 20px; }
}
`;