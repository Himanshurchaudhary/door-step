import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;
const API      = `${API_BASE}/api/packages`;

const CDN    = import.meta.env.VITE_CLOUDINARY_BASE || "";
const cdnUrl = (publicId) => (publicId ? `${CDN}/${publicId}` : "");

const WHATSAPP_NUMBER = "919898249789";
const waLink = (pkgName) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'd like to book the ${pkgName} package.`
  )}`;

// ── Brand tokens ──────────────────────────────────────────────────────────────
const navy      = "#1a3c8f";
const navyDeep  = "#0f2454";
const green     = "#1a7f4b";
const greenTint = "#e4f7ed";
const ink       = "#1a1a2e";
const muted     = "#6b7280";
const skyTint   = "#eef3ff";

// ─── Auto-scrolling circular image reel ──────────────────────────────────────
function ImageReel({ images, name, size = 160, isPopular = false }) {
  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % images.length);
        setFade(true);
      }, 220);
    }, 2400);
    return () => clearInterval(id);
  }, [images.length]);

  const src = images[idx] ? cdnUrl(images[idx]) : null;

  return (
    <div style={{ position: "relative", width: size + 20, height: size + 20, flexShrink: 0 }}>
      {/* Glow ring */}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: isPopular
            ? `conic-gradient(${navy}, #4f8ef7, #a5c4ff, ${navy})`
            : `conic-gradient(#c7d8ff, #eef3ff, #c7d8ff, #8eb0ff, #c7d8ff)`,
          padding: 3,
        }}
      />
      {/* White gap */}
      <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "#fff", zIndex: 1 }} />
      {/* Image circle */}
      <div style={{
        position: "absolute", inset: 6, borderRadius: "50%",
        overflow: "hidden", zIndex: 2, background: skyTint,
        boxShadow: isPopular
          ? `0 8px 28px rgba(26,60,143,0.28)`
          : `0 4px 16px rgba(26,60,143,0.12)`,
      }}>
        {src ? (
          <img
            src={src} alt={name}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              opacity: fade ? 1 : 0, transition: "opacity 0.22s ease",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.3,
          }}>🚗</div>
        )}
      </div>
      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{
          position: "absolute", bottom: 4, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: 5, zIndex: 3,
        }}>
          {images.map((_, i) => (
            <span key={i} style={{
              width: i === idx ? 14 : 5, height: 5, borderRadius: 4,
              background: i === idx ? (isPopular ? navy : "#4f8ef7") : "rgba(180,195,230,0.8)",
              display: "block", transition: "width 0.3s ease, background 0.3s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Package Detail Modal ─────────────────────────────────────────────────────
function DetailModal({ pkg, onClose, onBookNow }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = pkg.images || [];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Auto-cycle images
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setImgIdx((i) => (i + 1) % images.length), 2500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div style={modal.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal.sheet}>
        {/* Close btn */}
        <button style={modal.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {/* Image banner */}
        <div style={modal.imageBanner}>
          {images.length > 0 ? (
            <>
              <img src={cdnUrl(images[imgIdx])} alt={pkg.name} style={modal.bannerImg} />
              {images.length > 1 && (
                <div style={modal.dots}>
                  {images.map((_, i) => (
                    <button
                      key={i} onClick={() => setImgIdx(i)}
                      style={{
                        ...modal.dot,
                        background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.4)",
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={modal.bannerPlaceholder}>🚗</div>
          )}
        </div>

        {/* Content */}
        <div style={modal.content}>
          <h2 style={modal.title}>{pkg.name}</h2>
          {pkg.description && <p style={modal.desc}>{pkg.description}</p>}

          {/* Price */}
          <div style={modal.priceBox}>
            <span style={modal.priceLabel}>Package Price</span>
            <div style={modal.priceVal}>
              <span style={{ fontSize: 20, fontWeight: 700, color: navy }}>₹</span>
              <span style={{ fontSize: 38, fontWeight: 900, color: navy, lineHeight: 1 }}>
                {Number(pkg.price).toFixed(0)}
              </span>
            </div>
          </div>

          {/* Features */}
          {pkg.features?.length > 0 && (
            <div style={modal.featuresWrap}>
              <h4 style={modal.featHeading}>What's Included</h4>
              <ul style={modal.featureList}>
                {pkg.features.map((f, i) => (
                  <li key={i} style={modal.featureItem}>
                    <span style={modal.checkCircle}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trust pills */}
          <div style={modal.trustRow}>
            {["Doorstep Service", "Trained Team", "Eco Friendly", "Safe Products"].map((t) => (
              <span key={t} style={modal.trustPill}>{t}</span>
            ))}
          </div>

          {/* CTA — two buttons */}
          <div style={modal.ctaRow}>
            {/* WhatsApp fallback */}
            <a
              href={waLink(pkg.name)}
              target="_blank"
              rel="noopener noreferrer"
              style={modal.waBtn}
            >
              <span style={{ fontSize: 18 }}>💬</span>
              WhatsApp
            </a>

            {/* Primary: Go to Booking Form */}
            <button style={modal.bookBtn} onClick={() => onBookNow(pkg)}>
              Book Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile grid helper ───────────────────────────────────────────────────────
// Splits packages into rows: every row has 2 cards,
// EXCEPT when a single card is left over (odd total) → that lone card is centred.
function MobileGrid({ packages, popularId, onSelect }) {
  const rows = [];
  for (let i = 0; i < packages.length; i += 2) {
    rows.push(packages.slice(i, i + 2));
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0 6px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: 10,
            justifyContent: row.length === 1 ? "center" : "stretch",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {row.map((pkg) => {
            const isPopular = pkg.id === popularId;
            return (
              <button
                key={pkg.id}
                className="pkg-pill"
                onClick={() => onSelect(pkg)}
                style={{
                  // ✅ FIX: percentage-based fixed width, hard cap, no overflow
                  flex: "0 0 calc(50% - 5px)",
                  minWidth: 0,
                  maxWidth: "calc(50% - 5px)",
                  boxSizing: "border-box",
                  border: isPopular ? `2.5px solid ${navy}` : "2px solid #e0e8ff",
                  boxShadow: isPopular
                    ? `0 6px 24px rgba(26,60,143,0.15)`
                    : "0 2px 10px rgba(0,0,0,0.06)",
                }}
              >
                {isPopular && <span style={s.popularTag}>⭐ Most Popular</span>}
                <ImageReel images={pkg.images || []} name={pkg.name} size={110} isPopular={isPopular} />
                <p style={s.pillName}>{pkg.name}</p>
                <p style={s.pillPrice}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>₹</span>
                  {Number(pkg.price).toFixed(0)}
                </p>
                <span style={s.viewDetails}>View Details →</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 520px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/active`);
        const data = await res.json();
        if (data.success) setPackages(data.data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Middle plan = most popular
  const popularId = (() => {
    if (packages.length < 3) return null;
    const sorted = [...packages].sort((a, b) => a.price - b.price);
    return sorted[Math.floor(sorted.length / 2)].id;
  })();

  // Navigate to booking form with selected package pre-filled
  const handleBookNow = (pkg) => {
    setSelected(null);
    navigate("/book", { state: { selectedPackage: pkg } });
  };

  return (
    <section style={s.section} id="packages">
      <style>{css}</style>

      {/* Header */}
      <div style={s.headerWrap}>
        <span style={s.eyebrow}>WE COME TO YOU</span>
        <h2 style={s.heading}>
          Car Wash <span style={{ color: green }}>Packages</span>
        </h2>
        <p style={s.subheading}>
          Tap a package to see full details and book instantly.
        </p>
      </div>

      {/* Skeletons */}
      {loading && (
        <div className="pkg-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pkg-pill pkg-skel">
              <div className="skel-circle" />
              <div className="skel-line" style={{ width: "60%", height: 14, marginTop: 14 }} />
              <div className="skel-line" style={{ width: "40%", height: 20, marginTop: 8 }} />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p style={{ textAlign: "center", color: muted }}>
          Packages load nahi ho paayi. Page refresh karein.
        </p>
      )}

      {/* Cards — Mobile uses MobileGrid, Desktop uses CSS grid */}
      {!loading && !error && packages.length > 0 && (
        isMobile ? (
          <MobileGrid
            packages={packages}
            popularId={popularId}
            onSelect={setSelected}
          />
        ) : (
          <div className="pkg-grid">
            {packages.map((pkg) => {
              const isPopular = pkg.id === popularId;
              return (
                <button
                  key={pkg.id}
                  className="pkg-pill"
                  onClick={() => setSelected(pkg)}
                  style={{
                    border: isPopular ? `2.5px solid ${navy}` : "2px solid #e0e8ff",
                    boxShadow: isPopular
                      ? `0 6px 24px rgba(26,60,143,0.15)`
                      : "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  {isPopular && <span style={s.popularTag}>⭐ Most Popular</span>}
                  <ImageReel images={pkg.images || []} name={pkg.name} size={160} isPopular={isPopular} />
                  <p style={s.pillName}>{pkg.name}</p>
                  <p style={s.pillPrice}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>₹</span>
                    {Number(pkg.price).toFixed(0)}
                  </p>
                  <span style={s.viewDetails}>View Details →</span>
                </button>
              );
            })}
          </div>
        )
      )}

      {/* Modal */}
      {selected && (
        <DetailModal
          pkg={selected}
          onClose={() => setSelected(null)}
          onBookNow={handleBookNow}
        />
      )}
    </section>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 8px;
  }
  .pkg-pill {
    background: #fff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 10px 20px;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    font-family: inherit;
    position: relative;
    text-align: center;
    overflow: hidden;
    word-break: break-word;
  }
  .pkg-pill:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(26,60,143,0.14) !important; }
  .pkg-pill:focus-visible { outline: 3px solid #2f5bc9; outline-offset: 3px; }
  .pkg-skel { pointer-events: none; }
  .skel-circle {
    width: 160px; height: 160px; border-radius: 50%;
    background: linear-gradient(90deg, #eef1f7 25%, #e2e7f2 50%, #eef1f7 75%);
    background-size: 300% 100%;
    animation: shimmer 1.4s ease infinite;
  }
  .skel-line {
    border-radius: 6px;
    background: linear-gradient(90deg, #eef1f7 25%, #e2e7f2 50%, #eef1f7 75%);
    background-size: 300% 100%;
    animation: shimmer 1.4s ease infinite;
    align-self: center;
  }
  @keyframes shimmer {
    0%   { background-position: 100% 50%; }
    100% { background-position:   0% 50%; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  section: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: `linear-gradient(180deg, ${skyTint} 0%, #fff 200px)`,
    padding: "56px 18px 64px",
    // ✅ FIX: prevent section itself from overflowing on narrow screens
    overflowX: "hidden",
    boxSizing: "border-box",
    width: "100%",
  },
  headerWrap: { textAlign: "center", maxWidth: 560, margin: "0 auto 36px" },
  eyebrow: {
    display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 2,
    color: "#2f5bc9", background: skyTint, padding: "5px 14px", borderRadius: 20,
    marginBottom: 12, textTransform: "uppercase",
  },
  heading: { margin: 0, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: navyDeep },
  subheading: { marginTop: 8, fontSize: 14, color: muted, lineHeight: 1.6 },
  popularTag: {
    position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
    background: navy, color: "#fff", fontSize: 10, fontWeight: 700,
    padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
  },
  pillName:  { margin: "14px 0 2px", fontSize: 13, fontWeight: 700, color: ink, width: "100%" },
  pillPrice: {
    margin: "4px 0 10px", fontSize: 22, fontWeight: 900, color: navy,
    display: "flex", alignItems: "baseline", gap: 2,
  },
  viewDetails: { fontSize: 11, fontWeight: 600, color: "#2f5bc9", opacity: 0.8 },
};

const modal = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(10,20,50,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  sheet: {
    background: "#fff",
    borderRadius: "24px 24px 0 0",
    width: "100%", maxWidth: 520,
    maxHeight: "92vh", overflowY: "auto",
    position: "relative",
    paddingBottom: "env(safe-area-inset-bottom, 16px)",
    animation: "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
  },
  closeBtn: {
    position: "absolute", top: 14, right: 14, zIndex: 10,
    background: "rgba(255,255,255,0.85)", border: "none",
    width: 34, height: 34, borderRadius: "50%",
    fontSize: 16, cursor: "pointer", color: ink,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  imageBanner: {
    width: "100%", aspectRatio: "1/1",
    position: "relative", overflow: "hidden",
    background: skyTint, borderRadius: "24px 24px 0 0",
  },
  bannerImg: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
    transition: "opacity 0.4s ease",
  },
  bannerPlaceholder: {
    width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 64,
  },
  dots: {
    position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: 6,
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    border: "none", cursor: "pointer", padding: 0,
    transition: "background 0.25s",
  },
  content: { padding: "22px 28px 32px" },
  title: { margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: ink },
  desc:  { margin: "0 0 18px", fontSize: 14, color: muted, lineHeight: 1.65 },
  priceBox: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: skyTint, borderRadius: 14, padding: "14px 20px", marginBottom: 20,
  },
  priceLabel: { fontSize: 13, fontWeight: 600, color: muted },
  priceVal: { display: "flex", alignItems: "baseline", gap: 3 },
  featHeading: {
    margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#0f2454",
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  featuresWrap: { marginBottom: 18 },
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  featureItem: { display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#374151" },
  checkCircle: {
    flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
    background: greenTint, color: green,
    fontSize: 11, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginTop: 1,
  },
  trustRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  trustPill: {
    fontSize: 11.5, fontWeight: 600, color: "#2f5bc9",
    background: skyTint, padding: "4px 12px", borderRadius: 20,
  },
  ctaRow: {
    display: "flex", gap: 12, marginTop: 4,
  },
  waBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "#25D366", color: "#fff",
    textDecoration: "none", fontWeight: 700, fontSize: 14,
    padding: "14px 0", borderRadius: 12, flex: "0 0 130px",
    boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
    transition: "opacity 0.15s",
  },
  bookBtn: {
    flex: 1, border: "none", cursor: "pointer",
    background: "#1a3c8f", color: "#fff",
    fontWeight: 800, fontSize: 16, letterSpacing: 0.3,
    padding: "14px 0", borderRadius: 12,
    boxShadow: "0 4px 16px rgba(26,60,143,0.3)",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },
};