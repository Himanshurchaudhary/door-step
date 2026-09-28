import { useState, useEffect } from "react";

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sc-root {
    font-family: 'Inter', sans-serif;
    background: #F7F8FA;
    min-height: 100vh;
    color: #1A1D23;
  }

  /* ── Header ── */
  .sc-header {
    background: #fff;
    border-bottom: 1px solid #E8EAED;
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .sc-header-left h1 {
    font-size: 20px;
    font-weight: 700;
    color: #1A1D23;
    letter-spacing: -0.3px;
  }
  .sc-header-left p {
    font-size: 13px;
    color: #6B7280;
    margin-top: 2px;
  }
  .sc-badge {
    background: #EEF2FF;
    color: #4F46E5;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* ── Body ── */
  .sc-body {
    padding: 28px 32px;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Toolbar ── */
  .sc-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .sc-search-wrap {
    position: relative;
    flex: 1;
    min-width: 220px;
    max-width: 360px;
  }
  .sc-search-wrap svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF;
    pointer-events: none;
  }
  .sc-search {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border: 1px solid #E0E3E8;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
    font-family: inherit;
    color: #1A1D23;
  }
  .sc-search:focus { border-color: #4F46E5; box-shadow: 0 0 0 3px #EEF2FF; }

  .sc-filter-btn {
    padding: 9px 14px;
    border: 1px solid #E0E3E8;
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .sc-filter-btn:hover { border-color: #4F46E5; color: #4F46E5; }
  .sc-filter-btn.active { background: #4F46E5; color: #fff; border-color: #4F46E5; }

  .sc-add-btn {
    margin-left: auto;
    padding: 9px 18px;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: background 0.15s;
    font-family: inherit;
  }
  .sc-add-btn:hover { background: #4338CA; }

  /* ── Stats row ── */
  .sc-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }
  .sc-stat-card {
    background: #fff;
    border: 1px solid #E8EAED;
    border-radius: 12px;
    padding: 18px 22px;
  }
  .sc-stat-card .label {
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .sc-stat-card .value {
    font-size: 28px;
    font-weight: 700;
    color: #1A1D23;
    margin-top: 4px;
    letter-spacing: -0.5px;
  }
  .sc-stat-card.active-stat .value { color: #059669; }
  .sc-stat-card.inactive-stat .value { color: #DC2626; }

  /* ── Table ── */
  .sc-table-wrap {
    background: #fff;
    border: 1px solid #E8EAED;
    border-radius: 12px;
    overflow: hidden;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead {
    background: #F9FAFB;
    border-bottom: 1px solid #E8EAED;
  }
  thead th {
    text-align: left;
    padding: 12px 18px;
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  tbody tr {
    border-bottom: 1px solid #F3F4F6;
    transition: background 0.1s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #FAFAFA; }
  tbody td {
    padding: 14px 18px;
    font-size: 14px;
    color: #374151;
    vertical-align: middle;
  }
  .sc-city-name {
    font-weight: 600;
    color: #1A1D23;
  }
  .sc-state-tag {
    display: inline-block;
    background: #F3F4F6;
    color: #4B5563;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 6px;
  }
  .sc-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .sc-status.active { background: #ECFDF5; color: #059669; }
  .sc-status.inactive { background: #FEF2F2; color: #DC2626; }
  .sc-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .active .sc-status-dot { background: #059669; }
  .inactive .sc-status-dot { background: #DC2626; }

  /* ── Action buttons ── */
  .sc-actions { display: flex; align-items: center; gap: 6px; }
  .sc-icon-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #E0E3E8;
    border-radius: 7px;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6B7280;
    transition: all 0.15s;
  }
  .sc-icon-btn:hover { border-color: #4F46E5; color: #4F46E5; background: #EEF2FF; }
  .sc-icon-btn.toggle-btn:hover { border-color: #059669; color: #059669; background: #ECFDF5; }
  .sc-icon-btn.delete-btn:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }

  /* ── Empty state ── */
  .sc-empty {
    text-align: center;
    padding: 64px 20px;
    color: #9CA3AF;
  }
  .sc-empty svg { margin-bottom: 16px; opacity: 0.4; }
  .sc-empty p { font-size: 15px; font-weight: 500; color: #6B7280; }
  .sc-empty span { font-size: 13px; }

  /* ── Modal overlay ── */
  .sc-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 18, 26, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
    backdrop-filter: blur(2px);
  }
  .sc-modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    overflow: hidden;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sc-modal-header {
    padding: 22px 24px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .sc-modal-header h2 { font-size: 17px; font-weight: 700; color: #1A1D23; }
  .sc-modal-header p { font-size: 13px; color: #6B7280; margin-top: 3px; }
  .sc-close-btn {
    width: 30px; height: 30px;
    border: none; background: #F3F4F6;
    border-radius: 7px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #6B7280; font-size: 16px; flex-shrink: 0;
    transition: background 0.15s;
  }
  .sc-close-btn:hover { background: #E5E7EB; }

  .sc-modal-body { padding: 20px 24px 24px; }
  .sc-field { margin-bottom: 16px; }
  .sc-field label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }
  .sc-field input, .sc-field select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #E0E3E8;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    color: #1A1D23;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
  }
  .sc-field input:focus, .sc-field select:focus {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px #EEF2FF;
  }
  .sc-field input.error { border-color: #DC2626; }
  .sc-field .err-msg { font-size: 12px; color: #DC2626; margin-top: 4px; }

  .sc-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: #F9FAFB;
    border: 1px solid #E8EAED;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .sc-toggle-row span { font-size: 14px; font-weight: 500; color: #374151; }
  .sc-toggle {
    width: 40px; height: 22px;
    background: #E0E3E8;
    border-radius: 11px;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
    border: none;
    flex-shrink: 0;
  }
  .sc-toggle.on { background: #4F46E5; }
  .sc-toggle::after {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    background: #fff;
    border-radius: 50%;
    top: 3px; left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .sc-toggle.on::after { transform: translateX(18px); }

  .sc-modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .sc-btn-cancel {
    padding: 10px 18px;
    border: 1px solid #E0E3E8;
    border-radius: 8px;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .sc-btn-cancel:hover { background: #F9FAFB; }
  .sc-btn-save {
    padding: 10px 22px;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .sc-btn-save:hover:not(:disabled) { background: #4338CA; }
  .sc-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Delete confirm modal ── */
  .sc-delete-modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 380px;
    padding: 28px 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    text-align: center;
    animation: slideUp 0.2s ease;
  }
  .sc-delete-icon {
    width: 52px; height: 52px;
    background: #FEF2F2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: #DC2626;
  }
  .sc-delete-modal h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .sc-delete-modal p { font-size: 14px; color: #6B7280; margin-bottom: 24px; line-height: 1.5; }
  .sc-delete-actions { display: flex; gap: 10px; justify-content: center; }
  .sc-btn-delete-confirm {
    padding: 10px 22px;
    background: #DC2626;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }
  .sc-btn-delete-confirm:hover { background: #B91C1C; }

  /* ── Toast ── */
  .sc-toast-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 200;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sc-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    animation: toastIn 0.25s ease;
    min-width: 240px;
    color: #fff;
  }
  .sc-toast.success { background: #059669; }
  .sc-toast.error   { background: #DC2626; }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Loader ── */
  .sc-loader-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 14px;
    color: #9CA3AF;
    font-size: 14px;
  }
  .sc-spinner {
    width: 36px; height: 36px;
    border: 3px solid #E8EAED;
    border-top-color: #4F46E5;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .sc-header { padding: 16px 18px; }
    .sc-body { padding: 18px; }
    .sc-stats { grid-template-columns: 1fr 1fr; }
    .sc-stats .sc-stat-card:last-child { grid-column: 1 / -1; }
    thead th:nth-child(3), tbody td:nth-child(3) { display: none; }
  }
`;

// ── Inject styles ─────────────────────────────────────────────────────────────
function StyleTag() {
  useEffect(() => {
    const id = "sc-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = styles;
      document.head.appendChild(el);
    }
    return () => document.getElementById(id)?.remove();
  }, []);
  return null;
}

// ── API helpers ───────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL;
const API      = `${API_BASE}/api/service-cities`;
const token = () => localStorage.getItem("al_token") || "";

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const ToggleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

// ── Toast component ───────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="sc-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`sc-toast ${t.type}`}>
          {t.type === "success" ? "✓" : "✕"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── City Form Modal ───────────────────────────────────────────────────────────
function CityModal({ city, onClose, onSaved, toast }) {
  const isEdit = !!city;
  const [form, setForm] = useState({
    name:     city?.name  || "",
    state:    city?.state || "",
    isActive: city?.isActive !== undefined ? city.isActive : true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "City name is required";
    if (!form.state.trim()) e.state = "State is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await apiFetch(`/${city.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast("City updated successfully", "success");
      } else {
        await apiFetch("/", { method: "POST", body: JSON.stringify(form) });
        toast("City added successfully", "success");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <div className="sc-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sc-modal">
        <div className="sc-modal-header">
          <div>
            <h2>{isEdit ? "Edit City" : "Add New City"}</h2>
            <p>{isEdit ? `Editing — ${city.name}` : "Fill in the details to add a service city"}</p>
          </div>
          <button className="sc-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sc-modal-body">
          <div className="sc-field">
            <label>City Name</label>
            <input
              type="text"
              placeholder="e.g. Patna"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="err-msg">{errors.name}</div>}
          </div>
          <div className="sc-field">
            <label>State</label>
            <input
              type="text"
              placeholder="e.g. Bihar"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              className={errors.state ? "error" : ""}
            />
            {errors.state && <div className="err-msg">{errors.state}</div>}
          </div>
          <div className="sc-toggle-row">
            <span>Set as Active</span>
            <button
              className={`sc-toggle ${form.isActive ? "on" : ""}`}
              onClick={() => set("isActive", !form.isActive)}
              type="button"
            />
          </div>
          <div className="sc-modal-footer">
            <button className="sc-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="sc-btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add City"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ city, onClose, onDeleted, toast }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiFetch(`/${city.id}`, { method: "DELETE" });
      toast("City deleted", "success");
      onDeleted();
      onClose();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sc-delete-modal">
        <div className="sc-delete-icon"><AlertIcon /></div>
        <h3>Delete City?</h3>
        <p>
          You are about to delete <strong>{city.name}</strong>. This action cannot be undone.
        </p>
        <div className="sc-delete-actions">
          <button className="sc-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="sc-btn-delete-confirm" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ServiceCities() {
  const [cities, setCities]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all"); // all | active | inactive
  const [modal, setModal]         = useState(null);  // null | "add" | "edit" | "delete"
  const [selected, setSelected]   = useState(null);
  const [toasts, setToasts]       = useState([]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCities = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/");
      setCities(data.data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCities(); }, []);

  // ── Toggle active ─────────────────────────────────────────────────────────
  const handleToggle = async (city) => {
    try {
      await apiFetch(`/${city.id}/toggle`, { method: "PATCH" });
      showToast(`${city.name} ${city.isActive ? "deactivated" : "activated"}`, "success");
      fetchCities();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ── Filter + search ───────────────────────────────────────────────────────
  const visible = cities.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : filter === "active" ? c.isActive : !c.isActive;
    return matchSearch && matchFilter;
  });

  const total    = cities.length;
  const active   = cities.filter((c) => c.isActive).length;
  const inactive = total - active;

  return (
    <>
      <StyleTag />
      <div className="sc-root">
        {/* Header */}
        <div className="sc-header">
          <div className="sc-header-left">
            <h1>Service Cities</h1>
            <p>Manage the cities where your service is available</p>
          </div>
          <span className="sc-badge">{total} {total === 1 ? "City" : "Cities"}</span>
        </div>

        <div className="sc-body">
          {/* Stats */}
          <div className="sc-stats">
            <div className="sc-stat-card">
              <div className="label">Total Cities</div>
              <div className="value">{total}</div>
            </div>
            <div className="sc-stat-card active-stat">
              <div className="label">Active</div>
              <div className="value">{active}</div>
            </div>
            <div className="sc-stat-card inactive-stat">
              <div className="label">Inactive</div>
              <div className="value">{inactive}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="sc-toolbar">
            <div className="sc-search-wrap">
              <SearchIcon />
              <input
                className="sc-search"
                placeholder="Search city or state…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                className={`sc-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button className="sc-add-btn" onClick={() => setModal("add")}>
              <PlusIcon /> Add City
            </button>
          </div>

          {/* Table */}
          <div className="sc-table-wrap">
            {loading ? (
              <div className="sc-loader-wrap">
                <div className="sc-spinner" />
                Loading cities…
              </div>
            ) : visible.length === 0 ? (
              <div className="sc-empty">
                <MapPinIcon />
                <p>{search || filter !== "all" ? "No cities match your filters" : "No cities added yet"}</p>
                <span>{search || filter !== "all" ? "Try a different search or filter" : "Click 'Add City' to get started"}</span>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Status</th>
                    <th>Added On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((city, idx) => (
                    <tr key={city.id}>
                      <td style={{ color: "#9CA3AF", fontWeight: 500 }}>{idx + 1}</td>
                      <td className="sc-city-name">{city.name}</td>
                      <td><span className="sc-state-tag">{city.state}</span></td>
                      <td>
                        <span className={`sc-status ${city.isActive ? "active" : "inactive"}`}>
                          <span className="sc-status-dot" />
                          {city.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ color: "#9CA3AF", fontSize: "13px" }}>
                        {new Date(city.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="sc-actions">
                          <button
                            className="sc-icon-btn"
                            title="Edit"
                            onClick={() => { setSelected(city); setModal("edit"); }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="sc-icon-btn toggle-btn"
                            title={city.isActive ? "Deactivate" : "Activate"}
                            onClick={() => handleToggle(city)}
                          >
                            <ToggleIcon />
                          </button>
                          <button
                            className="sc-icon-btn delete-btn"
                            title="Delete"
                            onClick={() => { setSelected(city); setModal("delete"); }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modals */}
        {modal === "add" && (
          <CityModal onClose={() => setModal(null)} onSaved={fetchCities} toast={showToast} />
        )}
        {modal === "edit" && selected && (
          <CityModal city={selected} onClose={() => { setModal(null); setSelected(null); }} onSaved={fetchCities} toast={showToast} />
        )}
        {modal === "delete" && selected && (
          <DeleteModal city={selected} onClose={() => { setModal(null); setSelected(null); }} onDeleted={fetchCities} toast={showToast} />
        )}

        {/* Toasts */}
        <Toast toasts={toasts} />
      </div>
    </>
  );
}