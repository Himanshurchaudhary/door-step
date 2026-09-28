// admin/AddonsSection.jsx
import { useState, useEffect } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/addons`;

// ── colours (same as your admin panel) ───────────────────────────────────────
const navy    = "#1a3c8f";
const green   = "#1a7f4b";
const red     = "#dc2626";
const muted   = "#6b7280";
const surface = "#f8faff";
const border  = "#e0e8ff";

// ── helpers ───────────────────────────────────────────────────────────────────
const emptyForm = { name: "", description: "", price: "", image: "", isActive: true };

export default function AddonsSection() {
  const [addons,   setAddons]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);   // addon object or null
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast,    setToast]    = useState(null);

  const token = localStorage.getItem("al_token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ── fetch ──────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers });
      const data = await res.json();
      if (data.success) setAddons(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── open form ──────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (addon) => {
    setEditing(addon);
    setForm({
      name:        addon.name,
      description: addon.description,
      price:       String(addon.price),
      image:       addon.image || "",
      isActive:    addon.isActive,
    });
    setShowForm(true);
  };

  // ── save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim())  return showToast("Name required", "error");
    if (!form.price || isNaN(Number(form.price))) return showToast("Valid price required", "error");

    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        image:       form.image.trim() || null,
        isActive:    form.isActive,
      };

      const url    = editing ? `${API}/${editing.id}` : API;
      const method = editing ? "PUT" : "POST";

      const res  = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();

      if (data.success) {
        showToast(editing ? "Addon updated!" : "Addon created!");
        setShowForm(false);
        load();
      } else {
        showToast(data.message || "Failed", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (addon) => {
    const res  = await fetch(`${API}/${addon.id}/toggle`, { method: "PATCH", headers });
    const data = await res.json();
    if (data.success) {
      showToast(`${data.data.name} ${data.data.isActive ? "activated" : "deactivated"}`);
      load();
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res  = await fetch(`${API}/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) { showToast("Addon deleted"); load(); }
      else showToast(data.message || "Failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      {/* Toast */}
      {toast && (
        <div style={{
          ...s.toast,
          background: toast.type === "error" ? red : green,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header row */}
      <div style={s.topRow}>
        <div>
          <h2 style={s.heading}>Add-on Services</h2>
          <p style={s.sub}>Manage extra services shown in package modal on website</p>
        </div>
        <button style={s.addBtn} onClick={openAdd}>+ Add New</button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: muted, padding: 24 }}>Loading…</p>
      ) : addons.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 40 }}>🧰</span>
          <p>No add-ons yet. Click "Add New" to create one.</p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Image", "Name", "Description", "Price", "Status", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {addons.map((addon, i) => (
                <tr key={addon.id} style={{ background: i % 2 === 0 ? "#fff" : surface }}>
                  <td style={s.td}>
                    {addon.image ? (
                      <img
                        src={cdnUrl(addon.image)}
                        alt={addon.name}
                        style={s.thumb}
                      />
                    ) : (
                      <div style={s.noImg}>🧹</div>
                    )}
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: "#1a1a2e" }}>{addon.name}</td>
                  <td style={{ ...s.td, color: muted, maxWidth: 200 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {addon.description || "—"}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontWeight: 700, color: navy }}>₹{addon.price.toFixed(0)}</td>
                  <td style={s.td}>
                    <button
                      style={{
                        ...s.statusPill,
                        background: addon.isActive ? "#dcfce7" : "#fee2e2",
                        color:      addon.isActive ? green     : red,
                      }}
                      onClick={() => handleToggle(addon)}
                      title="Click to toggle"
                    >
                      {addon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={{ ...s.td, display: "flex", gap: 8 }}>
                    <button style={s.editBtn} onClick={() => openEdit(addon)}>Edit</button>
                    <button
                      style={{ ...s.deleteBtn, opacity: deleting === addon.id ? 0.6 : 1 }}
                      onClick={() => {
                        if (window.confirm(`Delete "${addon.name}"?`)) handleDelete(addon.id);
                      }}
                      disabled={deleting === addon.id}
                    >
                      {deleting === addon.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>{editing ? "Edit Add-on" : "New Add-on"}</h3>

            <label style={s.label}>Name *</label>
            <input
              style={s.input}
              placeholder="e.g. Interior Cleaning"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />

            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.input, height: 72, resize: "vertical" }}
              placeholder="Short description shown to customer"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />

            <label style={s.label}>Price (₹) *</label>
            <input
              style={s.input}
              type="number"
              min="0"
              placeholder="e.g. 199"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            />

           

            <label style={{ ...s.label, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                style={{ width: 16, height: 16 }}
              />
              Active (visible on website)
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                style={{ ...s.addBtn, flex: 1, opacity: saving ? 0.7 : 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
              <button
                style={{ ...s.cancelBtn, flex: 1 }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const s = {
  wrap:    { fontFamily: "'Inter', system-ui, sans-serif", padding: "24px 0", position: "relative" },
  topRow:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  heading: { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f2454" },
  sub:     { margin: "4px 0 0", fontSize: 13, color: muted },
  addBtn: {
    background: navy, color: "#fff", border: "none",
    padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#f1f5f9", color: "#374151", border: "none",
    padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14,
    cursor: "pointer",
  },
  tableWrap: { overflowX: "auto", borderRadius: 14, border: `1px solid ${border}` },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    background: surface, padding: "12px 16px", textAlign: "left",
    fontWeight: 700, color: "#374151", borderBottom: `1px solid ${border}`,
    whiteSpace: "nowrap",
  },
  td:      { padding: "12px 16px", verticalAlign: "middle", borderBottom: `1px solid ${border}` },
  thumb:   { width: 52, height: 52, objectFit: "cover", borderRadius: 8 },
  noImg:   { width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "#eef3ff", borderRadius: 8, fontSize: 22 },
  statusPill: {
    border: "none", borderRadius: 20, padding: "4px 14px",
    fontWeight: 700, fontSize: 12, cursor: "pointer",
  },
  editBtn: {
    background: "#eef3ff", color: navy, border: "none",
    padding: "6px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  deleteBtn: {
    background: "#fee2e2", color: red, border: "none",
    padding: "6px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  empty: {
    textAlign: "center", padding: "48px 24px", color: muted,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  overlay: {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(10,20,50,0.5)", backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 20, padding: 28,
    width: "100%", maxWidth: 460,
    display: "flex", flexDirection: "column", gap: 4,
    maxHeight: "90vh", overflowY: "auto",
  },
  modalTitle: { margin: "0 0 16px", fontSize: 20, fontWeight: 800, color: "#0f2454" },
  label:  { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, marginTop: 8 },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${border}`, fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  toast: {
    position: "fixed", top: 20, right: 20, zIndex: 999,
    color: "#fff", fontWeight: 700, fontSize: 14,
    padding: "12px 20px", borderRadius: 12,
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    animation: "fadeIn 0.2s ease",
  },
};