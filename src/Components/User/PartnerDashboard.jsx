import { useState, useEffect } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/partner-auth`;
const TOKEN_KEY = "partner_token";

const STATUS_META = {
  pending:     { label: "Pending",     bg: "#FEF9EE", color: "#92610A", dot: "#F59E0B" },
  confirmed:   { label: "Confirmed",   bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  in_progress: { label: "In Progress", bg: "#F5F3FF", color: "#6D28D9", dot: "#8B5CF6" },
  completed:   { label: "Completed",   bg: "#F0FDF4", color: "#166534", dot: "#22C55E" },
  cancelled:   { label: "Cancelled",   bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444" },
};

const NEXT_STATUSES = {
  pending:     ["confirmed", "cancelled"],
  confirmed:   ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed:   [],
  cancelled:   [],
};

const fmt = v => `₹${Number(v || 0).toLocaleString("en-IN")}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = t => {
  if (!t || !/^\d{2}:\d{2}$/.test(t)) return t || "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export default function PartnerDashboard() {
  const [token, setToken]       = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [partner, setPartner]   = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(""); setPartner(null); setBookings([]); setStats(null); setSelected(null);
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    Promise.all([
      fetch(`${API}/me`,           { headers: authHeaders }).then(r => r.json()),
      fetch(`${API}/my-bookings`,  { headers: authHeaders }).then(r => r.json()),
    ]).then(([meRes, bkRes]) => {
      if (!meRes.success) return logout();
      setPartner(meRes.data);
      if (bkRes.success) { setBookings(bkRes.data); setStats(bkRes.stats); }
    }).catch(logout).finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (bookingId, status) => {
    const res = await fetch(`${API}/booking/${bookingId}/status`, {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(r => r.json());

    if (res.success) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      if (selected?.id === bookingId) setSelected(prev => ({ ...prev, status }));
    }
  };

  if (!token) return <LoginPage onLogin={(tok, p) => { localStorage.setItem(TOKEN_KEY, tok); setToken(tok); setPartner(p); }} />;

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F8FAFC", minHeight: "100vh", color: "#0F172A" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div className="pd-header">
        <div className="pd-brand">
          <div className="pd-brand-dot" />
          <span className="pd-brand-name">Partner Portal</span>
        </div>
        <div className="pd-header-right">
          {partner && (
            <div className="pd-user-chip">
              <div className="pd-avatar">{partner.name?.[0]?.toUpperCase()}</div>
              <span>{partner.name}</span>
            </div>
          )}
          <button className="pd-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="pd-body">
        {/* Stats */}
        {stats && (
          <div className="pd-stats">
            {[
              { label: "Total",       value: stats.total,      color: "#6366F1" },
              { label: "Pending",     value: stats.pending,    color: "#F59E0B" },
              { label: "Confirmed",   value: stats.confirmed,  color: "#3B82F6" },
              { label: "In Progress", value: stats.inProgress, color: "#8B5CF6" },
              { label: "Completed",   value: stats.completed,  color: "#22C55E" },
              { label: "Cancelled",   value: stats.cancelled,  color: "#EF4444" },
              { label: "Earned",      value: fmt(stats.earned),color: "#0F172A", small: true },
            ].map(s => (
              <div className="pd-stat" key={s.label}>
                <div className="pd-stat-val" style={{ color: s.color, fontSize: s.small ? 14 : 22 }}>{s.value}</div>
                <div className="pd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="pd-tabs">
          {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map(f => (
            <button key={f} className={`pd-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : STATUS_META[f]?.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="pd-center"><div className="pd-spinner" /><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="pd-center">
            <div style={{ fontSize: 40 }}>📭</div>
            <p style={{ fontWeight: 600, color: "#334155" }}>No bookings found</p>
          </div>
        ) : (
          <div className="pd-grid">
            {filtered.map(b => (
              <BookingCard key={b.id} b={b} onView={() => setSelected(b)} onStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>

      {selected && <BookingModal b={selected} onClose={() => setSelected(null)} onStatus={updateStatus} />}
    </div>
  );
}

/* ── Login ── */
function LoginPage({ onLogin }) {
  const [mobile, setMobile]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const submit = async () => {
    setError("");
    if (!/^[0-9]{10}$/.test(mobile.trim())) return setError("Valid 10-digit mobile daalo");
    if (!password) return setError("Password daalo");
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), password }),
      }).then(r => r.json());
      if (res.success) onLogin(res.token, res.partner);
      else setError(res.message || "Login failed");
    } catch { setError("Server error. Dobara try karein."); }
    finally { setLoading(false); }
  };

  return (
    <div className="pd-login-root">
      <style>{CSS}</style>
      <div className="pd-login-card">
        <div className="pd-login-brand">
          <div className="pd-brand-dot lg" />
          <span className="pd-brand-name lg">Partner Login</span>
        </div>
        <p className="pd-login-sub">Apna mobile aur password daalo</p>

        <div className="pd-input-wrap">
          <span className="pd-input-prefix">+91</span>
          <input className="pd-input" type="tel" inputMode="numeric" maxLength={10}
            placeholder="Mobile number" value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        <div className="pd-input-wrap">
          <input className="pd-input" style={{ paddingLeft: 16 }}
            type={showPwd ? "text" : "password"}
            placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()} />
          <button className="pd-eye" onClick={() => setShowPwd(p => !p)}>
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div className="pd-error">{error}</div>}

        <button className="pd-login-btn" onClick={submit} disabled={loading}>
          {loading ? <span className="pd-spinner sm" /> : "Login →"}
        </button>
      </div>
    </div>
  );
}

/* ── Booking Card ── */
function BookingCard({ b, onView, onStatus }) {
  const sm = STATUS_META[b.status] || {};
  const next = NEXT_STATUSES[b.status] || [];

  return (
    <div className="pd-card">
      <div className="pd-card-top">
        <div>
          <div className="pd-card-id">Booking #{b.id}</div>
          <div className="pd-card-dt">{fmtDate(b.bookingDate)} · {fmtTime(b.bookingTime)}</div>
        </div>
        <span className="pd-pill" style={{ background: sm.bg, color: sm.color }}>
          <span className="pd-dot" style={{ background: sm.dot }} />{sm.label}
        </span>
      </div>

      <div className="pd-card-customer">
        <div className="pd-cust-name">👤 {b.customerName}</div>
        <a href={`tel:${b.customerNumber}`} className="pd-cust-phone">📞 {b.customerNumber}</a>
      </div>

      <div className="pd-chips">
        <span className="pd-chip">🏙️ {b.cityName}</span>
        <span className="pd-chip">🚗 {b.carTypeName}</span>
        {b.packageName && <span className="pd-chip accent">📦 {b.packageName}</span>}
      </div>

      <div className="pd-card-footer">
        <span className="pd-total">{fmt(b.totalPrice)}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pd-btn-outline" onClick={onView}>Details</button>
          {next.map(s => (
            <button key={s} className={`pd-btn-status ${s}`} onClick={() => onStatus(b.id, s)}>
              {STATUS_META[s]?.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Booking Modal ── */
function BookingModal({ b, onClose, onStatus }) {
  const sm   = STATUS_META[b.status] || {};
  const next = NEXT_STATUSES[b.status] || [];

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={e => e.stopPropagation()}>

        <div className="pd-modal-hd">
          <div>
            <div className="pd-modal-id">Booking #{b.id}</div>
            <div className="pd-modal-dt">{fmtDate(b.bookingDate)} · {fmtTime(b.bookingTime)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pd-pill" style={{ background: sm.bg, color: sm.color }}>
              <span className="pd-dot" style={{ background: sm.dot }} />{sm.label}
            </span>
            <button className="pd-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="pd-modal-body">

          {/* Customer */}
          <Section title="Customer Details">
            <Row label="Name"   value={b.customerName} />
            <Row label="Mobile" value={<a href={`tel:${b.customerNumber}`} style={{ color: "#6366F1" }}>{b.customerNumber}</a>} />
            {b.email && <Row label="Email" value={b.email} />}
          </Section>

          {/* Service */}
          <Section title="Service Details">
            <Row label="City"     value={b.cityName} />
            <Row label="Car Type" value={b.carTypeName} />
            {b.packageName && <Row label="Package" value={b.packageName} accent />}
          </Section>

          {/* Address */}
          <Section title="Service Address">
            {b.addressType === "full_address" ? (
              <p className="pd-address">{b.fullAddress || "—"}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#334155" }}>
                  📍 {b.latitude && b.longitude
                    ? `${Number(b.latitude).toFixed(5)}, ${Number(b.longitude).toFixed(5)}`
                    : "Not available"}
                </span>
                {b.latitude && b.longitude && (
                  <a href={`https://maps.google.com/?q=${b.latitude},${b.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12.5, fontWeight: 600, color: "#6366F1", textDecoration: "none" }}>
                    Open in Google Maps →
                  </a>
                )}
              </div>
            )}
          </Section>

          {/* Addons */}
          {b.addons?.length > 0 && (
            <Section title="Add-ons">
              {b.addons.map(a => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderTop: "1px dashed #E2E8F0", color: "#475569" }}>
                  <span>+ {a.name}</span>
                  <span style={{ fontWeight: 600 }}>{fmt(a.price)}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Notes */}
          {b.notes && (
            <Section title="Notes">
              <p className="pd-notes">{b.notes}</p>
            </Section>
          )}

          {/* Status update buttons */}
          {next.length > 0 && (
            <Section title="Update Status">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {next.map(s => (
                  <button key={s} className={`pd-btn-status lg ${s}`}
                    onClick={() => { onStatus(b.id, s); onClose(); }}>
                    Mark as {STATUS_META[s]?.label}
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="pd-modal-footer">
          <span style={{ fontSize: 13, color: "#64748B" }}>Total Amount</span>
          <span style={{ fontSize: 22, fontWeight: 800 }}>{fmt(b.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Small helpers ── */
const Section = ({ title, children }) => (
  <div className="pd-section">
    <div className="pd-section-title">{title}</div>
    {children}
  </div>
);

const Row = ({ label, value, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderTop: "1px solid #F1F5F9", fontSize: 13 }}>
    <span style={{ color: "#64748B" }}>{label}</span>
    <span style={{ fontWeight: 600, color: accent ? "#4338CA" : "#0F172A" }}>{value}</span>
  </div>
);

/* ── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pd-header {
  background: #0F172A; color: #fff;
  padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.pd-brand { display: flex; align-items: center; gap: 10px; }
.pd-brand-dot { width: 10px; height: 10px; border-radius: 50%; background: #6366F1; }
.pd-brand-dot.lg { width: 14px; height: 14px; }
.pd-brand-name { font-size: 14px; font-weight: 800; letter-spacing: 1px; }
.pd-brand-name.lg { font-size: 20px; color: #0F172A; }
.pd-header-right { display: flex; align-items: center; gap: 10px; }
.pd-user-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.1); border-radius: 20px; padding: 5px 12px; font-size: 13px;
}
.pd-avatar {
  width: 26px; height: 26px; border-radius: 50%; background: #6366F1;
  display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff;
}
.pd-logout {
  background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px; padding: 6px 14px; font-size: 12.5px; cursor: pointer; font-family: inherit;
}
.pd-logout:hover { background: rgba(255,255,255,0.2); }

.pd-body { max-width: 960px; margin: 0 auto; padding: 20px 16px; }

.pd-stats {
  display: grid; grid-template-columns: repeat(7, 1fr);
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;
}
.pd-stat { padding: 14px 8px; text-align: center; border-right: 1px solid #F1F5F9; }
.pd-stat:last-child { border-right: none; }
.pd-stat-val { font-size: 22px; font-weight: 800; line-height: 1; }
.pd-stat-label { font-size: 10px; color: #64748B; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

.pd-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.pd-tab {
  padding: 7px 14px; border-radius: 20px; border: 1.5px solid #E2E8F0;
  background: #fff; color: #64748B; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.pd-tab.active, .pd-tab:hover { background: #0F172A; color: #fff; border-color: #0F172A; }

.pd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }

.pd-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden; transition: box-shadow 0.15s, transform 0.1s;
}
.pd-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
.pd-card-top {
  display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 14px 10px;
}
.pd-card-id { font-size: 11px; font-weight: 700; color: #94A3B8; font-family: monospace; }
.pd-card-dt { font-size: 12.5px; color: #334155; font-weight: 500; margin-top: 2px; }
.pd-card-customer { padding: 0 14px 10px; display: flex; justify-content: space-between; align-items: center; }
.pd-cust-name { font-size: 13px; font-weight: 700; color: #0F172A; }
.pd-cust-phone { font-size: 12.5px; color: #6366F1; font-weight: 600; text-decoration: none; }
.pd-cust-phone:hover { text-decoration: underline; }

.pd-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
.pd-chip {
  display: inline-flex; align-items: center; gap: 4px;
  background: #F1F5F9; color: #475569; font-size: 11.5px; font-weight: 500;
  padding: 3px 9px; border-radius: 20px;
}
.pd-chip.accent { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }

.pd-card-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-top: 1px solid #F1F5F9; background: #F8FAFC;
}
.pd-total { font-size: 16px; font-weight: 800; color: #0F172A; }

.pd-pill {
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
  border-radius: 20px; font-size: 11.5px; font-weight: 600; white-space: nowrap;
}
.pd-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.pd-btn-outline {
  padding: 6px 12px; border-radius: 8px; border: 1.5px solid #E2E8F0;
  background: #fff; color: #0F172A; font-size: 12px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.pd-btn-outline:hover { border-color: #0F172A; }

.pd-btn-status {
  padding: 6px 12px; border-radius: 8px; border: none;
  font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.pd-btn-status.lg { padding: 10px 18px; font-size: 13px; }
.pd-btn-status.confirmed   { background: #EFF6FF; color: #1D4ED8; }
.pd-btn-status.in_progress { background: #F5F3FF; color: #6D28D9; }
.pd-btn-status.completed   { background: #F0FDF4; color: #166534; }
.pd-btn-status.cancelled   { background: #FEF2F2; color: #991B1B; }
.pd-btn-status:hover { filter: brightness(0.93); }

.pd-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
  animation: pdFade 0.15s ease;
}
@keyframes pdFade { from { opacity: 0; } to { opacity: 1; } }
.pd-modal {
  background: #fff; border-radius: 16px; width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  animation: pdPop 0.2s ease;
}
@keyframes pdPop { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1); } }
.pd-modal-hd {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 20px 20px 14px; border-bottom: 1px solid #F1F5F9;
}
.pd-modal-id { font-size: 12px; font-weight: 700; color: #94A3B8; font-family: monospace; }
.pd-modal-dt { font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 2px; }
.pd-close {
  background: #F1F5F9; border: none; border-radius: 8px;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 14px; color: #64748B;
}
.pd-close:hover { background: #E2E8F0; }
.pd-modal-body { padding: 4px 0; }
.pd-section { padding: 14px 20px; border-bottom: 1px solid #F8FAFC; }
.pd-section-title {
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #94A3B8; margin-bottom: 10px;
}
.pd-address { font-size: 13.5px; color: #334155; line-height: 1.5; }
.pd-notes {
  font-size: 13px; color: #334155; line-height: 1.5;
  background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 12px;
}
.pd-modal-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; background: #F8FAFC;
  border-top: 1px solid #E2E8F0; border-radius: 0 0 16px 16px;
}

.pd-login-root {
  min-height: 100vh; background: #F8FAFC;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; font-family: 'Inter', system-ui, sans-serif;
}
.pd-login-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 20px;
  padding: 36px 32px; width: 100%; max-width: 380px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center;
}
.pd-login-brand { display: flex; align-items: center; gap: 10px; }
.pd-login-sub { font-size: 13px; color: #64748B; }
.pd-input-wrap {
  display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 10px;
  overflow: hidden; width: 100%; background: #F8FAFC; transition: border-color 0.15s, box-shadow 0.15s;
}
.pd-input-wrap:focus-within { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); background: #fff; }
.pd-input-prefix {
  padding: 12px; font-size: 13px; font-weight: 600; color: #64748B;
  border-right: 1.5px solid #E2E8F0; background: #F1F5F9; white-space: nowrap;
}
.pd-input {
  flex: 1; border: none; outline: none; background: transparent;
  padding: 12px 14px; font-size: 14px; font-family: inherit; color: #0F172A;
}
.pd-eye { background: none; border: none; padding: 0 12px; cursor: pointer; font-size: 16px; }
.pd-error {
  width: 100%; background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA;
  border-radius: 8px; padding: 10px 14px; font-size: 13px; text-align: left;
}
.pd-login-btn {
  width: 100%; padding: 13px; background: #0F172A; color: #fff;
  border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
  font-family: inherit; cursor: pointer; transition: background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.pd-login-btn:hover:not(:disabled) { background: #1E293B; }
.pd-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.pd-spinner {
  width: 28px; height: 28px; border: 3px solid #E2E8F0;
  border-top-color: #6366F1; border-radius: 50%; animation: spin 0.7s linear infinite;
}
.pd-spinner.sm { width: 18px; height: 18px; border-width: 2.5px; }
@keyframes spin { to { transform: rotate(360deg); } }
.pd-center { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px 20px; color: #64748B; }

@media (max-width: 700px) {
  .pd-stats { grid-template-columns: repeat(4, 1fr); }
  .pd-stat:nth-child(n+5) { border-top: 1px solid #F1F5F9; }
  .pd-grid { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .pd-stats { grid-template-columns: repeat(2, 1fr); }
  .pd-login-card { padding: 28px 20px; }
}
`;