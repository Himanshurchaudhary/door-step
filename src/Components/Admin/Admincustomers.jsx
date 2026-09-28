import React, { useEffect, useState, useCallback } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const TOKEN_KEY = "al_token";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}`,
});

const fmt = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const fmtDateTime = (dateStr, timeStr) => {
  const d = new Date(dateStr);
  const date = isNaN(d) ? dateStr : d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  let time = timeStr || "";
  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    time = `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }
  return date + (time ? " · " + time : "");
};

const STATUS_COLOR = {
  pending:     { bg: "#FEF9EE", text: "#92610A", dot: "#F59E0B" },
  confirmed:   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  in_progress: { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  completed:   { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
  cancelled:   { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
};
const STATUS_LABEL = {
  pending: "Pending", confirmed: "Confirmed",
  in_progress: "In Progress", completed: "Completed", cancelled: "Cancelled",
};

// ── Avatar initials ────────────────────────────────────────────────────────────
const initials = (name) =>
  (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Avatar color from name ────────────────────────────────────────────────────
const COLORS = [
  ["#6366F1","#8B5CF6"], ["#0EA5E9","#38BDF8"], ["#10B981","#34D399"],
  ["#F59E0B","#FCD34D"], ["#EF4444","#F87171"], ["#EC4899","#F472B6"],
];
const avatarColor = (name) => COLORS[(name || "").charCodeAt(0) % COLORS.length];

export default function AdminCustomers() {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);  // phone string
  const [profile, setProfile]       = useState(null);
  const [profLoading, setProfLoad]  = useState(false);
  const [activeTab, setActiveTab]   = useState("overview");

  // ── Load customer list ─────────────────────────────────────────────────────
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res  = await fetch(`${API_BASE}/customers${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  // ── Load single customer profile ───────────────────────────────────────────
  const loadProfile = async (phone) => {
    setSelected(phone);
    setProfile(null);
    setActiveTab("overview");
    setProfLoad(true);
    try {
      const res  = await fetch(`${API_BASE}/customers/${encodeURIComponent(phone)}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setProfile(data.data);
    } catch (e) { console.error(e); }
    finally { setProfLoad(false); }
  };

  // ── Derived totals for header ─────────────────────────────────────────────
  const totalCustomers  = customers.length;
  const totalRevenue    = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalBookings   = customers.reduce((s, c) => s + c.totalBookings, 0);
  const repeatCustomers = customers.filter((c) => c.totalBookings > 1).length;

  return (
    <div className="ac-root">
      <style>{CSS}</style>

      {/* ── Page header ── */}
      <div className="ac-page-hd">
        <div>
          <h1 className="ac-page-title">Customers</h1>
          <p className="ac-page-sub">All registered customers from booking history</p>
        </div>
        <button className="ac-refresh-btn" onClick={loadCustomers}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary strip ── */}
      <div className="ac-summary-strip">
        {[
          { label: "Total Customers",   value: totalCustomers,              icon: "👥", accent: "#6366F1" },
          { label: "Total Bookings",    value: totalBookings,               icon: "📋", accent: "#0EA5E9" },
          { label: "Repeat Customers",  value: repeatCustomers,             icon: "🔁", accent: "#10B981" },
          { label: "Total Revenue",     value: fmt(totalRevenue), big: true, icon: "💰", accent: "#F59E0B" },
        ].map((s) => (
          <div className="ac-sum-card" key={s.label}>
            <div className="ac-sum-icon" style={{ background: s.accent + "18", color: s.accent }}>{s.icon}</div>
            <div>
              <div className="ac-sum-val" style={s.big ? { fontSize: 16 } : {}}>{s.value}</div>
              <div className="ac-sum-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout: list + detail ── */}
      <div className="ac-layout">

        {/* ── LEFT: Customer list ── */}
        <div className="ac-list-col">
          <div className="ac-list-search-wrap">
            <svg className="ac-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="ac-list-search"
              type="text"
              placeholder="Search name, phone, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ac-list-count">{customers.length} customer{customers.length !== 1 ? "s" : ""}</div>

          {loading ? (
            <div className="ac-list-state">
              <div className="ac-spinner" />
              <span>Loading customers…</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="ac-list-state">
              <span style={{ fontSize: 30 }}>👤</span>
              <span>No customers found</span>
            </div>
          ) : (
            <div className="ac-list">
              {customers.map((c) => {
                const [c1, c2] = avatarColor(c.name);
                const isActive = selected === c.phone;
                return (
                  <div
                    key={c.phone}
                    className={`ac-list-item ${isActive ? "ac-list-item--active" : ""}`}
                    onClick={() => loadProfile(c.phone)}
                  >
                    <div className="ac-list-avatar" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
                      {initials(c.name)}
                    </div>
                    <div className="ac-list-info">
                      <div className="ac-list-name">{c.name}</div>
                      <div className="ac-list-phone">{c.phone}</div>
                    </div>
                    <div className="ac-list-meta">
                      <div className="ac-list-bookings">{c.totalBookings} booking{c.totalBookings !== 1 ? "s" : ""}</div>
                      <div className="ac-list-spent">{fmt(c.totalSpent)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: Customer detail ── */}
        <div className="ac-detail-col">
          {!selected ? (
            <div className="ac-detail-empty">
              <div className="ac-detail-empty-icon">👈</div>
              <p className="ac-detail-empty-title">Select a customer</p>
              <p className="ac-detail-empty-sub">Click any customer on the left to view their full profile and booking history.</p>
            </div>
          ) : profLoading ? (
            <div className="ac-detail-empty">
              <div className="ac-spinner" />
              <p>Loading profile…</p>
            </div>
          ) : profile ? (
            <CustomerDetail profile={profile} />
          ) : (
            <div className="ac-detail-empty">
              <p style={{ color: "#EF4444" }}>Failed to load customer profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Customer Detail Panel ──────────────────────────────────────────────────────
function CustomerDetail({ profile }) {
  const [tab, setTab] = useState("overview");
  const { stats } = profile;
  const [c1, c2]  = avatarColor(profile.name);

  const completionRate = stats.totalBookings > 0
    ? Math.round((stats.completed / stats.totalBookings) * 100)
    : 0;

  return (
    <div className="ac-detail">

      {/* Profile header */}
      <div className="ac-detail-hd">
        <div className="ac-detail-avatar" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
          {initials(profile.name)}
        </div>
        <div className="ac-detail-hd-info">
          <h2 className="ac-detail-name">{profile.name}</h2>
          <div className="ac-detail-meta-row">
            <span className="ac-detail-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.79h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.75-.75a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>
              {profile.phone}
            </span>
            {profile.email && (
              <span className="ac-detail-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {profile.email}
              </span>
            )}
            <span className="ac-detail-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Customer since {fmtDate(profile.firstBookingAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="ac-qs-row">
        {[
          { label: "Total Bookings",  value: stats.totalBookings,              color: "#6366F1" },
          { label: "Completed",       value: stats.completed,                  color: "#22C55E" },
          { label: "Pending",         value: stats.pending,                    color: "#F59E0B" },
          { label: "Cancelled",       value: stats.cancelled,                  color: "#EF4444" },
          { label: "Total Spent",     value: fmt(stats.totalSpent), big: true,  color: "#0F172A" },
          { label: "Completion Rate", value: `${completionRate}%`,             color: completionRate >= 70 ? "#22C55E" : completionRate >= 40 ? "#F59E0B" : "#EF4444" },
        ].map((q) => (
          <div className="ac-qs-card" key={q.label}>
            <div className="ac-qs-val" style={{ color: q.color, fontSize: q.big ? 16 : 22 }}>{q.value}</div>
            <div className="ac-qs-label">{q.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="ac-tabs">
        {["overview", "bookings", "packages", "addons"].map((t) => (
          <button
            key={t}
            className={`ac-tab ${tab === t ? "ac-tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {{ overview: "Overview", bookings: "All Bookings", packages: "Packages", addons: "Add-ons" }[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="ac-tab-body">
        {tab === "overview"  && <OverviewTab  profile={profile} completionRate={completionRate} />}
        {tab === "bookings"  && <BookingsTab  bookings={profile.bookings} />}
        {tab === "packages"  && <PackagesTab  breakdown={profile.packageBreakdown} bookings={profile.bookings} />}
        {tab === "addons"    && <AddonsTab    breakdown={profile.addonBreakdown} />}
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ profile, completionRate }) {
  const { stats } = profile;
  const lastBooking = profile.bookings[0];

  return (
    <div className="ac-overview">

      {/* Info grid */}
      <Section title="Customer Information">
        <div className="ac-info-grid">
          <InfoRow label="Full Name"        value={profile.name} />
          <InfoRow label="Phone Number"     value={profile.phone} mono />
          <InfoRow label="Email Address"    value={profile.email || "—"} />
          <InfoRow label="First Booking"    value={fmtDate(profile.firstBookingAt)} />
          <InfoRow label="Last Booking"     value={fmtDate(profile.lastBookingAt)} />
          <InfoRow label="Cities Serviced"  value={profile.cities.join(", ") || "—"} />
          <InfoRow label="Car Types Used"   value={profile.carTypes.join(", ") || "—"} />
          <InfoRow label="Total Spent"      value={fmt(stats.totalSpent)} highlight />
        </div>
      </Section>

      {/* Activity breakdown */}
      <Section title="Booking Activity">
        <div className="ac-activity-bars">
          {[
            { label: "Completed",   count: stats.completed,   color: "#22C55E", total: stats.totalBookings },
            { label: "Confirmed",   count: stats.confirmed,   color: "#3B82F6", total: stats.totalBookings },
            { label: "In Progress", count: stats.inProgress,  color: "#8B5CF6", total: stats.totalBookings },
            { label: "Pending",     count: stats.pending,     color: "#F59E0B", total: stats.totalBookings },
            { label: "Cancelled",   count: stats.cancelled,   color: "#EF4444", total: stats.totalBookings },
          ].filter(b => b.count > 0).map((b) => (
            <div className="ac-bar-row" key={b.label}>
              <div className="ac-bar-label">{b.label}</div>
              <div className="ac-bar-track">
                <div
                  className="ac-bar-fill"
                  style={{ width: `${Math.round((b.count / b.total) * 100)}%`, background: b.color }}
                />
              </div>
              <div className="ac-bar-count">{b.count}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Last booking */}
      {lastBooking && (
        <Section title="Most Recent Booking">
          <BookingCard b={lastBooking} />
        </Section>
      )}

      {/* Favourite packages */}
      {profile.packageBreakdown.length > 0 && (
        <Section title="Favourite Packages">
          <div className="ac-fav-list">
            {profile.packageBreakdown.slice(0, 3).map((p, i) => (
              <div className="ac-fav-item" key={p.name}>
                <span className="ac-fav-rank">#{i + 1}</span>
                <span className="ac-fav-name">{p.name}</span>
                <span className="ac-fav-count">{p.count}×</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab({ bookings }) {
  return (
    <div className="ac-bookings-list">
      {bookings.length === 0 ? (
        <div className="ac-empty-tab">No bookings found.</div>
      ) : bookings.map((b) => (
        <BookingCard key={b.id} b={b} expanded />
      ))}
    </div>
  );
}

// ── Packages Tab ──────────────────────────────────────────────────────────────
function PackagesTab({ breakdown, bookings }) {
  const pkgBookings = {};
  bookings.forEach((b) => {
    if (b.packageName) {
      if (!pkgBookings[b.packageName]) pkgBookings[b.packageName] = [];
      pkgBookings[b.packageName].push(b);
    }
  });

  return (
    <div className="ac-pkg-tab">
      {breakdown.length === 0 ? (
        <div className="ac-empty-tab">No packages booked yet.</div>
      ) : breakdown.map((p) => {
        const bks = pkgBookings[p.name] || [];
        const totalSpent = bks.filter(b => b.status === "completed").reduce((s, b) => s + b.packagePrice, 0);
        const completed  = bks.filter(b => b.status === "completed").length;
        return (
          <div className="ac-pkg-card" key={p.name}>
            <div className="ac-pkg-card-hd">
              <div>
                <div className="ac-pkg-card-name">{p.name}</div>
                <div className="ac-pkg-card-sub">Booked {p.count} time{p.count !== 1 ? "s" : ""}</div>
              </div>
              <div className="ac-pkg-card-badge">{p.count}×</div>
            </div>
            <div className="ac-pkg-card-stats">
              <div className="ac-pkg-stat">
                <span className="ac-pkg-stat-val" style={{ color: "#22C55E" }}>{completed}</span>
                <span className="ac-pkg-stat-label">Completed</span>
              </div>
              <div className="ac-pkg-stat">
                <span className="ac-pkg-stat-val" style={{ color: "#EF4444" }}>{bks.filter(b => b.status === "cancelled").length}</span>
                <span className="ac-pkg-stat-label">Cancelled</span>
              </div>
              <div className="ac-pkg-stat">
                <span className="ac-pkg-stat-val" style={{ color: "#0F172A", fontSize: 14 }}>{fmt(totalSpent)}</span>
                <span className="ac-pkg-stat-label">Total Spent</span>
              </div>
            </div>
            {/* Booking dates for this package */}
            <div className="ac-pkg-dates">
              {bks.slice(0, 5).map((b) => {
                const sc = STATUS_COLOR[b.status] || {};
                return (
                  <div className="ac-pkg-date-row" key={b.id}>
                    <span className="ac-pkg-date-txt">{fmtDate(b.bookingDate)}</span>
                    <span className="ac-pkg-status-pill" style={{ background: sc.bg, color: sc.text }}>
                      <span style={{ background: sc.dot, width: 5, height: 5, borderRadius: "50%", display: "inline-block", marginRight: 4 }}/>
                      {STATUS_LABEL[b.status]}
                    </span>
                    <span className="ac-pkg-date-price">{fmt(b.packagePrice)}</span>
                  </div>
                );
              })}
              {bks.length > 5 && <p className="ac-pkg-more">+{bks.length - 5} more bookings</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Add-ons Tab ───────────────────────────────────────────────────────────────
function AddonsTab({ breakdown }) {
  return (
    <div className="ac-addon-tab">
      {breakdown.length === 0 ? (
        <div className="ac-empty-tab">No add-ons booked yet.</div>
      ) : (
        <>
          <p className="ac-addon-intro">Add-ons this customer has ever selected across all bookings:</p>
          <div className="ac-addon-grid">
            {breakdown.map((a, i) => (
              <div className="ac-addon-card" key={a.name}>
                <div className="ac-addon-rank">#{i + 1}</div>
                <div className="ac-addon-name">{a.name}</div>
                <div className="ac-addon-count-wrap">
                  <span className="ac-addon-count">{a.count}</span>
                  <span className="ac-addon-count-label">times</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ b, expanded = false }) {
  const sc = STATUS_COLOR[b.status] || {};
  return (
    <div className="ac-bk-card">
      <div className="ac-bk-card-hd">
        <div className="ac-bk-card-hd-left">
          <span className="ac-bk-id">#{b.id}</span>
          <span className="ac-bk-date">{fmtDateTime(b.bookingDate, b.bookingTime)}</span>
        </div>
        <span className="ac-bk-status-pill" style={{ background: sc.bg, color: sc.text }}>
          <span style={{ background: sc.dot, width: 5, height: 5, borderRadius: "50%", display: "inline-block", marginRight: 5 }}/>
          {STATUS_LABEL[b.status]}
        </span>
      </div>

      <div className="ac-bk-card-grid">
        <BkRow label="Package"  value={b.packageName  ? <span className="ac-bk-pkg-pill">{b.packageName}</span> : "—"} />
        <BkRow label="Car Type" value={b.carTypeName  || "—"} />
        <BkRow label="City"     value={b.cityName     || "—"} />
        {b.partnerName && <BkRow label="Partner" value={b.partnerName} />}
      </div>

      {expanded && b.addons?.length > 0 && (
        <div className="ac-bk-addons">
          <span className="ac-bk-addons-label">Add-ons:</span>
          {b.addons.map((a) => (
            <span className="ac-bk-addon-tag" key={a.id}>{a.name}</span>
          ))}
        </div>
      )}

      {expanded && b.fullAddress && (
        <div className="ac-bk-addr">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {b.fullAddress}
        </div>
      )}

      {expanded && b.latitude && b.longitude && (
        <a className="ac-bk-maps" href={`https://maps.google.com/?q=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer">
          📍 Open location in Google Maps →
        </a>
      )}

      {expanded && b.notes && (
        <div className="ac-bk-notes">📝 {b.notes}</div>
      )}

      <div className="ac-bk-total">
        <span>Total</span>
        <strong>{fmt(b.totalPrice)}</strong>
      </div>
    </div>
  );
}

// ── Small reusable components ─────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="ac-section">
    <div className="ac-section-title">{title}</div>
    {children}
  </div>
);

const InfoRow = ({ label, value, mono, highlight }) => (
  <div className="ac-info-row">
    <span className="ac-info-label">{label}</span>
    <span className={`ac-info-val ${mono ? "ac-mono" : ""} ${highlight ? "ac-highlight" : ""}`}>{value}</span>
  </div>
);

const BkRow = ({ label, value }) => (
  <div className="ac-bk-row">
    <span className="ac-bk-row-label">{label}</span>
    <span className="ac-bk-row-val">{value}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.ac-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #F8FAFC;
  min-height: 100vh;
  padding: 20px 16px;
  color: #0F172A;
  box-sizing: border-box;
  width: 100%;
}
*, *::before, *::after { box-sizing: inherit; }

/* ── Page header ── */
.ac-page-hd {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 16px;
}
.ac-page-title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.4px; }
.ac-page-sub   { margin: 3px 0 0; font-size: 12.5px; color: #64748B; }

.ac-refresh-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: #0F172A; color: #fff;
  border: none; border-radius: 8px;
  font-size: 12.5px; font-weight: 500; font-family: inherit;
  cursor: pointer;
}
.ac-refresh-btn:hover { background: #1E293B; }

/* ── Summary strip ── */
.ac-summary-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 10px; margin-bottom: 16px;
}
.ac-sum-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 10px;
  padding: 12px 14px; display: flex; align-items: center; gap: 10px;
}
.ac-sum-icon {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.ac-sum-val   { font-size: 18px; font-weight: 700; color: #0F172A; line-height: 1; }
.ac-sum-label { font-size: 11px; color: #64748B; margin-top: 2px; }

/* ── Layout ── */
.ac-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 14px;
  align-items: start;
}

/* ── Left list column ── */
.ac-list-col {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden; display: flex; flex-direction: column;
}
.ac-list-search-wrap {
  position: relative; padding: 12px 12px 8px;
}
.ac-search-icon {
  position: absolute; left: 23px; top: 50%; transform: translateY(-40%);
  color: #94A3B8; pointer-events: none;
}
.ac-list-search {
  width: 100%; padding: 8px 10px 8px 32px;
  border: 1px solid #E2E8F0; border-radius: 8px;
  font-size: 12.5px; font-family: inherit; color: #0F172A;
  outline: none; background: #F8FAFC;
}
.ac-list-search:focus { border-color: #6366F1; background: #fff; }

.ac-list-count {
  font-size: 11px; color: #94A3B8; font-weight: 500;
  padding: 0 14px 8px; text-transform: uppercase; letter-spacing: 0.05em;
}
.ac-list { overflow-y: auto; max-height: calc(100vh - 280px); }
.ac-list-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; cursor: pointer;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.1s;
}
.ac-list-item:last-child { border-bottom: none; }
.ac-list-item:hover { background: #F8FAFC; }
.ac-list-item--active { background: #EEF2FF !important; border-left: 3px solid #6366F1; }

.ac-list-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ac-list-info { flex: 1; min-width: 0; }
.ac-list-name  { font-size: 13px; font-weight: 600; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ac-list-phone { font-size: 11px; color: #64748B; font-family: monospace; margin-top: 1px; }
.ac-list-meta  { text-align: right; flex-shrink: 0; }
.ac-list-bookings { font-size: 11px; color: #64748B; }
.ac-list-spent    { font-size: 12px; font-weight: 700; color: #0F172A; }

.ac-list-state {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 40px 20px; color: #94A3B8; font-size: 13px;
}

/* ── Right detail column ── */
.ac-detail-col {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden; min-height: 500px;
}
.ac-detail-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; text-align: center; min-height: 400px;
  color: #94A3B8;
}
.ac-detail-empty-icon  { font-size: 36px; margin-bottom: 10px; }
.ac-detail-empty-title { font-size: 15px; font-weight: 600; color: #334155; margin: 0; }
.ac-detail-empty-sub   { font-size: 13px; color: #94A3B8; margin: 6px 0 0; max-width: 280px; }

/* ── Detail panel ── */
.ac-detail { display: flex; flex-direction: column; }

.ac-detail-hd {
  display: flex; align-items: center; gap: 14px;
  padding: 20px; border-bottom: 1px solid #F1F5F9;
}
.ac-detail-avatar {
  width: 52px; height: 52px; border-radius: 14px;
  color: #fff; font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ac-detail-name     { margin: 0; font-size: 18px; font-weight: 700; color: #0F172A; }
.ac-detail-meta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 5px; }
.ac-detail-meta-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #64748B;
}

/* ── Quick stats row ── */
.ac-qs-row {
  display: grid; grid-template-columns: repeat(6, 1fr);
  border-bottom: 1px solid #F1F5F9;
}
.ac-qs-card {
  padding: 14px 10px; text-align: center;
  border-right: 1px solid #F1F5F9;
}
.ac-qs-card:last-child { border-right: none; }
.ac-qs-val   { font-size: 22px; font-weight: 800; line-height: 1; }
.ac-qs-label { font-size: 10.5px; color: #64748B; margin-top: 4px; }

/* ── Tabs ── */
.ac-tabs {
  display: flex; gap: 0;
  border-bottom: 1px solid #E2E8F0;
  padding: 0 16px;
}
.ac-tab {
  padding: 12px 14px;
  border: none; background: none; cursor: pointer;
  font-size: 13px; font-weight: 500; color: #64748B;
  font-family: inherit;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}
.ac-tab:hover { color: #0F172A; }
.ac-tab--active { color: #6366F1; border-bottom-color: #6366F1; font-weight: 600; }

.ac-tab-body { padding: 0; overflow-y: auto; max-height: calc(100vh - 400px); }

/* ── Overview tab ── */
.ac-overview { padding: 4px 0; }
.ac-section { padding: 16px 20px; border-bottom: 1px solid #F8FAFC; }
.ac-section:last-child { border-bottom: none; }
.ac-section-title {
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #94A3B8; margin-bottom: 12px;
}

/* Info grid */
.ac-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.ac-info-row {
  display: flex; flex-direction: column; gap: 2px;
  padding: 8px 0; border-bottom: 1px solid #F8FAFC;
}
.ac-info-label    { font-size: 10.5px; color: #94A3B8; }
.ac-info-val      { font-size: 13px; color: #0F172A; font-weight: 500; }
.ac-mono          { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }
.ac-highlight     { font-size: 15px; font-weight: 800; color: #6366F1; }

/* Activity bars */
.ac-activity-bars { display: flex; flex-direction: column; gap: 8px; }
.ac-bar-row   { display: flex; align-items: center; gap: 10px; }
.ac-bar-label { font-size: 12px; color: #475569; width: 90px; flex-shrink: 0; }
.ac-bar-track { flex: 1; height: 7px; background: #F1F5F9; border-radius: 99px; overflow: hidden; }
.ac-bar-fill  { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
.ac-bar-count { font-size: 12px; font-weight: 700; color: #334155; width: 24px; text-align: right; }

/* Favourite list */
.ac-fav-list { display: flex; flex-direction: column; gap: 6px; }
.ac-fav-item {
  display: flex; align-items: center; gap: 10px;
  background: #F8FAFC; padding: 8px 12px; border-radius: 8px;
  border: 1px solid #E2E8F0;
}
.ac-fav-rank  { font-size: 11px; font-weight: 700; color: #94A3B8; width: 22px; }
.ac-fav-name  { flex: 1; font-size: 13px; font-weight: 600; color: #0F172A; }
.ac-fav-count { font-size: 12px; font-weight: 700; color: #6366F1; }

/* ── Bookings tab ── */
.ac-bookings-list { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; }

/* ── Booking card ── */
.ac-bk-card {
  border: 1px solid #E2E8F0; border-radius: 10px;
  overflow: hidden;
}
.ac-bk-card-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;
}
.ac-bk-card-hd-left { display: flex; align-items: center; gap: 10px; }
.ac-bk-id   { font-size: 11px; font-weight: 700; color: #94A3B8; font-family: monospace; }
.ac-bk-date { font-size: 12px; color: #475569; }
.ac-bk-status-pill {
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: 20px;
  font-size: 11.5px; font-weight: 600;
}
.ac-bk-card-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; padding: 2px 0;
}
.ac-bk-row {
  display: flex; flex-direction: column; gap: 2px;
  padding: 8px 14px; border-bottom: 1px solid #F8FAFC;
}
.ac-bk-row:nth-child(odd)  { border-right: 1px solid #F8FAFC; }
.ac-bk-row-label { font-size: 10.5px; color: #94A3B8; }
.ac-bk-row-val   { font-size: 12.5px; font-weight: 500; color: #0F172A; }
.ac-bk-pkg-pill {
  display: inline-block;
  background: #EEF2FF; color: #4338CA;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
  border: 1px solid #C7D2FE;
}
.ac-bk-addons {
  display: flex; flex-wrap: wrap; align-items: center; gap: 5px;
  padding: 8px 14px; border-top: 1px solid #F1F5F9;
}
.ac-bk-addons-label { font-size: 11px; color: #94A3B8; }
.ac-bk-addon-tag {
  background: #F1F5F9; color: #475569;
  font-size: 11px; padding: 2px 8px; border-radius: 20px;
}
.ac-bk-addr {
  display: flex; align-items: flex-start; gap: 5px;
  padding: 6px 14px; font-size: 12px; color: #475569;
  border-top: 1px solid #F1F5F9;
}
.ac-bk-maps {
  display: block; padding: 4px 14px 8px;
  font-size: 12px; font-weight: 600; color: #6366F1;
  text-decoration: none;
}
.ac-bk-maps:hover { text-decoration: underline; }
.ac-bk-notes {
  padding: 6px 14px; font-size: 12px; color: #92610A;
  background: #FFFBEB; border-top: 1px solid #FDE68A;
}
.ac-bk-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  font-size: 13px; color: #64748B;
}
.ac-bk-total strong { font-size: 16px; font-weight: 800; color: #0F172A; }

/* ── Packages tab ── */
.ac-pkg-tab { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; }
.ac-pkg-card {
  border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;
}
.ac-pkg-card-hd {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;
}
.ac-pkg-card-name  { font-size: 14px; font-weight: 700; color: #0F172A; }
.ac-pkg-card-sub   { font-size: 11.5px; color: #64748B; margin-top: 2px; }
.ac-pkg-card-badge {
  background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE;
  font-size: 13px; font-weight: 800;
  padding: 4px 12px; border-radius: 20px;
}
.ac-pkg-card-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  padding: 12px 14px; gap: 8px; border-bottom: 1px solid #F1F5F9;
}
.ac-pkg-stat       { text-align: center; }
.ac-pkg-stat-val   { display: block; font-size: 18px; font-weight: 800; }
.ac-pkg-stat-label { font-size: 10.5px; color: #64748B; }
.ac-pkg-dates      { padding: 8px 14px 12px; display: flex; flex-direction: column; gap: 6px; }
.ac-pkg-date-row   { display: flex; align-items: center; gap: 8px; }
.ac-pkg-date-txt   { font-size: 12px; color: #475569; min-width: 100px; }
.ac-pkg-status-pill {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
}
.ac-pkg-date-price { font-size: 12px; font-weight: 700; color: #0F172A; margin-left: auto; }
.ac-pkg-more       { font-size: 11.5px; color: #94A3B8; margin: 4px 0 0; }

/* ── Add-ons tab ── */
.ac-addon-tab { padding: 14px 16px; }
.ac-addon-intro { font-size: 12.5px; color: #64748B; margin: 0 0 12px; }
.ac-addon-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.ac-addon-card  {
  border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;
  display: flex; flex-direction: column; gap: 6px;
  background: #fff; position: relative;
}
.ac-addon-rank  {
  position: absolute; top: 10px; right: 10px;
  font-size: 10.5px; font-weight: 700; color: #94A3B8;
}
.ac-addon-name  { font-size: 13.5px; font-weight: 600; color: #0F172A; padding-right: 24px; }
.ac-addon-count-wrap { display: flex; align-items: baseline; gap: 4px; margin-top: 4px; }
.ac-addon-count { font-size: 26px; font-weight: 800; color: #6366F1; line-height: 1; }
.ac-addon-count-label { font-size: 11px; color: #94A3B8; }

/* ── Shared ── */
.ac-empty-tab { padding: 30px; text-align: center; color: #94A3B8; font-size: 13px; }
.ac-spinner   {
  width: 28px; height: 28px; border: 3px solid #E2E8F0;
  border-top-color: #6366F1; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 900px) {
  .ac-layout { grid-template-columns: 1fr; }
  .ac-list   { max-height: 300px; }
  .ac-summary-strip { grid-template-columns: repeat(2, 1fr); }
  .ac-qs-row { grid-template-columns: repeat(3, 1fr); }
  .ac-info-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .ac-summary-strip { grid-template-columns: 1fr 1fr; }
  .ac-qs-row { grid-template-columns: repeat(2, 1fr); }
  .ac-bk-card-grid { grid-template-columns: 1fr; }
}
`;