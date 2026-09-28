import React, { useEffect, useState, useCallback } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const TOKEN_KEY = "al_token";

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
const STATUS_LABEL = {
  pending:     "Pending",
  confirmed:   "Confirmed",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
};
const STATUS_COLOR = {
  pending:     { bg: "#FEF9EE", text: "#92610A", dot: "#F59E0B" },
  confirmed:   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  in_progress: { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  completed:   { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
  cancelled:   { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}`,
});

const formatPrice = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

const formatDateTime = (dateStr, timeStr) => {
  const dateObj = new Date(dateStr);
  const formattedDate = isNaN(dateObj)
    ? dateStr
    : dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  let formattedTime = timeStr || "";
  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    formattedTime = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  return formattedDate + (formattedTime ? " · " + formattedTime : "");
};

// ── Toast ──────────────────────────────────────────────────────────────────────
let _toastTimer;
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    clearTimeout(_toastTimer);
    setToast({ msg, type });
    _toastTimer = setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export default function AdminBookings() {
  const [bookings, setBookings]         = useState([]);
  const [stats, setStats]               = useState(null);
  const [partners, setPartners]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filters, setFilters]           = useState({ status: "", from: "", to: "", search: "" });
  const [selected, setSelected]         = useState(null);
  const [actionBusyId, setActionBusyId] = useState(null);
  const { toast, show: showToast }      = useToast();

  useEffect(() => {
    fetch(`${API_BASE}/partners`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (d.success) setPartners(d.data); })
      .catch(() => {});
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.from)   params.set("from",   filters.from);
      if (filters.to)     params.set("to",     filters.to);
      if (filters.search) params.set("search", filters.search);
      const [listRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/bookings?${params.toString()}`, { headers: authHeaders() }).then((r) => r.json()),
        fetch(`${API_BASE}/bookings/stats`,                { headers: authHeaders() }).then((r) => r.json()),
      ]);
      if (listRes.success)  setBookings(listRes.data);
      else setError(listRes.message || "Bookings load nahi ho payi");
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      setError("Server se connect nahi ho paaya");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const updateStatus = async (id, status) => {
    setActionBusyId(id);
    try {
      const res  = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? data.data : b)));
        if (selected?.id === id) setSelected(data.data);
        showToast(`Status updated to ${STATUS_LABEL[status]}`);
      } else showToast(data.message || "Update failed", "error");
    } catch { showToast("Server error", "error"); }
    finally  { setActionBusyId(null); }
  };

  const assignPartner = async (bookingId, partnerId) => {
    setActionBusyId(bookingId);
    try {
      const res  = await fetch(`${API_BASE}/bookings/${bookingId}/assign`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ partnerId: partnerId || null }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.data : b)));
        if (selected?.id === bookingId) setSelected(data.data);
        showToast(partnerId ? "Partner assigned" : "Partner removed");
      } else showToast(data.message || "Assign failed", "error");
    } catch { showToast("Server error", "error"); }
    finally  { setActionBusyId(null); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Is booking ko permanently delete karein?")) return;
    setActionBusyId(id);
    try {
      const res  = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selected?.id === id) setSelected(null);
        showToast("Booking deleted");
      } else showToast(data.message || "Delete failed", "error");
    } catch { showToast("Server error", "error"); }
    finally  { setActionBusyId(null); }
  };

  const statCards = [
    { label: "Total Bookings", value: stats?.total     || 0, icon: "📋", accent: "#6366F1" },
    { label: "Today",          value: stats?.today     || 0, icon: "📅", accent: "#0EA5E9" },
    { label: "Pending",        value: stats?.pending   || 0, icon: "⏳", accent: "#F59E0B" },
    { label: "Confirmed",      value: stats?.confirmed || 0, icon: "✅", accent: "#3B82F6" },
    { label: "Completed",      value: stats?.completed || 0, icon: "🎉", accent: "#22C55E" },
    { label: "Revenue",        value: formatPrice(stats?.revenue), icon: "💰", accent: "#10B981", big: true },
  ];

  return (
    <div className="abk-root">
      <style>{CSS}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className={`abk-toast abk-toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="abk-page-header">
        <div>
          <h1 className="abk-page-title">Bookings</h1>
          <p className="abk-page-sub">Manage all car wash bookings from website</p>
        </div>
        <button className="abk-btn-primary" onClick={loadBookings}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      {stats && (
        <div className="abk-stats-grid">
          {statCards.map((s) => (
            <div className="abk-stat-card" key={s.label}>
              <div className="abk-stat-icon" style={{ background: s.accent + "18", color: s.accent }}>{s.icon}</div>
              <div className="abk-stat-body">
                <div className="abk-stat-value" style={s.big ? { fontSize: 18 } : {}}>{s.value}</div>
                <div className="abk-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="abk-filter-bar">
        <div className="abk-search-wrap">
          <svg className="abk-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="abk-search"
            type="text"
            placeholder="Search name, phone, email…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="abk-filter-select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <div className="abk-date-group">
          <input className="abk-filter-date" type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} />
          <span className="abk-date-sep">→</span>
          <input className="abk-filter-date" type="date" value={filters.to}   onChange={(e) => setFilters((f) => ({ ...f, to:   e.target.value }))} />
        </div>
      </div>

      {error && (
        <div className="abk-error-bar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="abk-card">
        {loading ? (
          <div className="abk-state-box">
            <div className="abk-spinner"/>
            <p>Loading bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="abk-state-box">
            <div className="abk-empty-icon">📭</div>
            <p className="abk-empty-title">No bookings found</p>
            <p className="abk-empty-sub">Try changing your filters or date range.</p>
          </div>
        ) : (
          <div className="abk-table-scroll">
            <table className="abk-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>City</th>
                  
                  <th>Car Type</th>
                  <th>Date &amp; Time</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Partner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const sc = STATUS_COLOR[b.status] || {};
                  const busy = actionBusyId === b.id;
                  return (
                    <tr key={b.id} className="abk-tr">
                      <td>
                        <button className="abk-name-btn" onClick={() => setSelected(b)}>
                          <span className="abk-avatar">{b.customerName?.[0]?.toUpperCase()}</span>
                          <span>{b.customerName}</span>
                        </button>
                      </td>
                      <td className="abk-mono">{b.customerNumber}</td>
                      <td>
                        <span className="abk-city-tag">{b.cityName}</span>
                      </td>
                     
                      <td className="abk-muted-dark">{b.carTypeName}</td>
                      <td className="abk-mono abk-date-cell">{formatDateTime(b.bookingDate, b.bookingTime)}</td>
                      <td className="abk-price">{formatPrice(b.totalPrice)}</td>
                      <td>
                        <div className="abk-status-wrap" style={{ background: sc.bg }}>
                          <span className="abk-status-dot" style={{ background: sc.dot }}/>
                          <select
                            className="abk-status-select"
                            style={{ color: sc.text, background: "transparent" }}
                            value={b.status}
                            disabled={busy}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                          </select>
                        </div>
                      </td>
                      <td>
                        <select
                          className={`abk-partner-dd ${b.partnerId ? "is-assigned" : ""}`}
                          value={b.partnerId || ""}
                          disabled={busy}
                          onChange={(e) => assignPartner(b.id, e.target.value || null)}
                        >
                          <option value="">Unassigned</option>
                          {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="abk-action-row">
                          <button className="abk-icon-btn abk-view-btn" title="View details" onClick={() => setSelected(b)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="abk-icon-btn abk-del-btn" title="Delete" disabled={busy} onClick={() => deleteBooking(b.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="abk-table-footer">
            Showing <strong>{bookings.length}</strong> booking{bookings.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="abk-overlay" onClick={() => setSelected(null)}>
          <div className="abk-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="abk-modal-hd">
              <div className="abk-modal-avatar">{selected.customerName?.[0]?.toUpperCase()}</div>
              <div>
                <h2 className="abk-modal-name">{selected.customerName}</h2>
                <p className="abk-modal-id">Booking #{selected.id}</p>
              </div>
              <button className="abk-modal-close" onClick={() => setSelected(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Status pill */}
            <div className="abk-modal-status-row">
              {(() => { const sc = STATUS_COLOR[selected.status] || {};
                return (
                  <span className="abk-modal-status-pill" style={{ background: sc.bg, color: sc.text }}>
                    <span style={{ background: sc.dot, width: 7, height: 7, borderRadius: "50%", display: "inline-block", marginRight: 6 }}/>
                    {STATUS_LABEL[selected.status]}
                  </span>
                );
              })()}
              <span className="abk-modal-date-pill">
                📅 {formatDateTime(selected.bookingDate, selected.bookingTime)}
              </span>
            </div>

            <div className="abk-modal-body">
              {/* Contact section */}
              <div className="abk-modal-section">
                <div className="abk-modal-section-title">Contact</div>
                <div className="abk-modal-grid2">
                  <div className="abk-modal-field">
                    <span className="abk-mf-label">Phone</span>
                    <span className="abk-mf-val abk-mono">{selected.customerNumber}</span>
                  </div>
                  <div className="abk-modal-field">
                    <span className="abk-mf-label">Email</span>
                    <span className="abk-mf-val">{selected.email || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Service section */}
              <div className="abk-modal-section">
                <div className="abk-modal-section-title">Service</div>
                <div className="abk-modal-grid2">
                  <div className="abk-modal-field">
                    <span className="abk-mf-label">City</span>
                    <span className="abk-mf-val">{selected.cityName}</span>
                  </div>
                  <div className="abk-modal-field">
                    <span className="abk-mf-label">Car Type</span>
                    <span className="abk-mf-val">{selected.carTypeName}</span>
                  </div>
                </div>
                {selected.packageName && (
                  <div className="abk-modal-pkg-row">
                    <span className="abk-pkg-pill">{selected.packageName}</span>
                    <span className="abk-modal-pkg-price">{formatPrice(selected.packagePrice)}</span>
                  </div>
                )}
                {selected.addons?.length > 0 && (
                  <div className="abk-modal-addons">
                    {selected.addons.map((a) => (
                      <div className="abk-addon-row" key={a.id}>
                        <span>+ {a.name}</span>
                        <span className="abk-addon-price">{formatPrice(a.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Address section */}
              <div className="abk-modal-section">
                <div className="abk-modal-section-title">Address</div>
                {selected.addressType === "full_address" ? (
                  <p className="abk-modal-address-text">{selected.fullAddress || "—"}</p>
                ) : (
                  <div className="abk-modal-loc">
                    <span>📍 {selected.latitude && selected.longitude
                      ? `${Number(selected.latitude).toFixed(5)}, ${Number(selected.longitude).toFixed(5)}`
                      : "Not available"}</span>
                    {selected.latitude && selected.longitude && (
                      <a href={`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`}
                         target="_blank" rel="noopener noreferrer" className="abk-maps-link">
                        Open in Maps →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Partner section */}
              <div className="abk-modal-section">
                <div className="abk-modal-section-title">Assigned Partner</div>
                <div className="abk-modal-partner-row">
                  {selected.partnerName
                    ? <span className="abk-modal-partner-chip">👷 {selected.partnerName}</span>
                    : <span className="abk-muted">No partner assigned</span>}
                  <select
                    className="abk-modal-partner-select"
                    defaultValue={selected.partnerId || ""}
                    disabled={actionBusyId === selected.id}
                    onChange={(e) => assignPartner(selected.id, e.target.value || null)}
                  >
                    <option value="">Remove / Unassign</option>
                    {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Status change */}
              <div className="abk-modal-section">
                <div className="abk-modal-section-title">Update Status</div>
                <div className="abk-modal-status-grid">
                  {STATUS_OPTIONS.map((s) => {
                    const sc = STATUS_COLOR[s];
                    const active = selected.status === s;
                    return (
                      <button
                        key={s}
                        className={`abk-status-chip ${active ? "active" : ""}`}
                        style={active ? { background: sc.bg, color: sc.text, borderColor: sc.dot } : {}}
                        disabled={actionBusyId === selected.id}
                        onClick={() => updateStatus(selected.id, s)}
                      >
                        <span className="abk-status-dot" style={{ background: active ? sc.dot : "#CBD5E1" }}/>
                        {STATUS_LABEL[s]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selected.notes && (
                <div className="abk-modal-section">
                  <div className="abk-modal-section-title">Notes</div>
                  <p className="abk-modal-notes">{selected.notes}</p>
                </div>
              )}
            </div>

            {/* Modal footer total */}
            <div className="abk-modal-footer">
              <span className="abk-modal-total-label">Total Amount</span>
              <span className="abk-modal-total-val">{formatPrice(selected.totalPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.abk-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #F8FAFC;
  min-height: 100vh;
  padding: 20px 16px;
  color: #0F172A;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}
*, *::before, *::after { box-sizing: inherit; }

/* ── Toast ── */
.abk-toast {
  position: fixed;
  top: 20px; right: 20px;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 13.5px; font-weight: 500;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  animation: abk-slide-in 0.2s ease;
}
.abk-toast-success { background: #0F172A; color: #fff; }
.abk-toast-error   { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
@keyframes abk-slide-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Page header ── */
.abk-page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 16px;
}
.abk-page-title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.4px; color: #0F172A; }
.abk-page-sub   { margin: 2px 0 0; font-size: 12.5px; color: #64748B; }

.abk-btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px;
  background: #0F172A; color: #fff;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.abk-btn-primary:hover { background: #1E293B; }

/* ── Stat cards ── */
.abk-stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.abk-stat-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 10px;
  display: flex; align-items: center; gap: 9px;
  transition: box-shadow 0.15s;
}
.abk-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
.abk-stat-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.abk-stat-value { font-size: 17px; font-weight: 700; color: #0F172A; line-height: 1.1; }
.abk-stat-label { font-size: 10.5px; color: #64748B; margin-top: 2px; }

/* ── Filter bar ── */
.abk-filter-bar {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 12px; flex-wrap: wrap;
}
.abk-search-wrap {
  position: relative; flex: 1; min-width: 220px;
}
.abk-search-icon {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: #94A3B8; pointer-events: none;
}
.abk-search {
  width: 100%;
  padding: 7px 10px 7px 32px;
  border: 1px solid #E2E8F0; border-radius: 8px;
  font-size: 12.5px; font-family: inherit;
  background: #fff; color: #0F172A;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.abk-search:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.abk-search::placeholder { color: #94A3B8; }

.abk-filter-select, .abk-filter-date {
  padding: 7px 10px;
  border: 1px solid #E2E8F0; border-radius: 8px;
  font-size: 12.5px; font-family: inherit;
  background: #fff; color: #0F172A;
  outline: none; cursor: pointer;
}
.abk-filter-select:focus, .abk-filter-date:focus {
  border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.abk-date-group { display: flex; align-items: center; gap: 6px; }
.abk-date-sep   { color: #94A3B8; font-size: 13px; }

/* ── Error bar ── */
.abk-error-bar {
  display: flex; align-items: center; gap: 8px;
  background: #FEF2F2; color: #991B1B;
  border: 1px solid #FECACA;
  padding: 10px 14px; border-radius: 9px;
  font-size: 13px; margin-bottom: 14px;
}

/* ── Main card ── */
.abk-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  overflow: hidden;
}
.abk-table-scroll { overflow-x: auto; }

/* ── Table ── */
.abk-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
}
.abk-table thead tr {
  border-bottom: 1px solid #E2E8F0;
}
.abk-table th {
  padding: 10px 10px;
  text-align: left;
  font-size: 10.5px; font-weight: 600;
  color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;
  white-space: nowrap; background: #F8FAFC;
}
.abk-table td {
  padding: 10px 10px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
  white-space: nowrap;
  font-size: 12.5px;
}
.abk-tr:last-child td { border-bottom: none; }
.abk-tr:hover td { background: #F8FAFC; }

.abk-name-btn {
  display: flex; align-items: center; gap: 7px;
  background: none; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 600; color: #0F172A;
  padding: 0; font-family: inherit;
}
.abk-name-btn:hover { color: #6366F1; }
.abk-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.abk-mono      { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11.5px; color: #334155; }
.abk-muted     { color: #94A3B8; }
.abk-muted-dark{ color: #475569; }
.abk-date-cell { color: #475569; font-size: 11.5px; }
.abk-price     { font-weight: 700; color: #0F172A; font-size: 12.5px; }

.abk-city-tag {
  display: inline-block;
  background: #F1F5F9; color: #475569;
  font-size: 11px; font-weight: 500;
  padding: 2px 7px; border-radius: 5px;
}
.abk-pkg-pill {
  display: inline-block;
  background: #EEF2FF; color: #4338CA;
  font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 20px;
  border: 1px solid #C7D2FE;
}

/* ── Status cell ── */
.abk-status-wrap {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: 20px;
}
.abk-status-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.abk-status-select {
  border: none; outline: none; cursor: pointer;
  font-size: 11.5px; font-weight: 600;
  font-family: inherit; padding: 0;
  -webkit-appearance: none; appearance: none;
}

/* ── Partner dropdown (table) ── */
.abk-partner-dd {
  padding: 4px 8px;
  border: 1px dashed #CBD5E1; border-radius: 8px;
  font-size: 11.5px; font-family: inherit;
  background: #F8FAFC; color: #64748B;
  cursor: pointer; outline: none;
  transition: border-color 0.15s;
  max-width: 140px;
}
.abk-partner-dd.is-assigned {
  border: 1px solid #A5B4FC;
  background: #EEF2FF; color: #4338CA;
  font-weight: 600;
}
.abk-partner-dd:focus { border-color: #6366F1; }

/* ── Action buttons ── */
.abk-action-row { display: flex; gap: 4px; }
.abk-icon-btn {
  width: 26px; height: 26px;
  border-radius: 6px; border: 1px solid #E2E8F0;
  background: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; color: #64748B;
}
.abk-view-btn:hover { background: #EEF2FF; border-color: #A5B4FC; color: #4338CA; }
.abk-del-btn:hover  { background: #FEF2F2; border-color: #FECACA; color: #EF4444; }
.abk-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Table footer ── */
.abk-table-footer {
  padding: 12px 18px;
  font-size: 12.5px; color: #94A3B8;
  border-top: 1px solid #F1F5F9;
}

/* ── Loading / Empty ── */
.abk-state-box {
  padding: 60px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  color: #64748B;
}
.abk-spinner {
  width: 32px; height: 32px;
  border: 3px solid #E2E8F0;
  border-top-color: #6366F1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.abk-empty-icon  { font-size: 36px; }
.abk-empty-title { margin: 0; font-size: 15px; font-weight: 600; color: #334155; }
.abk-empty-sub   { margin: 2px 0 0; font-size: 13px; color: #94A3B8; }

/* ── Modal overlay ── */
.abk-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
  animation: abk-fade 0.15s ease;
}
@keyframes abk-fade { from { opacity: 0; } to { opacity: 1; } }

.abk-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  animation: abk-pop 0.2s ease;
}
@keyframes abk-pop {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.abk-modal-hd {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 22px 16px;
  border-bottom: 1px solid #F1F5F9;
  position: relative;
}
.abk-modal-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff; font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.abk-modal-name { margin: 0; font-size: 17px; font-weight: 700; color: #0F172A; }
.abk-modal-id   { margin: 2px 0 0; font-size: 12px; color: #94A3B8; }
.abk-modal-close {
  position: absolute; top: 18px; right: 18px;
  background: #F1F5F9; border: none; border-radius: 8px;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748B;
  transition: background 0.15s;
}
.abk-modal-close:hover { background: #E2E8F0; color: #0F172A; }

.abk-modal-status-row {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 12px 22px;
  border-bottom: 1px solid #F1F5F9;
}
.abk-modal-status-pill {
  display: inline-flex; align-items: center;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12.5px; font-weight: 600;
}
.abk-modal-date-pill {
  font-size: 12.5px; color: #475569;
  background: #F8FAFC; padding: 5px 12px; border-radius: 20px;
  border: 1px solid #E2E8F0;
}

.abk-modal-body { padding: 6px 0; }

.abk-modal-section {
  padding: 14px 22px;
  border-bottom: 1px solid #F8FAFC;
}
.abk-modal-section:last-child { border-bottom: none; }
.abk-modal-section-title {
  font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #94A3B8; margin-bottom: 10px;
}
.abk-modal-grid2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px;
}
.abk-modal-field {}
.abk-mf-label { display: block; font-size: 11px; color: #94A3B8; margin-bottom: 2px; }
.abk-mf-val   { font-size: 13.5px; color: #0F172A; font-weight: 500; }

.abk-modal-pkg-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px;
  background: #F8FAFC; border: 1px solid #E2E8F0;
  border-radius: 9px; padding: 10px 14px;
}
.abk-modal-pkg-price { font-weight: 700; color: #4338CA; font-size: 14px; }

.abk-modal-addons { margin-top: 8px; }
.abk-addon-row {
  display: flex; justify-content: space-between;
  padding: 6px 0; border-top: 1px dashed #E2E8F0;
  font-size: 13px; color: #475569;
}
.abk-addon-price { font-weight: 600; color: #334155; }

.abk-modal-address-text {
  font-size: 13.5px; color: #334155; margin: 0;
  line-height: 1.5;
}
.abk-modal-loc {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 13.5px; color: #334155;
}
.abk-maps-link {
  font-size: 12.5px; font-weight: 600; color: #6366F1;
  text-decoration: none;
}
.abk-maps-link:hover { text-decoration: underline; }

.abk-modal-partner-row {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.abk-modal-partner-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: #EEF2FF; color: #4338CA;
  border: 1px solid #C7D2FE;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12.5px; font-weight: 600;
}
.abk-modal-partner-select {
  flex: 1; min-width: 160px;
  padding: 8px 12px;
  border: 1px solid #E2E8F0; border-radius: 9px;
  font-size: 13px; font-family: inherit;
  background: #F8FAFC; color: #0F172A;
  outline: none; cursor: pointer;
}
.abk-modal-partner-select:focus { border-color: #6366F1; }

/* ── Status chips in modal ── */
.abk-modal-status-grid {
  display: flex; flex-wrap: wrap; gap: 7px;
}
.abk-status-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 13px; border-radius: 20px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC; color: #64748B;
  font-size: 12.5px; font-weight: 500;
  cursor: pointer; font-family: inherit;
  transition: all 0.15s;
}
.abk-status-chip:hover:not(.active) { border-color: #CBD5E1; background: #F1F5F9; }
.abk-status-chip.active { font-weight: 700; border-width: 1.5px; }
.abk-status-chip:disabled { opacity: 0.5; cursor: not-allowed; }

.abk-modal-notes {
  margin: 0; font-size: 13.5px; color: #334155;
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 9px; padding: 10px 14px; line-height: 1.5;
}

/* ── Modal footer ── */
.abk-modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
  border-radius: 0 0 16px 16px;
}
.abk-modal-total-label { font-size: 13px; color: #64748B; font-weight: 500; }
.abk-modal-total-val   { font-size: 22px; font-weight: 800; color: #0F172A; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .abk-stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .abk-root { padding: 16px 12px; }
  .abk-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .abk-modal-grid2 { grid-template-columns: 1fr; }
  .abk-page-header { flex-direction: column; gap: 12px; }
}
`;