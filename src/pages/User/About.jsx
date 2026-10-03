import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const SITE = "https://doorsstep.in"; // <- apna exact domain check kar lena
const PHONE = "+919898249789";
const PAGE_PATH = "/about";
const PAGE_TITLE = "About Doorstep Car Wash | Car Wash at Home in Ahmedabad & Gandhinagar";
const PAGE_DESC =
  "Doorstep Car Wash brings professional car, bike and cycle cleaning to your home or office in Ahmedabad and Gandhinagar. Meet our team, see our services and book online.";

const styles = `  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  .about-section { position: relative; background: #ffffff; padding: 90px 20px; overflow: hidden; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
  .about-bg-blob { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; }
  .about-bg-blob-1 { width: 500px; height: 500px; background: #e8f0fc; top: -160px; right: -160px; opacity: 0.55; }
  .about-bg-blob-2 { width: 320px; height: 320px; background: #ddeeff; bottom: -100px; left: -80px; opacity: 0.4; }
  .about-container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

  /* Header */
  .about-header { text-align: center; margin-bottom: 64px; }
  .about-eyebrow { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #2a7de1; text-transform: uppercase; margin-bottom: 12px; }
  .about-title { font-size: clamp(28px, 5vw, 44px); font-weight: 800; color: #0f1f4b; line-height: 1.15; margin: 0 0 14px; letter-spacing: -0.5px; }
  .about-title-accent { color: #2a7de1; }
  .about-subtitle { font-size: 16px; color: #5a6a8a; max-width: 560px; margin: 0 auto; line-height: 1.7; }
  .about-h2 { font-size: clamp(22px, 3.5vw, 30px); font-weight: 800; color: #0f1f4b; margin: 0 0 4px; letter-spacing: -0.3px; }
  .about-center { text-align: center; }

  /* Main layout */
  .about-body { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .about-images { position: relative; height: 480px; }

  .about-img-1-wrap { position: absolute; top: 0; left: 0; width: 68%; aspect-ratio: 4/3; border-radius: 20px; border: 5px solid #0f1f4b; overflow: hidden; box-shadow: 10px 14px 36px rgba(10,30,80,0.18); transform: rotate(-3deg); transition: transform 0.35s ease, box-shadow 0.35s ease; z-index: 2; }
  .about-img-1-wrap:hover { transform: rotate(0deg) scale(1.03); box-shadow: 14px 20px 48px rgba(10,30,80,0.24); }
  .about-img-1-wrap img, .about-img-2-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .about-img-2-wrap { position: absolute; bottom: 0; right: 0; width: 60%; aspect-ratio: 3/4; border-radius: 120px 20px 120px 20px; border: 4px solid #2a7de1; overflow: hidden; box-shadow: -8px 12px 32px rgba(42,125,225,0.22); transition: transform 0.35s ease, box-shadow 0.35s ease; z-index: 3; }
  .about-img-2-wrap:hover { transform: scale(1.04) translateY(-6px); box-shadow: -10px 18px 44px rgba(42,125,225,0.3); }

  .about-badge { position: absolute; top: 12px; right: -14px; background: #2a7de1; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 50px; box-shadow: 0 4px 14px rgba(42,125,225,0.35); z-index: 5; white-space: nowrap; }

  .about-stat-pill { position: absolute; bottom: 90px; left: -16px; background: #0f1f4b; color: #fff; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 8px 24px rgba(10,30,80,0.25); z-index: 6; min-width: 90px; }
  .about-stat-num { font-size: 26px; font-weight: 900; color: #5badff; line-height: 1; }
  .about-stat-label { font-size: 10px; font-weight: 600; color: #a8c4e8; text-align: center; margin-top: 4px; letter-spacing: 0.5px; }

  /* Text column */
  .about-content { display: flex; flex-direction: column; gap: 22px; }
  .about-story { font-size: 15.5px; color: #3a4a6a; line-height: 1.8; margin: 0; }
  .about-story strong { color: #0f1f4b; font-weight: 700; }
  .about-story a { color: #2a7de1; font-weight: 600; }

  .about-pillars { display: flex; flex-direction: column; gap: 16px; }
  .about-pillar { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border-radius: 12px; background: #f5f8ff; border-left: 4px solid #2a7de1; transition: background 0.2s ease; }
  .about-pillar:hover { background: #eaf1ff; }
  .about-pillar-icon { width: 36px; height: 36px; flex-shrink: 0; color: #2a7de1; }
  .about-pillar-icon svg { width: 100%; height: 100%; }
  .about-pillar-text h3 { font-size: 14px; font-weight: 700; color: #0f1f4b; margin: 0 0 4px; }
  .about-pillar-text p { font-size: 13px; color: #5a6a8a; margin: 0; line-height: 1.5; }

  /* Buttons */
  .about-btns { display: flex; flex-wrap: wrap; gap: 12px; }
  .about-cta { display: inline-flex; align-items: center; gap: 10px; background: #0f1f4b; color: #fff; font-size: 15px; font-weight: 700; padding: 14px 30px; border-radius: 50px; text-decoration: none; width: fit-content; transition: background 0.25s ease, transform 0.2s ease; letter-spacing: 0.3px; }
  .about-cta:hover { background: #2a7de1; transform: translateX(4px); }
  .about-cta-ghost { background: transparent; color: #0f1f4b; border: 2px solid #0f1f4b; padding: 12px 28px; }
  .about-cta-ghost:hover { color: #fff; }
  .about-cta:focus-visible, .about-service:focus-visible { outline: 3px solid #2a7de1; outline-offset: 3px; }

  /* Extra blocks */
  .about-block { margin-top: 84px; }
  .about-lead { font-size: 16px; color: #5a6a8a; line-height: 1.7; max-width: 620px; margin: 8px auto 28px; text-align: center; }
  .about-services { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .about-service { display: flex; flex-direction: column; gap: 6px; padding: 20px; border-radius: 14px; background: #f5f8ff; border: 1px solid #dfe7f6; text-decoration: none; color: #3a4a6a; font-weight: 600; font-size: 15px; transition: background 0.2s ease; }
  .about-service:hover { background: #eaf1ff; }
  .about-service b { font-size: 26px; font-weight: 800; color: #0f1f4b; }
  .about-values { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 26px; }
  .about-value { padding: 20px 22px; border-radius: 12px; background: #fff; border: 1px solid #dfe7f6; border-left: 4px solid #2a7de1; }
  .about-value h3 { margin: 0 0 6px; font-size: 16px; color: #0f1f4b; font-weight: 700; }
  .about-value p { margin: 0; font-size: 14px; color: #5a6a8a; line-height: 1.65; }
  .about-where { background: #0f1f4b; border-radius: 20px; padding: 40px 36px; display: flex; flex-direction: column; gap: 18px; }
  .about-where .about-h2, .about-where .about-story, .about-where .about-story strong { color: #fff; }
  .about-where .about-story { color: #cfdcf5; }
  .about-where .about-story a { color: #5badff; }
  .about-where .about-cta { background: #2a7de1; }
  .about-where .about-cta:hover { background: #1f6bc9; }

  /* Scroll-in animation */
  .about-fade { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .about-fade.visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .about-fade { opacity: 1; transform: none; transition: none; }
    .about-img-1-wrap, .about-img-2-wrap, .about-cta { transition: none; }
  }

  /* Tablet */
  @media (max-width: 860px) {
    .about-body { grid-template-columns: 1fr; gap: 48px; }
    .about-images { height: 380px; max-width: 480px; margin: 0 auto; width: 100%; }
    .about-services { grid-template-columns: repeat(2, 1fr); }
  }

  /* Mobile */
  @media (max-width: 560px) {
    .about-section { padding: 60px 16px 70px; }
    .about-header { margin-bottom: 44px; }
    .about-images { height: 300px; }
    .about-img-1-wrap { width: 65%; }
    .about-img-2-wrap { width: 58%; }
    .about-stat-pill { left: -8px; bottom: 70px; padding: 10px 14px; min-width: 76px; }
    .about-stat-num { font-size: 20px; }
    .about-badge { font-size: 10px; padding: 5px 10px; right: -8px; }
    .about-story { font-size: 14.5px; }
    .about-cta { width: 100%; justify-content: center; box-sizing: border-box; }
    .about-values { grid-template-columns: 1fr; }
    .about-block { margin-top: 60px; }
    .about-where { padding: 30px 20px; }
  }
`;

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 4l3.5 7 7.5 1.1-5.5 5.3 1.3 7.6L18 21.5l-6.8 3.5 1.3-7.6L7 12.1l7.5-1.1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Professional Care",
    desc: "Trained, verified experts who treat your vehicle like their own.",
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 18l4.5 4.5 7.5-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Sparkling Shine",
    desc: "Car-safe products and microfibre cloths for a clean, scratch-free finish.",
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="5" y="14" width="26" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 14v-4a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="22" r="2.5" fill="currentColor"/>
      </svg>
    ),
    title: "Total Convenience",
    desc: "We come to you: home, society parking, office or anywhere in between.",
  },
];

const services = [
  ["Two Wheeler Wash", "₹299"],
  ["Basic Car Wash", "₹399"],
  ["Standard Car Wash", "₹499"],
  ["Premium Car Wash", "₹799"],
];

const values = [
  ["Your time matters", "No driving to a service station and no waiting in queues. You pick a slot, we show up."],
  ["Clear pricing", "Package prices are shown upfront, starting at ₹299, with no surprise add-ons."],
  ["Water-efficient cleaning", "Foam and microfibre methods use far less water than a traditional hose wash."],
  ["Respect for your property", "Our team works neatly in your parking area and leaves the space clean."],
];

const buildSchema = () => [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: PAGE_TITLE,
    url: `${SITE}${PAGE_PATH}`,
    about: { "@type": "LocalBusiness", name: "Doorstep Car Wash", url: SITE },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE}${PAGE_PATH}` },
    ],
  },
];

export default function About() {
  const fadeRefs = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observers = fadeRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible((p) => [...new Set([...p, i])]), i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const fade = (i) => `about-fade${visible.includes(i) ? " visible" : ""}`;
  const setRef = (i) => (el) => (fadeRefs.current[i] = el);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE}${PAGE_PATH}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={`${SITE}${PAGE_PATH}`} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESC} />
        <script type="application/ld+json">{JSON.stringify(buildSchema())}</script>
      </Helmet>

      <style>{styles}</style>
      <section className="about-section" id="About">
        <div className="about-bg-blob about-bg-blob-1" />
        <div className="about-bg-blob about-bg-blob-2" />

        <div className="about-container">
          {/* Header */}
          <div className={`about-header ${fade(0)}`} ref={setRef(0)}>
            <span className="about-eyebrow">WHO WE ARE</span>
            <h1 className="about-title">
              About <span className="about-title-accent">Doorstep</span> Car Wash
            </h1>
            <p className="about-subtitle">
              We believe your car deserves the best, and so does your time. That's why we bring a
              professional car wash straight to your door in Ahmedabad and Gandhinagar.
            </p>
          </div>

          {/* Body */}
          <div className="about-body">
            {/* Images — replace with your own team/work photos when available */}
            <div className={`about-images ${fade(1)}`} ref={setRef(1)}>
              <div className="about-img-1-wrap">
                <img
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=700&q=80"
                  alt="Doorstep Car Wash professional washing a car at the customer's home"
                  loading="lazy"
                  width="700"
                  height="525"
                />
                <span className="about-badge">At your doorstep</span>
              </div>

              <div className="about-img-2-wrap">
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
                  alt="Clean and shining car after a doorstep car wash"
                  loading="lazy"
                  width="600"
                  height="800"
                />
              </div>

              <div className="about-stat-pill">
                <span className="about-stat-num">₹299</span>
                <span className="about-stat-label">Starting price</span>
              </div>
            </div>

            {/* Content */}
            <div className={`about-content ${fade(2)}`} ref={setRef(2)}>
              <h2 className="about-h2">Our story</h2>
              <p className="about-story">
                <strong>Doorstep Car Wash</strong> was born from a simple idea: why should you drive to
                a car wash when the car wash can come to you? We are a team of{" "}
                <strong>trained, verified professionals</strong> who deliver a sparkling clean using
                eco-friendly, water-efficient methods right at your doorstep.
              </p>
              <p className="about-story">
                Whether it's your home, society parking, office or anywhere in between, we show up on
                time with professional-grade equipment and leave your vehicle looking fresh. We clean
                cars, bikes and even bicycles, so every vehicle in your family is covered.
              </p>

              <div className="about-pillars">
                {pillars.map((p, i) => (
                  <div className="about-pillar" key={i}>
                    <div className="about-pillar-icon">{p.icon}</div>
                    <div className="about-pillar-text">
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="about-btns">
                <a className="about-cta" href="/book">Book Now →</a>
                <a className="about-cta about-cta-ghost" href="/packages">View packages</a>
              </div>
            </div>
          </div>

          {/* What we do */}
          <div className="about-block">
            <h2 className="about-h2 about-center">What we do</h2>
            <p className="about-lead">
              Doorstep car, bike and bicycle cleaning at your home, office or preferred location. Pick the
              package that suits your vehicle.
            </p>
            <div className="about-services">
              {services.map(([n, p]) => (
                <a href="/packages" className="about-service" key={n}>
                  <span>{n}</span>
                  <b>{p}</b>
                </a>
              ))}
            </div>
          </div>

          {/* What we stand for */}
          <div className="about-block">
            <h2 className="about-h2 about-center">What we stand for</h2>
            <div className="about-values">
              {values.map(([t, d]) => (
                <div className="about-value" key={t}>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where we work */}
          <div className="about-block about-where">
            <h2 className="about-h2">Where we work</h2>
            <p className="about-story">
              We provide doorstep car wash services across <strong>Ahmedabad</strong> and{" "}
              <strong>Gandhinagar</strong>. Looking for your city? See the details, areas covered and
              FAQs below.
            </p>
            <div className="about-btns">
              <a className="about-cta" href="/car-wash-in-ahmedabad">Car wash in Ahmedabad</a>
              <a className="about-cta" href="/car-wash-in-gandhinagar">Car wash in Gandhinagar</a>
            </div>
            <p className="about-story about-contact">
              Questions? Call <a href={`tel:${PHONE}`}>+91 98982 49789</a> or visit our{" "}
              <a href="/contact">contact page</a>. We are open Mon to Sun, 8:00 AM to 8:00 PM.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}