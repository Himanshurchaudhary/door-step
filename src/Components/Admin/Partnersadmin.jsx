import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL;
const API      = `${API_BASE}/api/partners`;

const CDN = import.meta.env.VITE_CLOUDINARY_BASE || "";
const cdnUrl = (publicId) => (publicId ? `${CDN}/${publicId}` : "");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${localStorage.getItem("al_token") || ""}`,
});
const authHeadersMultipart = () => ({
  Authorization: `Bearer ${localStorage.getItem("al_token") || ""}`,
});

// Image fields, in the order they appear on the form
const IMAGE_FIELDS = [
  { key: "profile_pic",         label: "Profile Photo" },
  { key: "pan_pic",              label: "PAN Card" },
  { key: "aadhar_front_pic",     label: "Aadhar (Front)" },
  { key: "aadhar_back_pic",      label: "Aadhar (Back)" },
  { key: "driving_license_pic",  label: "Driving Licence (optional)" },
];

const initialForm = {
  name: "", dob: "", mobile: "", email: "", password: "",
  driving_license_no: "", experience_years: "", is_active: 1,
};

// ── Toast ──────────────────────────────────────────────────────────────────
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

// ── Single document tile used inside the create form (local preview only) ──
function DocTile({ label, file, onPick, onRemove }) {
  const fileRef = useRef();

  return (
    <div>
      <label style={label_}>{label}</label>
      {file ? (
        <div style={{ position: "relative", width: 110, height: 110, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
          <img src={URL.createObjectURL(file)} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button type="button" onClick={onRemove} style={removeBtn} title="Remove">×</button>
        </div>
      ) : (
        <div onClick={() => fileRef.current.click()} style={dropZone}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
          <span>Upload</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={e => e.target.files[0] && onPick(e.target.files[0])}
      />
    </div>
  );
}

// ── Single document tile used inside the edit form (uploads immediately) ───
function DocTileEdit({ partnerId, field, label, publicId, onChange }) {
  const fileRef = useRef();
  const [busy, setBusy] = useState(false);

  const handleUpload = async (file) => {
    setBusy(true);
    const fd = new FormData();
    fd.append(field, file);
    try {
      const res  = await fetch(`${API}/${partnerId}/image/${field}`, {
        method: "POST", headers: authHeadersMultipart(), body: fd,
      });
      const data = await res.json();
      if (data.success) onChange(field, data.public_id);
      else alert(data.message || "Upload failed");
    } catch {
      alert("Network error");
    } finally {
      setBusy(false);
      fileRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${label}?`)) return;
    try {
      const res  = await fetch(`${API}/${partnerId}/image/${field}`, {
        method: "DELETE", headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) onChange(field, null);
      else alert(data.message || "Remove failed");
    } catch {
      alert("Network error");
    }
  };

  return (
    <div>
      <label style={label_}>{label}</label>
      {publicId ? (
        <div style={{ position: "relative", width: 110, height: 110, borderRadius: 8, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
          <img src={cdnUrl(publicId)} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button type="button" onClick={handleRemove} style={removeBtn} title="Remove">×</button>
        </div>
      ) : (
        <div onClick={() => !busy && fileRef.current.click()} style={dropZone}>
          {busy ? <span style={{ fontSize: 11 }}>Uploading…</span> : (<><span style={{ fontSize: 20, lineHeight: 1 }}>+</span><span>Upload</span></>)}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={e => e.target.files[0] && handleUpload(e.target.files[0])}
      />
    </div>
  );
}

// ── Partner row in the table ──────────────────────────────────────────────
function PartnerRow({ p, onEdit, onDelete, onToggle }) {
  const [delConfirm, setDelConfirm] = useState(false);

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {p.profile_pic ? (
            <img src={cdnUrl(p.profile_pic)} alt={p.name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f2f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👤</div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{p.dob}</div>
          </div>
        </div>
      </td>
      <td style={td}>{p.mobile}<br /><span style={{ color: "#888", fontSize: 12 }}>{p.email}</span></td>
      <td style={td}>{p.experience_years ? `${p.experience_years} yrs` : "—"}</td>
      <td style={td}>{p.driving_license_no || "—"}</td>
      <td style={td}>
        <button onClick={() => onToggle(p.id)} style={{
          padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 600,
          background: p.is_active ? "#d1fae5" : "#fee2e2",
          color:      p.is_active ? "#065f46" : "#991b1b",
        }}>
          {p.is_active ? "Active" : "Inactive"}
        </button>
      </td>
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        <button onClick={() => onEdit(p)} style={btnSecondary}>✏️ Edit</button>
        {delConfirm ? (
          <>
            <button onClick={() => onDelete(p.id)} style={{ ...btnDanger, marginLeft: 6 }}>Confirm</button>
            <button onClick={() => setDelConfirm(false)} style={{ ...btnSecondary, marginLeft: 4 }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setDelConfirm(true)} style={{ ...btnDanger, marginLeft: 6 }}>🗑 Delete</button>
        )}
      </td>
    </tr>
  );
}

// ── Modal (create + edit) ───────────────────────────────────────────────────
function PartnerModal({ mode, initial, partnerId, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const [localFiles, setLocalFiles] = useState({});     // create mode: { field: File }
  const [images, setImages] = useState(initial.images || {}); // edit mode: { field: public_id }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim())            return alert("Name is required");
    if (!form.dob)                    return alert("Date of birth is required");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return alert("Valid 10-digit mobile is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return alert("Valid email is required");
    if (mode === "create" && (!form.password || form.password.length < 6)) return alert("Password must be at least 6 characters");

    onSave(
      {
        name: form.name.trim(),
        dob: form.dob,
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        password: form.password,
        driving_license_no: form.driving_license_no,
        experience_years: form.experience_years,
        is_active: form.is_active ? 1 : 0,
      },
      localFiles
    );
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: "#1a1a2e" }}>
            {mode === "create" ? "➕ Add Partner" : "✏️ Edit Partner"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
        </div>

        <div style={formGrid}>
          <div style={fieldFull}>
            <label style={label_}>Name (as per Aadhar) *</label>
            <input style={input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ramesh Kumar" />
          </div>

          <div>
            <label style={label_}>Date of Birth *</label>
            <input style={input} type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
          </div>

          <div>
            <label style={label_}>Experience (years)</label>
            <input style={input} type="number" min={0} value={form.experience_years} onChange={e => set("experience_years", e.target.value)} placeholder="2" />
          </div>

          <div>
            <label style={label_}>Mobile *</label>
            <input style={input} value={form.mobile} onChange={e => set("mobile", e.target.value)} placeholder="9876543210" maxLength={10} />
          </div>

          <div>
            <label style={label_}>Email *</label>
            <input style={input} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="partner@example.com" />
          </div>

          <div>
            <label style={label_}>{mode === "create" ? "Password *" : "Reset Password (leave blank to keep current)"}</label>
            <input style={input} type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
          </div>

          <div>
            <label style={label_}>Driving Licence No. (optional)</label>
            <input style={input} value={form.driving_license_no} onChange={e => set("driving_license_no", e.target.value)} placeholder="DL-1420110012345" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="is_active" checked={!!form.is_active} onChange={e => set("is_active", e.target.checked ? 1 : 0)} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="is_active" style={{ ...label_, marginBottom: 0, cursor: "pointer" }}>Active</label>
          </div>

          {/* Documents */}
          <div style={fieldFull}>
            <label style={{ ...label_, marginBottom: 10 }}>Documents</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {IMAGE_FIELDS.map(({ key, label: fLabel }) =>
                mode === "create" ? (
                  <DocTile
                    key={key}
                    label={fLabel}
                    file={localFiles[key]}
                    onPick={(file) => setLocalFiles(f => ({ ...f, [key]: file }))}
                    onRemove={() => setLocalFiles(f => { const c = { ...f }; delete c[key]; return c; })}
                  />
                ) : (
                  <DocTileEdit
                    key={key}
                    partnerId={partnerId}
                    field={key}
                    label={fLabel}
                    publicId={images[key]}
                    onChange={(field, publicId) => setImages(i => ({ ...i, [field]: publicId }))}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={btnSecondary} disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} style={btnPrimary} disabled={loading}>
            {loading ? "Saving…" : mode === "create" ? "Add Partner" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function PartnersAdmin() {
  const [partners, setPartners] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const notify = (message, type = "success") => setToast({ message, type });

  const fetchPartners = useCallback(async () => {
    setFetching(true);
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setPartners(data.data);
      else notify(data.message || "Failed to load partners", "error");
    } catch {
      notify("Cannot connect to server", "error");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  // Create — multipart so all documents go in the same request
  const handleCreate = async (formData, files) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ""));
      Object.entries(files).forEach(([field, file]) => fd.append(field, file));

      const res  = await fetch(API, { method: "POST", headers: authHeadersMultipart(), body: fd });
      const data = await res.json();
      if (data.success) {
        notify("Partner added! ✓");
        setModalMode(null);
        fetchPartners();
      } else {
        notify(data.message || "Create failed", "error");
      }
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  // Update — JSON body (documents managed live inside the modal)
  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res  = await fetch(`${API}/${editData.id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        notify("Partner updated! ✓");
        setModalMode(null);
        fetchPartners();
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
      if (data.success) { notify("Partner deleted"); fetchPartners(); }
      else notify(data.message || "Delete failed", "error");
    } catch {
      notify("Network error", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (data.success) { notify(data.message); fetchPartners(); }
      else notify(data.message || "Toggle failed", "error");
    } catch {
      notify("Network error", "error");
    }
  };

  const openEdit   = (p) => { setEditData(p); setModalMode("edit"); };
  const openCreate = ()  => { setEditData(null); setModalMode("create"); };

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f7f8fc", padding: "28px 16px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {modalMode && (
        <PartnerModal
          mode={modalMode}
          partnerId={editData?.id}
          initial={
            modalMode === "edit"
              ? {
                  name: editData.name,
                  dob: editData.dob?.slice(0, 10) || "",
                  mobile: editData.mobile,
                  email: editData.email,
                  password: "",
                  driving_license_no: editData.driving_license_no || "",
                  experience_years: editData.experience_years ?? "",
                  is_active: editData.is_active,
                  images: {
                    profile_pic: editData.profile_pic,
                    pan_pic: editData.pan_pic,
                    aadhar_front_pic: editData.aadhar_front_pic,
                    aadhar_back_pic: editData.aadhar_back_pic,
                    driving_license_pic: editData.driving_license_pic,
                  },
                }
              : initialForm
          }
          onSave={modalMode === "create" ? handleCreate : handleUpdate}
          onClose={() => setModalMode(null)}
          loading={saving}
        />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>🤝 Partners</h1>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>Manage service partners / drivers</p>
          </div>
          <button onClick={openCreate} style={btnPrimary}>+ Add Partner</button>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total",    value: partners.length,                          color: "#1a3c8f" },
            { label: "Active",   value: partners.filter(p =>  p.is_active).length, color: "#065f46" },
            { label: "Inactive", value: partners.filter(p => !p.is_active).length, color: "#991b1b" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", minWidth: 100 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <input style={{ ...input, maxWidth: 320, background: "#fff" }} placeholder="🔍  Search by name, mobile or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {fetching ? (
            <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>
              {search ? "No partners found" : "No partners yet — add the first one!"}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f7f8fc", textAlign: "left" }}>
                    {["Partner", "Contact", "Experience", "Licence No.", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <PartnerRow key={p.id} p={p} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{ marginTop: 12, fontSize: 12, color: "#bbb", textAlign: "right" }}>
          {filtered.length} partner{filtered.length !== 1 ? "s" : ""} shown
        </p>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────
const td           = { padding: "14px 16px", verticalAlign: "top", fontSize: 14, color: "#333" };
const input        = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const label_       = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 };
const btnPrimary   = { background: "#1a3c8f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 };
const btnSecondary = { background: "#f0f2f7", color: "#444", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 };
const btnDanger    = { background: "#fff0f0", color: "#c0392b", border: "1px solid #f5c6c6", padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 };
const overlay      = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 };
const modal        = { background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" };
const formGrid     = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" };
const fieldFull    = { gridColumn: "1 / -1" };
const dropZone     = { width: 110, height: 110, borderRadius: 8, border: "2px dashed #c0c8e0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", fontSize: 12, gap: 4, background: "#f7f8fc" };
const removeBtn    = { position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, cursor: "pointer", lineHeight: "20px", textAlign: "center", padding: 0 };