import { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div style={{
    position: "fixed", top: 20, right: 20, zIndex: 9999,
    display: "flex", flexDirection: "column", gap: 10,
  }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "success" ? "#f0fff4" : "#fff5f5",
        border: `1px solid ${t.type === "success" ? "#c6f6d5" : "#fed7d7"}`,
        borderLeft: `4px solid ${t.type === "success" ? "#48bb78" : "#fc8181"}`,
        color: t.type === "success" ? "#276749" : "#c53030",
        padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        animation: "slideIn 0.2s ease",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: 320,
      }}>{t.message}</div>
    ))}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(2px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "32px 28px",
        width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#fff5f5", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 16px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>
        <p style={{ textAlign: "center", fontWeight: 600, fontSize: 16, color: "#1a1d3b", margin: "0 0 8px" }}>
          Delete Banner?
        </p>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>
          {message || "This action cannot be undone."}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px", borderRadius: 8, border: "none",
            background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// ─── Banner Form Modal ────────────────────────────────────────────────────────
const BannerFormModal = ({ open, onClose, onSave, editData, loading }) => {
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", link: "",
    position: "home_top", is_active: 1, sort_order: 0,
  });
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title:      editData.title      || "",
        subtitle:   editData.subtitle   || "",
        image:      editData.image      || "",
        link:       editData.link       || "",
        position:   editData.position   || "home_top",
        is_active:  editData.is_active  ?? 1,
        sort_order: editData.sort_order || 0,
      });
      setPreview(editData.image ? `${API_BASE}${editData.image}` : "");
    } else {
      setForm({ title: "", subtitle: "", image: "", link: "", position: "home_top", is_active: 1, sort_order: 0 });
      setPreview("");
    }
  }, [editData, open]);

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setForm(f => ({ ...f, image: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };

  if (!open) return null;

  const positions = [
    { value: "home_top",    label: "Home — Top" },
    { value: "home_middle", label: "Home — Middle" },
    { value: "home_bottom", label: "Home — Bottom" },
    { value: "category",    label: "Category Page" },
    { value: "offer",       label: "Offers Page" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", backdropFilter: "blur(3px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1d3b" }}>
              {editData ? "Edit Banner" : "Add New Banner"}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              {editData ? "Update banner details" : "Add a new banner"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "none",
            background: "#f8fafc", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#64748b",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>

          {/* Image Upload */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Banner Image *</label>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? "#ec4899" : preview ? "#ec4899" : "#e2e8f0"}`,
                borderRadius: 12, cursor: "pointer", overflow: "hidden",
                background: dragOver ? "rgba(236,72,153,0.04)" : "#f8fafc",
                transition: "all 0.2s",
                minHeight: preview ? "auto" : 140,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={preview} alt="preview" style={{
                    width: "100%", maxHeight: 200, objectFit: "cover", display: "block",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                    stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ marginBottom: 10 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                    Click or drag & drop to upload
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#cbd5e1" }}>
                    PNG, JPG, WebP — max 5MB
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleImage(e.target.files[0])} />
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Banner title"
              style={inputStyle}
            />
          </div>

          {/* Subtitle */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Subtitle</label>
            <input
              value={form.subtitle}
              onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
              placeholder="Optional tagline"
              style={inputStyle}
            />
          </div>

          {/* Link */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Link (optional)</label>
            <input
              value={form.link}
              onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              placeholder="https://example.com or /services/plumber"
              style={inputStyle}
            />
          </div>

          {/* Position + Sort Order */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Position</label>
              <select
                value={form.position}
                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                style={{ ...inputStyle, appearance: "none" }}
              >
                {positions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input
                type="number" min="0"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Status */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: 10, background: "#f8fafc",
            border: "1px solid #f1f5f9", marginBottom: 24,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1d3b" }}>Active Status</p>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                {form.is_active ? "Banner is visible" : "Banner is hidden"}
              </p>
            </div>
            <div
              onClick={() => setForm(f => ({ ...f, is_active: f.is_active ? 0 : 1 }))}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                background: form.is_active ? "#ec4899" : "#e2e8f0",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: form.is_active ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }} />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "12px", borderRadius: 10,
              border: "1.5px solid #e2e8f0", background: "#fff",
              color: "#64748b", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Cancel</button>
            <button
              onClick={() => onSave(form)}
              disabled={loading || !form.image}
              style={{
                flex: 2, padding: "12px", borderRadius: 10, border: "none",
                background: loading || !form.image
                  ? "#f1f5f9"
                  : "linear-gradient(135deg,#ec4899,#a855f7)",
                color: loading || !form.image ? "#94a3b8" : "#fff",
                fontWeight: 600, fontSize: 14, cursor: loading || !form.image ? "not-allowed" : "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Saving…" : editData ? "Update Banner" : "Add Banner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminBanners() {
  const [banners, setBanners]         = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [formOpen, setFormOpen]       = useState(false);
  const [editData, setEditData]       = useState(null);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [toasts, setToasts]           = useState([]);
  const [search, setSearch]           = useState("");
  const [filterPos, setFilterPos]     = useState("all");

  const token = localStorage.getItem("al_token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  // ── Fetch banners ──────────────────────────────────────────────────────────
  const fetchBanners = async () => {
    try {
      setPageLoading(true);
      const res  = await fetch(`${API_BASE}/api/banners`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch {
      showToast("Failed to load banners", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ── Save (create / update) ────────────────────────────────────────────────
  const handleSave = async (form) => {
    setSaving(true);
    try {
      const url    = editData
        ? `${API_BASE}/api/banners/${editData.id}`
        : `${API_BASE}/api/banners`;
      const method = editData ? "PUT" : "POST";

      const res  = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();

      if (data.success) {
        showToast(editData ? "Banner updated successfully!" : "Banner added successfully!");
        setFormOpen(false);
        setEditData(null);
        fetchBanners();
      } else {
        showToast(data.message || "Something went wrong", "error");
      }
    } catch {
      showToast("Could not connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      const res  = await fetch(`${API_BASE}/api/banners/${deleteId}`, {
        method: "DELETE", headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        showToast("Banner deleted successfully!");
        fetchBanners();
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // ── Toggle ─────────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API_BASE}/api/banners/${id}/toggle`, {
        method: "PATCH", headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setBanners(b => b.map(x => x.id === id ? { ...x, is_active: data.is_active } : x));
      }
    } catch {
      showToast("Toggle failed", "error");
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = banners.filter(b => {
    const matchSearch = (b.title || "").toLowerCase().includes(search.toLowerCase());
    const matchPos    = filterPos === "all" || b.position === filterPos;
    return matchSearch && matchPos;
  });

  const positions = ["all", "home_top", "home_middle", "home_bottom", "category", "offer"];
  const posLabel  = (p) => ({
    all: "All", home_top: "Home Top", home_middle: "Home Middle",
    home_bottom: "Home Bottom", category: "Category", offer: "Offers"
  }[p] || p);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .banner-card { transition: all 0.2s ease !important; }
        .action-btn:hover { opacity: 0.8; }
        @media (max-width: 640px) {
          .banners-grid { grid-template-columns: 1fr !important; }
          .page-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .filter-bar { flex-wrap: wrap !important; }
        }
      `}</style>

      <Toast toasts={toasts} />

      <ConfirmModal
        open={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        message="Are you sure you want to permanently delete this banner?"
      />

      <BannerFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
        loading={saving}
      />

      <div style={{ padding: "28px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Page Header ── */}
        <div className="page-header" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1d3b", marginBottom: 4 }}>
              Banner Management
            </h1>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              {banners.length} banner{banners.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => { setEditData(null); setFormOpen(true); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 20px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#ec4899,#a855f7)",
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(236,72,153,0.35)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Banner
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar" style={{
          display: "flex", gap: 10, marginBottom: 24, alignItems: "center",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search banners…"
              style={{
                ...inputStyle, paddingLeft: 36, paddingRight: 14,
                background: "#fff", margin: 0,
              }}
            />
          </div>

          {/* Position filter */}
          {positions.map(p => (
            <button key={p}
              onClick={() => setFilterPos(p)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1.5px solid",
                borderColor: filterPos === p ? "#ec4899" : "#e2e8f0",
                background: filterPos === p ? "rgba(236,72,153,0.06)" : "#fff",
                color: filterPos === p ? "#ec4899" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                whiteSpace: "nowrap",
              }}
            >{posLabel(p)}</button>
          ))}
        </div>

        {/* ── Loading ── */}
        {pageLoading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #f1f5f9",
              borderTopColor: "#ec4899", borderRadius: "50%",
              animation: "spin 0.7s linear infinite", margin: "0 auto 12px",
            }} />
            <p style={{ color: "#94a3b8", fontSize: 13 }}>Loading banners…</p>
          </div>
        ) : filtered.length === 0 ? (
          // ── Empty State ──
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(236,72,153,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1d3b", marginBottom: 8 }}>
              {search || filterPos !== "all" ? "No banners found" : "No banners yet"}
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              {search || filterPos !== "all"
                ? "Try changing the filter or add a new banner"
                : "Add your first banner for the app"}
            </p>
            {!search && filterPos === "all" && (
              <button
                onClick={() => setFormOpen(true)}
                style={{
                  padding: "10px 22px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#ec4899,#a855f7)",
                  color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >Add First Banner</button>
            )}
          </div>
        ) : (
          // ── Banner Grid ──
          <div className="banners-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}>
            {filtered.map(banner => (
              <div key={banner.id} className="banner-card" style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                overflow: "hidden",
                animation: "fadeIn 0.25s ease",
              }}>
                {/* Image */}
                <div style={{ position: "relative", height: 160, background: "#f8fafc" }}>
                  {banner.image ? (
                    <img
                      src={`${API_BASE}${banner.image}`}
                      alt={banner.title || "banner"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{
                      height: "100%", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#cbd5e1",
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}

                  {/* Position badge */}
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    fontSize: 10, fontWeight: 600, padding: "3px 8px",
                    borderRadius: 6, backdropFilter: "blur(4px)",
                    letterSpacing: 0.3,
                  }}>{posLabel(banner.position)}</span>

                  {/* Sort order */}
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(255,255,255,0.9)", color: "#64748b",
                    fontSize: 10, fontWeight: 700, padding: "3px 8px",
                    borderRadius: 6,
                  }}>#{banner.sort_order}</span>
                </div>

                {/* Info */}
                <div style={{ padding: "14px 16px" }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: "#1a1d3b",
                    marginBottom: 4, whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                  }}>{banner.title || <span style={{ color: "#cbd5e1" }}>No title</span>}</p>

                  {banner.subtitle && (
                    <p style={{
                      fontSize: 12, color: "#94a3b8", marginBottom: 4,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{banner.subtitle}</p>
                  )}

                  {banner.link && (
                    <p style={{
                      fontSize: 11, color: "#a855f7", marginBottom: 0,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>🔗 {banner.link}</p>
                  )}
                </div>

                {/* Actions */}
                <div style={{
                  padding: "10px 16px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid #f8fafc",
                }}>
                  {/* Toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      onClick={() => handleToggle(banner.id)}
                      style={{
                        width: 38, height: 20, borderRadius: 10, cursor: "pointer",
                        background: banner.is_active ? "#ec4899" : "#e2e8f0",
                        position: "relative", transition: "background 0.2s", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 2,
                        left: banner.is_active ? 20 : 2,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: banner.is_active ? "#ec4899" : "#94a3b8",
                    }}>{banner.is_active ? "Active" : "Inactive"}</span>
                  </div>

                  {/* Edit + Delete */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="action-btn"
                      onClick={() => { setEditData(banner); setFormOpen(true); }}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0",
                        background: "#fff", cursor: "pointer", color: "#64748b",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="action-btn"
                      onClick={() => setDeleteId(banner.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: "1.5px solid #fee2e2",
                        background: "#fff5f5", cursor: "pointer", color: "#ef4444",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "#374151", marginBottom: 6,
};

const inputStyle = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, color: "#1a1d3b", outline: "none",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  background: "#fff", transition: "border-color 0.2s",
};