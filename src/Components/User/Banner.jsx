import React, { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

const WhatsAppIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const WORDS = [
  { text: "Foam Wash",      color: "#F5C518" },
  { text: "Interior Clean", color: "#F5C518" },
  { text: "Full Detailing", color: "#F5C518" },
];

const DISPLAY_DURATION   = 2200;
const ANIM_DURATION      = 400;
const BANNER_SLIDE_MS    = 5000;  // har banner kitni der dikhega
const BANNER_FADE_MS     = 500;   // banner switch fade duration

// ── Skeleton loader ───────────────────────────────────────────────────────────
const BannerSkeleton = () => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <div style={{
      width: "100%",
      height: "clamp(260px, 52vw, 520px)",
      background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      borderRadius: 4,
    }} />
  </>
);

export default function GaadiGlowBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animState, setAnimState]       = useState("visible");

  const [banners, setBanners]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [bannerFade, setBannerFade]            = useState(true);

  // ── Fetch all banners ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/banners/position/home_top`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBanners(data.data);
        }
      } catch (err) {
        console.error("Banner fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ── Auto-cycle through banners ──────────────────────────────────────────────
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setBannerFade(false); // fade out
      setTimeout(() => {
        setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
        setBannerFade(true); // fade in
      }, BANNER_FADE_MS);
    }, BANNER_SLIDE_MS);
    return () => clearInterval(timer);
  }, [banners]);

  const goToBanner = useCallback((idx) => {
    setBannerFade(false);
    setTimeout(() => {
      setCurrentBannerIdx(idx);
      setBannerFade(true);
    }, BANNER_FADE_MS);
  }, []);

  // ── Word cycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState("exit");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % WORDS.length);
        setAnimState("enter");
        setTimeout(() => setAnimState("visible"), ANIM_DURATION);
      }, ANIM_DURATION);
    }, DISPLAY_DURATION + ANIM_DURATION * 2);
    return () => clearInterval(timer);
  }, []);

  const getTransform = () => {
    if (animState === "exit")  return "translateY(-100%)";
    if (animState === "enter") return "translateY(100%)";
    return "translateY(0%)";
  };
  const getOpacity = () => (animState === "visible" ? 1 : 0);

  if (loading) return <BannerSkeleton />;

  const banner  = banners[currentBannerIdx] || null;
  const bgImage = banner?.image ? `${API_BASE}${banner.image}` : "/gaadiglow-banner.png";
  const ctaHref = banner?.link  || "https://wa.me/919999999999";

  return (
    <>
      <style>{`
        .gg-banner-root {
          position: relative;
          width: 100%;
          height: clamp(260px, 52vw, 520px);
          overflow: hidden;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
        }

        .gg-bg-image {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          z-index: 0;
          transition: opacity ${BANNER_FADE_MS}ms ease;
        }

        .gg-banner-content {
          position: relative;
          z-index: 2;
          padding: 32px 40px;
          max-width: 520px;
          width: 100%;
          transition: opacity ${BANNER_FADE_MS}ms ease;
        }

        .gg-heading-main {
          font-size: clamp(1.4rem, 5vw, 3rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: block;
          line-height: 1.1;
        }

        .gg-heading-blue {
          font-size: clamp(1.4rem, 5vw, 3rem);
          font-weight: 800;
          color: #3BB4F2;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: block;
          line-height: 1.1;
        }

        .gg-premium {
          font-size: clamp(0.85rem, 2.5vw, 1.4rem);
          font-weight: 600;
          color: #3BB4F2;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
          display: block;
        }

        .gg-word-wrap {
          overflow: hidden;
          height: clamp(1.8rem, 5vw, 3.6rem);
          display: flex;
          align-items: center;
        }

        .gg-word {
          font-size: clamp(1.1rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.3px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
          white-space: nowrap;
          will-change: transform, opacity;
        }

        .gg-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          background-color: #25D366;
          color: #ffffff;
          font-weight: 700;
          font-size: clamp(0.8rem, 2vw, 1rem);
          padding: clamp(10px, 2vw, 14px) clamp(16px, 3vw, 26px);
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(37,211,102,0.45);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
        }
        .gg-cta:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 20px rgba(37,211,102,0.55);
        }

        .gg-float-wa {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 3;
          background-color: #25D366;
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37,211,102,0.5);
          text-decoration: none;
          transition: transform 0.15s ease;
        }
        .gg-float-wa:hover { transform: scale(1.1); }

        .gg-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 8px;
        }

        .gg-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.45);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .gg-dot.active {
          background-color: #ffffff;
          transform: scale(1.25);
        }

        /* ── Mobile (<= 480px) ── */
        @media (max-width: 480px) {
          .gg-banner-root {
            align-items: flex-end;
          }
          .gg-banner-root img.gg-bg-image {
            width: 100vw !important;
            min-width: 100%;
            left: 0 !important;
            object-fit: cover;
            /* shift focus right so basket/phone content isn't cut off
               (left side is already covered by the text gradient) */
            object-position: 75% center;
          }
          .gg-banner-content {
            padding: 20px 16px 28px;
            max-width: 100%;
            width: 100%;
            box-sizing: border-box;
            background: linear-gradient(
              to top,
              rgba(0,0,0,0.78) 0%,
              rgba(0,0,0,0.4)  60%,
              rgba(0,0,0,0.0)  100%
            );
          }
          .gg-heading-main,
          .gg-heading-blue {
            white-space: normal;
            word-break: break-word;
          }
          .gg-word {
            white-space: normal;
            word-break: break-word;
          }
          .gg-cta {
            white-space: normal;
            word-break: break-word;
          }
          .gg-float-wa {
            width: 38px;
            height: 38px;
            bottom: 12px;
            right: 12px;
          }
          .gg-dots {
            bottom: 8px;
          }
        }

        /* ── Tablet (481px – 768px) ── */
        @media (min-width: 481px) and (max-width: 768px) {
          .gg-banner-content {
            padding: 28px 32px;
            max-width: 420px;
          }
        }
      `}</style>

      <div className="gg-banner-root">

        {/* Background image */}
        <img
          className="gg-bg-image"
          src={bgImage}
          alt={banner?.subtitle || "GaadiGlow Doorstep Car Wash Service"}
          style={{ opacity: bannerFade ? 1 : 0 }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.0) 100%)",
          zIndex: 1,
        }} />

        {/* Text content */}
        <div className="gg-banner-content" style={{ opacity: bannerFade ? 1 : 0 }}>
          <h1 style={{ margin: 0, lineHeight: 1.1 }}>
            <span className="gg-heading-main">
              {banner?.title || "Doorstep Car Wash"}
            </span>
            <span className="gg-heading-blue">Service</span>
          </h1>

          <div style={{ marginTop: "12px" }}>
            <span className="gg-premium">
              {banner?.subtitle || "Premium"}
            </span>

            {/* Animated sliding word */}
            <div className="gg-word-wrap">
              <span
                className="gg-word"
                style={{
                  color: WORDS[currentIndex].color,
                  transform: getTransform(),
                  opacity: getOpacity(),
                  transition: `transform ${ANIM_DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity ${ANIM_DURATION}ms ease`,
                }}
              >
                {WORDS[currentIndex].text}
              </span>
            </div>
          </div>

          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="gg-cta">
            <WhatsAppIcon size={18} />
            Book via WhatsApp
          </a>
        </div>

        {/* Dot indicators — only show when more than one banner */}
        {banners.length > 1 && (
          <div className="gg-dots">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`gg-dot${idx === currentBannerIdx ? " active" : ""}`}
                onClick={() => goToBanner(idx)}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Floating WhatsApp button */}
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="gg-float-wa"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon size={18} />
        </a>
      </div>
    </>
  );
}