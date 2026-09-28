import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL;
const API      = `${API_BASE}/api/packages`;

// Cloudinary base URL — set in your .env
// e.g. VITE_CLOUDINARY_BASE=https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload
const CDN = import.meta.env.VITE_CLOUDINARY_BASE || "";

// Build a full Cloudinary URL from a stored public_id
const cdnUrl = (publicId) => (publicId ? `${CDN}/${publicId}` : "");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${localStorage.getItem("al_token") || ""}`,
});

// For multipart requests — do NOT set Content-Type (browser sets it with boundary)
const authHeadersMultipart = () => ({
  Authorization: `Bearer ${localStorage.getItem("al_token") || ""}`,
});

const initialForm = {
  name: "", price: "", description: "",
  features: "", is_active: 1, sort_order: 0,
};

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "#1a7f4b" : "#c0392b",
      color: "#fff", padding: "12px 20px", borderRadius: 8,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)", fontSize: 14,
      display: "flex", alignItems: "center", gap: 10, minWidth: 220,
    }}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{
        marginLeft: "auto", background: "none", border: "none",
        color: "#fff", cursor: "pointer", fontSize: 16, lineHeight: 1,
      }}>×</button>
    </div>
  );
}

function FeatureTag({ text }) {
  return (
    <span style={{
      display: "inline-block", background: "#eef4ff", color: "#1e40af",
      borderRadius: 4, padding: "2px 8px", fontSize: 12,
      margin: "2px 3px 2px 0", fontWeight: 500,
    }}>{text}</span>
  );
}

// ── Image picker used in the create form (local preview before upload) ─────────
// Files are collected in a ref and sent with the create request.
function ImagePicker({ files, onChange }) {
  const fileRef = useRef();

  const handleAdd = (e) => {
    const selected = Array.from(e.target.files);
    onChange([...files, ...selected].slice(0, 5)); // max 5
    fileRef.current.value = "";
  };

  const handleRemove = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label style={label}>Images <span style={{ color: "#aaa", fontWeight: 400 }}>(up to 5)</span></label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {files.map((file, i) => (
          <div key={i} style={{
            position: "relative", width: 90, height: 90,
            borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0",
          }}>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => handleRemove(i)}
              type="button"
              style={{
                position: "absolute", top: 3, right: 3,
                background: "rgba(0,0,0,0.55)", color: "#fff",
                border: "none", borderRadius: "50%",
                width: 20, height: 20, fontSize: 12,
                cursor: "pointer", lineHeight: "20px", textAlign: "center", padding: 0,
              }}
              title="Remove"
            >×</button>
          </div>
        ))}

        {files.length < 5 && (
          <div
            onClick={() => fileRef.current.click()}
            style={{
              width: 90, height: 90, borderRadius: 8,
              border: "2px dashed #c0c8e0",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#888", fontSize: 12, gap: 4,
              background: "#f7f8fc",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
            <span>Add Image</span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleAdd}
      />
      <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
        JPG / PNG / WebP · Max 5 MB each
      </p>
    </div>
  );
}

// ── Image manager used in the edit form (uploads to existing package) ──────────
function ImageManager({ pkgId, images, onImagesChange }) {
  const fileRef    = useRef();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res  = await fetch(`${API}/${pkgId}/images`, {
        method:  "POST",
        headers: authHeadersMultipart(),
        body:    fd,
      });
      const data = await res.json();
      if (data.success) onImagesChange(data.images); // array of public_ids
      else alert(data.message || "Upload failed");
    } catch {
      alert("Network error");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      // URL-encode publicId because it may contain slashes
      const res  = await fetch(`${API}/${pkgId}/images/${encodeURIComponent(publicId)}`, {
        method:  "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) onImagesChange(data.images);
      else alert(data.message || "Delete failed");
    } catch {
      alert("Network error");
    }
  };

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label style={label}>Images</label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {(images || []).map(publicId => (
          <div key={publicId} style={{
            position: "relative", width: 90, height: 90,
            borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0",
          }}>
            <img
              src={cdnUrl(publicId)}
              alt={publicId}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => handleDelete(publicId)}
              type="button"
              style={{
                position: "absolute", top: 3, right: 3,
                background: "rgba(0,0,0,0.55)", color: "#fff",
                border: "none", borderRadius: "50%",
                width: 20, height: 20, fontSize: 12,
                cursor: "pointer", lineHeight: "20px", textAlign: "center", padding: 0,
              }}
              title="Delete image"
            >×</button>
          </div>
        ))}

        <div
          onClick={() => !uploading && fileRef.current.click()}
          style={{
            width: 90, height: 90, borderRadius: 8,
            border: "2px dashed #c0c8e0",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: uploading ? "default" : "pointer",
            color: "#888", fontSize: 12, gap: 4, background: "#f7f8fc",
          }}
        >
          {uploading ? (
            <span style={{ fontSize: 11 }}>Uploading…</span>
          ) : (
            <>
              <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
              <span>Add Image</span>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
        JPG / PNG / WebP · Max 5 MB
      </p>
    </div>
  );
}

// ── Package row in the table ──────────────────────────────────────────────────
function PackageRow({ pkg, onEdit, onDelete, onToggle }) {
  const [delConfirm, setDelConfirm] = useState(false);
  const thumb = pkg.images?.[0];

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td style={td}>{pkg.sort_order}</td>

      {/* Thumbnail + name */}
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {thumb ? (
            <img
              src={cdnUrl(thumb)}
              alt={pkg.name}
              style={{ width: 42, height: 42, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 42, height: 42, borderRadius: 6, background: "#f0f2f7",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>📦</div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{pkg.name}</div>
            {pkg.description && (
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{pkg.description}</div>
            )}
          </div>
        </div>
      </td>

      <td style={td}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1a3c8f" }}>
          ₹{Number(pkg.price).toFixed(0)}
        </span>
      </td>

      <td style={{ ...td, maxWidth: 240 }}>
        {(pkg.features || []).map((f, i) => <FeatureTag key={i} text={f} />)}
      </td>

      <td style={td}>
        <button onClick={() => onToggle(pkg.id)} style={{
          padding: "4px 12px", borderRadius: 20, border: "none",
          cursor: "pointer", fontSize: 12, fontWeight: 600,
          background: pkg.is_active ? "#d1fae5" : "#fee2e2",
          color:      pkg.is_active ? "#065f46" : "#991b1b",
        }}>
          {pkg.is_active ? "Active" : "Inactive"}
        </button>
      </td>

      <td style={{ ...td, whiteSpace: "nowrap" }}>
        <button onClick={() => onEdit(pkg)} style={btnSecondary}>✏️ Edit</button>
        {delConfirm ? (
          <>
            <button onClick={() => onDelete(pkg.id)} style={{ ...btnDanger, marginLeft: 6 }}>Confirm</button>
            <button onClick={() => setDelConfirm(false)} style={{ ...btnSecondary, marginLeft: 4 }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setDelConfirm(true)} style={{ ...btnDanger, marginLeft: 6 }}>🗑 Delete</button>
        )}
      </td>
    </tr>
  );
}

// ── Modal (create + edit) ─────────────────────────────────────────────────────
function PackageModal({ mode, initial, pkgId, onSave, onClose, loading }) {
  const [form,        setForm]        = useState(initial);
  const [images,      setImages]      = useState(initial.images || []); // public_ids (edit)
  const [localFiles,  setLocalFiles]  = useState([]);                   // File objects (create)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim())            return alert("Package name is required");
    if (!form.price || isNaN(form.price)) return alert("Valid price is required");

    // features: parse textarea (one per line)
    const features = form.features
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    onSave(
      {
        name:       form.name.trim(),
        price:      parseFloat(form.price),
        description: form.description,
        features,
        is_active:  form.is_active ? 1 : 0,
        sort_order: parseInt(form.sort_order) || 0,
      },
      localFiles // only used in create mode
    );
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: "#1a1a2e" }}>
            {mode === "create" ? "➕ New Package" : "✏️ Edit Package"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
        </div>

        <div style={formGrid}>
          {/* Name */}
          <div style={fieldFull}>
            <label style={label}>Package Name *</label>
            <input style={input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Premium Wash" />
          </div>

          {/* Price */}
          <div>
            <label style={label}>Price (₹) *</label>
            <input style={input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="799" min={0} />
          </div>

          {/* Sort order */}
          <div>
            <label style={label}>Sort Order</label>
            <input style={input} type="number" value={form.sort_order} onChange={e => set("sort_order", e.target.value)} placeholder="0" min={0} />
          </div>

          {/* Description */}
          <div style={fieldFull}>
            <label style={label}>Description</label>
            <input style={input} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description" />
          </div>

          {/* Features */}
          <div style={fieldFull}>
            <label style={label}>
              Features <span style={{ color: "#aaa", fontWeight: 400 }}>(one per line)</span>
            </label>
            <textarea
              style={{ ...input, height: 110, resize: "vertical" }}
              value={form.features}
              onChange={e => set("features", e.target.value)}
              placeholder={"Exterior Wash\nTyre & Rim Cleaning"}
            />
          </div>

          {/* Active toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              id="is_active"
              checked={!!form.is_active}
              onChange={e => set("is_active", e.target.checked ? 1 : 0)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="is_active" style={{ ...label, marginBottom: 0, cursor: "pointer" }}>
              Active (show on frontend)
            </label>
          </div>

          {/* Images — local picker on create, live manager on edit */}
          {mode === "create" ? (
            <ImagePicker files={localFiles} onChange={setLocalFiles} />
          ) : (
            pkgId && (
              <ImageManager pkgId={pkgId} images={images} onImagesChange={setImages} />
            )
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={btnSecondary} disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} style={btnPrimary} disabled={loading}>
            {loading
              ? "Saving…"
              : mode === "create" ? "Create Package" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PackagesAdmin() {
  const [packages,   setPackages]   = useState([]);
  const [fetching,   setFetching]   = useState(true);
  const [modalMode,  setModalMode]  = useState(null);   // "create" | "edit" | null
  const [editData,   setEditData]   = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [search,     setSearch]     = useState("");

  const notify = (message, type = "success") => setToast({ message, type });

  const fetchPackages = useCallback(async () => {
    setFetching(true);
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setPackages(data.data);
      else notify(data.message || "Failed to load packages", "error");
    } catch {
      notify("Cannot connect to server", "error");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  // Create — send as multipart/form-data so images are uploaded in the same request
  const handleCreate = async (formData, files) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",        formData.name);
      fd.append("price",       formData.price);
      fd.append("description", formData.description || "");
      fd.append("features",    JSON.stringify(formData.features));
      fd.append("is_active",   formData.is_active);
      fd.append("sort_order",  formData.sort_order);
      files.forEach(file => fd.append("images", file));

      const res  = await fetch(API, {
        method:  "POST",
        headers: authHeadersMultipart(),
        body:    fd,
      });
      const data = await res.json();
      if (data.success) {
        notify("Package created! ✓");
        setModalMode(null);
        fetchPackages();
      } else {
        notify(data.message || "Create failed", "error");
      }
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  // Update — JSON body (images managed separately via ImageManager)
  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/${editData.id}`, {
        method:  "PUT",
        headers: authHeaders(),
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        notify("Package updated! ✓");
        setModalMode(null);
        fetchPackages();
      } else {
        notify(data.message || "Update failed", "error");
      }
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (data.success) { notify("Package deleted"); fetchPackages(); }
      else notify(data.message || "Delete failed", "error");
    } catch {
      notify("Network error", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (data.success) { notify(data.message); fetchPackages(); }
      else notify(data.message || "Toggle failed", "error");
    } catch {
      notify("Network error", "error");
    }
  };

  const openEdit   = (pkg) => { setEditData(pkg); setModalMode("edit"); };
  const openCreate = ()    => { setEditData(null); setModalMode("create"); };

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f7f8fc", padding: "28px 16px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {modalMode && (
        <PackageModal
          mode={modalMode}
          pkgId={editData?.id}
          initial={
            modalMode === "edit"
              ? {
                  name:        editData.name,
                  price:       editData.price,
                  description: editData.description || "",
                  features:    (editData.features || []).join("\n"),
                  is_active:   editData.is_active,
                  sort_order:  editData.sort_order,
                  images:      editData.images || [],
                }
              : initialForm
          }
          onSave={modalMode === "create" ? handleCreate : handleUpdate}
          onClose={() => setModalMode(null)}
          loading={saving}
        />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>📦 Packages</h1>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>Manage car wash service packages</p>
          </div>
          <button onClick={openCreate} style={btnPrimary}>+ New Package</button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total",    value: packages.length,                         color: "#1a3c8f" },
            { label: "Active",   value: packages.filter(p =>  p.is_active).length, color: "#065f46" },
            { label: "Inactive", value: packages.filter(p => !p.is_active).length, color: "#991b1b" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", minWidth: 100 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            style={{ ...input, maxWidth: 320, background: "#fff" }}
            placeholder="🔍  Search by name or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {fetching ? (
            <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>
              {search ? "No packages found" : "No packages yet — create the first one!"}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f7f8fc", textAlign: "left" }}>
                    {["#", "Name", "Price", "Features", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(pkg => (
                    <PackageRow
                      key={pkg.id}
                      pkg={pkg}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{ marginTop: 12, fontSize: 12, color: "#bbb", textAlign: "right" }}>
          {filtered.length} package{filtered.length !== 1 ? "s" : ""} shown
        </p>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const td           = { padding: "14px 16px", verticalAlign: "top", fontSize: 14, color: "#333" };
const input        = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const label        = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 };
const btnPrimary   = { background: "#1a3c8f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 };
const btnSecondary = { background: "#f0f2f7", color: "#444", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 };
const btnDanger    = { background: "#fff0f0", color: "#c0392b", border: "1px solid #f5c6c6", padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 };
const overlay      = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 };
const modal        = { background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" };
const formGrid     = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" };
const fieldFull    = { gridColumn: "1 / -1" };