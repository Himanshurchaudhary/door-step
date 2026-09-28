import { useState, useEffect, useCallback } from "react";

// ─── Inline CSS ───────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ct-root {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    background: #f7f8fa;
    min-height: 100vh;
    padding: 32px 24px;
    color: #1a1d23;
  }

  .ct-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ct-header-left h1 {
    font-size: 22px;
    font-weight: 700;
    color: #1a1d23;
    letter-spacing: -0.3px;
  }
  .ct-header-left p {
    font-size: 13px;
    color: #6b7280;
    margin-top: 2px;
  }

  .ct-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
    white-space: nowrap;
  }
  .ct-btn:active { transform: scale(0.97); }
  .ct-btn-primary { background: #2563eb; color: #fff; }
  .ct-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 14px rgba(37,99,235,.30); }
  .ct-btn-ghost { background: #fff; color: #374151; border: 1.5px solid #e5e7eb; }
  .ct-btn-ghost:hover { background: #f3f4f6; }
  .ct-btn-danger { background: #fee2e2; color: #dc2626; border: 1.5px solid #fecaca; }
  .ct-btn-danger:hover { background: #fecaca; }
  .ct-btn-sm { padding: 6px 12px; font-size: 13px; }
  .ct-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .ct-stats {
    display: flex;
    gap: 14px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .ct-stat-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px 22px;
    min-width: 130px;
    flex: 1;
  }
  .ct-stat-card .label {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
  .ct-stat-card .value {
    font-size: 28px;
    font-weight: 800;
    margin-top: 4px;
    color: #1a1d23;
  }
  .ct-stat-card.active .value  { color: #16a34a; }
  .ct-stat-card.inactive .value { color: #dc2626; }

  .ct-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .ct-search { flex: 1; min-width: 200px; position: relative; }
  .ct-search input {
    width: 100%;
    padding: 9px 12px 9px 38px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
    color: #1a1d23;
    outline: none;
    transition: border-color 0.18s;
  }
  .ct-search input:focus { border-color: #2563eb; }
  .ct-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  .ct-filter select {
    padding: 9px 12px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
    color: #374151;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s;
  }
  .ct-filter select:focus { border-color: #2563eb; }

  .ct-table-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    overflow: hidden;
  }
  .ct-table { width: 100%; border-collapse: collapse; }
  .ct-table thead th {
    background: #f9fafb;
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid #e5e7eb;
  }
  .ct-table tbody tr { transition: background 0.15s; }
  .ct-table tbody tr:hover { background: #f9fafb; }
  .ct-table tbody tr + tr { border-top: 1px solid #f3f4f6; }
  .ct-table tbody td {
    padding: 14px 16px;
    font-size: 14px;
    color: #374151;
    vertical-align: middle;
  }
  .ct-name-cell { font-weight: 600; color: #1a1d23; }
  .ct-desc-cell {
    color: #6b7280;
    font-size: 13px;
    max-width: 260px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ct-actions { display: flex; gap: 6px; justify-content: flex-end; }

  .ct-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .ct-badge-active   { background: #dcfce7; color: #16a34a; }
  .ct-badge-inactive { background: #fee2e2; color: #dc2626; }
  .ct-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .ct-empty { text-align: center; padding: 60px 24px; color: #9ca3af; }
  .ct-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .ct-empty h3 { font-size: 16px; color: #6b7280; font-weight: 600; }
  .ct-empty p  { font-size: 13px; margin-top: 4px; }
  .ct-loading  { text-align: center; padding: 60px; color: #9ca3af; font-size: 14px; }

  .ct-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(3px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: ct-fade-in 0.18s ease;
  }
  @keyframes ct-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .ct-modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    animation: ct-slide-up 0.2s ease;
    overflow: hidden;
  }
  @keyframes ct-slide-up {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  .ct-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1.5px solid #f3f4f6;
  }
  .ct-modal-header h2 { font-size: 17px; font-weight: 700; color: #1a1d23; }
  .ct-modal-close {
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    width: 32px; height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: #6b7280;
    transition: background 0.15s;
  }
  .ct-modal-close:hover { background: #e5e7eb; color: #1a1d23; }

  .ct-form { padding: 22px 24px; display: flex; flex-direction: column; gap: 18px; }
  .ct-field { display: flex; flex-direction: column; gap: 6px; }
  .ct-field label { font-size: 13px; font-weight: 600; color: #374151; }
  .ct-field label span { color: #dc2626; margin-left: 2px; }
  .ct-field input,
  .ct-field textarea {
    padding: 10px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 9px;
    font-size: 14px;
    color: #1a1d23;
    background: #fff;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
    resize: vertical;
  }
  .ct-field input:focus,
  .ct-field textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .ct-field input.error,
  .ct-field textarea.error { border-color: #dc2626; }
  .ct-field-error { font-size: 12px; color: #dc2626; margin-top: 2px; }

  .ct-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    background: #f9fafb;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
  }
  .ct-toggle-row span  { font-size: 14px; font-weight: 600; color: #374151; }
  .ct-toggle-row small { font-size: 12px; color: #9ca3af; display: block; margin-top: 1px; }
  .ct-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
  .ct-switch input { opacity: 0; width: 0; height: 0; }
  .ct-switch-track {
    position: absolute;
    inset: 0;
    background: #d1d5db;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ct-switch input:checked + .ct-switch-track { background: #2563eb; }
  .ct-switch-track::after {
    content: '';
    position: absolute;
    left: 3px; top: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: transform 0.2s;
  }
  .ct-switch input:checked + .ct-switch-track::after { transform: translateX(20px); }

  .ct-modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 16px 24px 20px;
    border-top: 1.5px solid #f3f4f6;
  }

  .ct-confirm-modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    animation: ct-slide-up 0.2s ease;
    overflow: hidden;
    padding: 28px 24px 22px;
    text-align: center;
  }
  .ct-confirm-icon { font-size: 38px; margin-bottom: 12px; }
  .ct-confirm-modal h3 { font-size: 17px; font-weight: 700; color: #1a1d23; }
  .ct-confirm-modal p  { font-size: 14px; color: #6b7280; margin-top: 6px; line-height: 1.5; }
  .ct-confirm-actions {
    display: flex;
    gap: 10px;
    margin-top: 22px;
    justify-content: center;
  }

  .ct-toast-wrap {
    position: fixed;
    bottom: 24px; right: 24px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ct-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    animation: ct-toast-in 0.25s ease;
    min-width: 240px;
    max-width: 340px;
  }
  @keyframes ct-toast-in {
    from { transform: translateX(60px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  .ct-toast-success { background: #16a34a; color: #fff; }
  .ct-toast-error   { background: #dc2626; color: #fff; }

  @media (max-width: 640px) {
    .ct-root { padding: 20px 14px; }
    .ct-table thead th:nth-child(3),
    .ct-table tbody td:nth-child(3) { display: none; }
    .ct-table thead th:nth-child(4),
    .ct-table tbody td:nth-child(4) { display: none; }
    .ct-stats { gap: 10px; }
    .ct-stat-card { padding: 12px 16px; }
  }
`;

// ─── Inject CSS once ──────────────────────────────────────────────────────────
function injectStyles() {
  if (document.getElementById("ct-styles")) return;
  const tag = document.createElement("style");
  tag.id = "ct-styles";
  tag.textContent = css;
  document.head.appendChild(tag);
}

// ─── API helper ───────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL;
const API      = `${API_BASE}/api/car-types`;
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("al_token") || ""}`,
});

async function apiFetch(path, opts = {}) {
  const res  = await fetch(`${API}${path}`, { headers: authHeaders(), ...opts });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Toast hook ───────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

function ToastList({ toasts }) {
  return (
    <div className="ct-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`ct-toast ct-toast-${t.type}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function ConfirmModal({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="ct-overlay" onClick={onCancel}>
      <div className="ct-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ct-confirm-icon">🗑️</div>
        <h3>Delete Car Type?</h3>
        <p>
          <strong>"{name}"</strong> will be permanently deleted.
          This action cannot be undone.
        </p>
        <div className="ct-confirm-actions">
          <button className="ct-btn ct-btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="ct-btn ct-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function CarTypeModal({ initial, onSave, onClose }) {
  const [name,   setName]   = useState(initial?.name || "");
  const [desc,   setDesc]   = useState(initial?.description || "");
  const [active, setActive] = useState(initial ? initial.isActive : true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave({
        name:        name.trim(),
        description: desc.trim() || null,
        isActive:    active,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(initial);

  return (
    <div className="ct-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ct-modal-header">
          <h2>{isEdit ? "Edit Car Type" : "Add New Car Type"}</h2>
          <button className="ct-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="ct-form">
          {/* Name */}
          <div className="ct-field">
            <label>Car Type Name <span>*</span></label>
            <input
              type="text"
              placeholder="e.g. Hatchback, SUV, Sedan…"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: "" })); }}
              className={errors.name ? "error" : ""}
              autoFocus
            />
            {errors.name && <span className="ct-field-error">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="ct-field">
            <label>
              Description{" "}
              <small style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</small>
            </label>
            <textarea
              rows={3}
              placeholder="Briefly describe this car type…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Active toggle */}
          <div className="ct-toggle-row">
            <div>
              <span>Active Status</span>
              <small>Inactive types are hidden from the website</small>
            </div>
            <label className="ct-switch">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <span className="ct-switch-track" />
            </label>
          </div>
        </div>

        <div className="ct-modal-footer">
          <button className="ct-btn ct-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="ct-btn ct-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Type"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CarTypes() {
  injectStyles();

  const [types,        setTypes]     = useState([]);
  const [loading,      setLoading]   = useState(true);
  const [search,       setSearch]    = useState("");
  const [filter,       setFilter]    = useState("all");   // all | active | inactive
  const [modal,        setModal]     = useState(null);    // null | "add" | { edit: row }
  const [deleteTarget, setDelTarget] = useState(null);
  const [deleting,     setDeleting]  = useState(false);
  const [toggling,     setToggling]  = useState(null);    // id currently being toggled

  const { toasts, push } = useToast();

  // ── Fetch ──
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiFetch("/");
      setTypes(data);
    } catch (err) {
      push(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Filtered list ──
  const filtered = types.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "active"   &&  t.isActive) ||
      (filter === "inactive" && !t.isActive);
    return matchSearch && matchFilter;
  });

  const stats = {
    total:    types.length,
    active:   types.filter((t) =>  t.isActive).length,
    inactive: types.filter((t) => !t.isActive).length,
  };

  // ── Handlers ──
  const handleAdd = async (payload) => {
    try {
      await apiFetch("/", { method: "POST", body: JSON.stringify(payload) });
      push("Car type created successfully! 🎉");
      setModal(null);
      loadAll();
    } catch (err) {
      push(err.message, "error");
      throw err;
    }
  };

  const handleEdit = async (payload) => {
    try {
      await apiFetch(`/${modal.edit.id}`, { method: "PUT", body: JSON.stringify(payload) });
      push("Car type updated successfully ✓");
      setModal(null);
      loadAll();
    } catch (err) {
      push(err.message, "error");
      throw err;
    }
  };

  const handleToggle = async (row) => {
    setToggling(row.id);
    try {
      await apiFetch(`/${row.id}/toggle`, { method: "PATCH" });
      push(`"${row.name}" has been ${row.isActive ? "deactivated" : "activated"}`);
      loadAll();
    } catch (err) {
      push(err.message, "error");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/${deleteTarget.id}`, { method: "DELETE" });
      push(`"${deleteTarget.name}" has been deleted`);
      setDelTarget(null);
      loadAll();
    } catch (err) {
      push(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──
  return (
    <div className="ct-root">
      {/* Page Header */}
      <div className="ct-header">
        <div className="ct-header-left">
          <h1>🚗 Car Types</h1>
          <p>Manage vehicle types — these appear in the dropdown on the website</p>
        </div>
        <button className="ct-btn ct-btn-primary" onClick={() => setModal("add")}>
          + Add New Type
        </button>
      </div>

      {/* Stats Strip */}
      <div className="ct-stats">
        <div className="ct-stat-card">
          <div className="label">Total</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="ct-stat-card active">
          <div className="label">Active</div>
          <div className="value">{stats.active}</div>
        </div>
        <div className="ct-stat-card inactive">
          <div className="label">Inactive</div>
          <div className="value">{stats.inactive}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ct-toolbar">
        <div className="ct-search">
          <svg className="ct-search-icon" width="15" height="15" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ct-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="ct-table-card">
        {loading ? (
          <div className="ct-loading">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="ct-empty">
            <div className="ct-empty-icon">🚙</div>
            <h3>
              {search || filter !== "all"
                ? "No results found"
                : "No car types yet"}
            </h3>
            <p>
              {search || filter !== "all"
                ? "Try a different search or filter"
                : 'Click "+ Add New Type" above to create your first one'}
            </p>
          </div>
        ) : (
          <table className="ct-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color: "#9ca3af", fontSize: 13 }}>{i + 1}</td>
                  <td className="ct-name-cell">{row.name}</td>
                  <td className="ct-desc-cell">
                    {row.description || <span style={{ color: "#d1d5db" }}>—</span>}
                  </td>
                  <td>
                    <span className={`ct-badge ${row.isActive ? "ct-badge-active" : "ct-badge-inactive"}`}>
                      <span className="ct-badge-dot" />
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="ct-actions">
                      <button
                        className="ct-btn ct-btn-ghost ct-btn-sm"
                        onClick={() => handleToggle(row)}
                        disabled={toggling === row.id}
                        title={row.isActive ? "Deactivate" : "Activate"}
                      >
                        {toggling === row.id
                          ? "…"
                          : row.isActive
                          ? "⏸ Deactivate"
                          : "▶ Activate"}
                      </button>
                      <button
                        className="ct-btn ct-btn-ghost ct-btn-sm"
                        onClick={() => setModal({ edit: row })}
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="ct-btn ct-btn-danger ct-btn-sm"
                        onClick={() => setDelTarget(row)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <CarTypeModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {/* Edit Modal */}
      {modal?.edit && (
        <CarTypeModal
          initial={modal.edit}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
          loading={deleting}
        />
      )}

      {/* Toasts */}
      <ToastList toasts={toasts} />
    </div>
  );
}