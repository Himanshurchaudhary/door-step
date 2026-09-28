import React, { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  .hiw-section {
    position: relative;
    background: #f0f4f8;
    padding: 60px 16px 70px;
    overflow: hidden;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  .hiw-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .hiw-blob-1 {
    width: 300px; height: 300px;
    background: #c7d9f8;
    top: -100px; left: -80px;
    opacity: 0.3;
  }
  .hiw-blob-2 {
    width: 220px; height: 220px;
    background: #b8d0f5;
    bottom: -80px; right: -60px;
    opacity: 0.25;
  }

  .hiw-container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ---- Header ---- */
  .hiw-header {
    text-align: center;
    margin-bottom: 44px;
  }
  .hiw-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #2a7de1;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .hiw-title {
    font-size: clamp(24px, 6vw, 44px);
    font-weight: 800;
    color: #0f1f4b;
    line-height: 1.15;
    margin: 0 0 10px;
    letter-spacing: -0.5px;
  }
  .hiw-title-accent { color: #2a7de1; }
  .hiw-subtitle {
    font-size: 14px;
    color: #5a6a8a;
    max-width: 340px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ============================
     MOBILE-FIRST: single column
     left dot + right card
  ============================== */
  .hiw-steps {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-left: 20px;
  }

  /* Vertical line */
  .hiw-steps::before {
    content: '';
    position: absolute;
    left: 38px;
    top: 26px;
    bottom: 26px;
    width: 2px;
    background: linear-gradient(to bottom, #2a7de1, #0f1f4b);
    z-index: 0;
  }

  .hiw-row {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 0 14px;
    align-items: flex-start;
    position: relative;
    z-index: 1;
    margin-bottom: 16px;
  }
  .hiw-row:last-child { margin-bottom: 0; }

  /* FIX: DOM order in JSX is card -> dot -> spacer, but on mobile we want
     dot in the 40px column and card in the 1fr column. Without an
     explicit order, grid auto-placement follows DOM order and puts the
     card into the narrow 40px column (squished) and the dot into the
     wide column - the opposite of the intended "dot left, card right"
     mobile layout. Setting order here fixes it, independent of the
     desktop media query below which overrides order again for the
     zigzag layout. */
  .hiw-dot   { order: 1; }
  .hiw-card  { order: 2; }
  .hiw-spacer { display: none; order: 3; }

  /* ---- Dot ---- */
  .hiw-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2px;
  }
  .hiw-dot-inner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #0f1f4b;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 5px #d0e2f8, 0 4px 14px rgba(10,30,80,0.2);
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .hiw-dot-num {
    font-size: 14px;
    font-weight: 900;
    color: #5badff;
    line-height: 1;
  }

  /* ---- CARD STYLE A — Navy (odd) ---- */
  .hiw-card.style-navy {
    background: #0f1f4b;
    border-radius: 14px;
    border: none;
    box-shadow: 0 6px 20px rgba(10,30,80,0.2);
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .hiw-card.style-navy::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #2a7de1, #5badff);
    border-radius: 14px 14px 0 0;
  }

  /* ---- CARD STYLE B — White dashed (even) ---- */
  .hiw-card.style-white {
    background: #ffffff;
    border-radius: 14px;
    border: 2px dashed #2a7de1;
    box-shadow: 0 4px 16px rgba(42,125,225,0.1);
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .hiw-card.style-white::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0f1f4b, #2a7de1);
    border-radius: 0 0 12px 12px;
  }

  /* ---- Card internals ---- */
  .hiw-card-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hiw-card-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  .hiw-card-icon svg { width: 100%; height: 100%; }

  .hiw-card.style-navy .hiw-card-icon { color: #5badff; }
  .hiw-card.style-white .hiw-card-icon { color: #2a7de1; }

  .hiw-card-title {
    font-size: 14px;
    font-weight: 800;
    margin: 0;
    line-height: 1.25;
  }
  .hiw-card.style-navy .hiw-card-title { color: #ffffff; }
  .hiw-card.style-white .hiw-card-title { color: #0f1f4b; }

  .hiw-card-desc {
    font-size: 12.5px;
    line-height: 1.6;
    margin: 0;
  }
  .hiw-card.style-navy .hiw-card-desc { color: #a8c4e8; }
  .hiw-card.style-white .hiw-card-desc { color: #5a6a8a; }

  .hiw-card-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 50px;
    width: fit-content;
  }
  .hiw-card.style-navy .hiw-card-tag {
    background: rgba(90,173,255,0.15);
    color: #5badff;
    border: 1px solid rgba(90,173,255,0.3);
  }
  .hiw-card.style-white .hiw-card-tag {
    background: #eaf1ff;
    color: #2a7de1;
    border: 1px solid #c0d8f8;
  }

  /* Ghost number */
  .hiw-card-ghost {
    position: absolute;
    bottom: -8px;
    right: 10px;
    font-size: 48px;
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
    user-select: none;
    letter-spacing: -3px;
  }
  .style-navy .hiw-card-ghost { color: rgba(255,255,255,0.05); }
  .style-white .hiw-card-ghost { color: rgba(15,31,75,0.05); }

  /* ---- Done banner ---- */
  .hiw-done {
    margin-top: 28px;
    background: linear-gradient(120deg, #0f1f4b 0%, #1a3a7a 100%);
    border-radius: 14px;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 8px 24px rgba(10,30,80,0.2);
  }
  .hiw-done-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hiw-done-emoji { font-size: 32px; line-height: 1; }
  .hiw-done-text h3 {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 3px;
  }
  .hiw-done-text p {
    font-size: 12.5px;
    color: #a8c4e8;
    margin: 0;
    line-height: 1.5;
  }
  .hiw-done-btn {
    display: block;
    background: #2a7de1;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    padding: 12px 20px;
    border-radius: 50px;
    text-decoration: none;
    text-align: center;
    transition: background 0.25s ease;
  }
  .hiw-done-btn:hover { background: #1a63c5; }

  /* ---- Scroll fade ---- */
  .hiw-fade {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .hiw-fade.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ============================
     DESKTOP — zigzag layout
  ============================== */
  @media (min-width: 860px) {
    .hiw-section { padding: 90px 20px; }
    .hiw-header { margin-bottom: 64px; }
    .hiw-subtitle { font-size: 16px; max-width: 500px; }

    .hiw-steps {
      padding-left: 0;
      gap: 36px;
    }
    .hiw-steps::before {
      left: 50%;
      top: 44px;
      bottom: 44px;
      transform: translateX(-50%);
    }

    .hiw-row {
      grid-template-columns: 1fr 64px 1fr;
      gap: 0;
      margin-bottom: 0;
      align-items: center;
    }

    /* odd — card left, spacer right */
    .hiw-row.odd .hiw-card   { order: 1; }
    .hiw-row.odd .hiw-dot    { order: 2; }
    .hiw-row.odd .hiw-spacer { order: 3; display: block; }

    /* even — spacer left, card right */
    .hiw-row.even .hiw-spacer { order: 1; display: block; }
    .hiw-row.even .hiw-dot    { order: 2; }
    .hiw-row.even .hiw-card   { order: 3; }

    .hiw-dot {
      padding-top: 0;
      justify-content: center;
    }
    .hiw-dot-inner {
      width: 52px;
      height: 52px;
      box-shadow: 0 0 0 6px #d0e2f8, 0 6px 20px rgba(10,30,80,0.22);
    }
    .hiw-dot-num { font-size: 16px; }

    .hiw-card.style-navy,
    .hiw-card.style-white {
      padding: 28px 26px 32px;
      border-radius: 18px;
      gap: 12px;
    }
    .hiw-card-icon { width: 42px; height: 42px; }
    .hiw-card-title { font-size: 17px; }
    .hiw-card-desc { font-size: 14px; }
    .hiw-card-tag { font-size: 11px; padding: 5px 12px; }
    .hiw-card-ghost { font-size: 64px; }

    .hiw-card.style-navy:hover,
    .hiw-card.style-white:hover {
      transform: translateY(-5px);
      box-shadow: 0 18px 40px rgba(10,30,80,0.2);
    }

    .hiw-done {
      margin-top: 52px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 28px 36px;
    }
    .hiw-done-btn {
      display: inline-block;
      width: auto;
      padding: 13px 30px;
      white-space: nowrap;
    }
    .hiw-done-emoji { font-size: 40px; }
    .hiw-done-text h3 { font-size: 20px; }
    .hiw-done-text p { font-size: 14px; }
  }
`;

const steps = [
  {
    num: "01",
    tag: "Step 1",
    title: "Choose Your Package",
    desc: "Browse Basic, Standard, or Premium wash packages. Pick what fits your car's needs — no hidden charges.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="10" width="32" height="26" rx="4" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M6 17h32" stroke="currentColor" strokeWidth="2.2"/>
        <circle cx="14" cy="28" r="2.5" fill="currentColor"/>
        <circle cx="22" cy="28" r="2.5" fill="currentColor"/>
        <circle cx="30" cy="28" r="2.5" fill="currentColor"/>
      </svg>
    ),
    style: "style-navy",
  },
  {
    num: "02",
    tag: "Step 2",
    title: "Book Your Slot",
    desc: "Select a date, time and your location. Confirm your booking in under 2 minutes.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="32" height="30" rx="4" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M6 16h32M15 8v5M29 8v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M13 24h6M13 30h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    style: "style-white",
  },
  {
    num: "03",
    tag: "Step 3",
    title: "We Arrive On Time",
    desc: "Our professional arrives at your door with all equipment and premium products — zero hassle.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="15" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M22 13v10l6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    style: "style-navy",
  },
  {
    num: "04",
    tag: "Step 4",
    title: "The Wash Begins",
    desc: "Eco-friendly, water-efficient cleaning — interior, exterior, and tyres — all handled with care.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="30" rx="14" ry="5" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M10 28c0-6 5-14 12-18 7 4 12 12 12 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M16 18c1 2 2 4 2 7M22 14v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    style: "style-white",
  },
  {
    num: "05",
    tag: "Step 5",
    title: "Inspection & Handover",
    desc: "Final quality check together. Not satisfied? We fix it on the spot — guaranteed.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="15" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M14 22l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    style: "style-navy",
  },
  {
    num: "06",
    tag: "Step 6",
    title: "Pay & Rate Us",
    desc: "Pay via cash or UPI after the service. Share your feedback to help us serve you better.",
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="12" width="32" height="22" rx="4" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M6 19h32" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M12 27h8M30 27h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    style: "style-white",
  },
];

export default function HowItWorks() {
  const fadeRefs = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observers = fadeRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible((p) => [...new Set([...p, i])]), i * 80);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const fade = (i) => `hiw-fade${visible.includes(i) ? " visible" : ""}`;

  return (
    <>
      <style>{styles}</style>
      <section className="hiw-section" id="how-it-works">
        <div className="hiw-blob hiw-blob-1" />
        <div className="hiw-blob hiw-blob-2" />

        <div className="hiw-container">
          <div
            className={`hiw-header ${fade(0)}`}
            ref={(el) => (fadeRefs.current[0] = el)}
          >
            <span className="hiw-eyebrow">THE PROCESS</span>
            <h2 className="hiw-title">
              How It <span className="hiw-title-accent">Works</span>
            </h2>
            <p className="hiw-subtitle">
              From booking to a sparkling clean car — step by step.
            </p>
          </div>

          <div className="hiw-steps">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`hiw-row ${i % 2 === 0 ? "odd" : "even"} ${fade(i + 1)}`}
                ref={(el) => (fadeRefs.current[i + 1] = el)}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className={`hiw-card ${step.style}`}>
                  <div className="hiw-card-top">
                    <div className="hiw-card-icon">{step.icon}</div>
                    <h3 className="hiw-card-title">{step.title}</h3>
                  </div>
                  <p className="hiw-card-desc">{step.desc}</p>
                  <span className="hiw-card-tag">{step.tag}</span>
                  <span className="hiw-card-ghost">{step.num}</span>
                </div>

                <div className="hiw-dot">
                  <div className="hiw-dot-inner">
                    <span className="hiw-dot-num">{i + 1}</span>
                  </div>
                </div>

                <div className="hiw-spacer" />
              </div>
            ))}
          </div>

          <div
            className={`hiw-done ${fade(steps.length + 1)}`}
            ref={(el) => (fadeRefs.current[steps.length + 1] = el)}
          >
            <div className="hiw-done-left">
              <span className="hiw-done-emoji">🚗✨</span>
              <div className="hiw-done-text">
                <h3>Your Car is Ready!</h3>
                <p>Spotless, shining, handed back — right where you are.</p>
              </div>
            </div>
            <a href="/packages" className="hiw-done-btn">Book Now →</a>
          </div>
        </div>
      </section>
    </>
  );
}