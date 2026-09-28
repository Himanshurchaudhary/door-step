
import React, { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  .wcu-section {
    position: relative;
    background: #f0f4f8;
    padding: 80px 20px 90px;
    overflow: hidden;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  .wcu-bubble {
    position: absolute;
    border-radius: 50%;
    opacity: 0.06;
    pointer-events: none;
  }
  .wcu-bubble-1 {
    width: 420px; height: 420px;
    background: #1a2d5a;
    top: -120px; left: -100px;
  }
  .wcu-bubble-2 {
    width: 300px; height: 300px;
    background: #1a2d5a;
    bottom: -80px; right: -80px;
  }

  .wcu-container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .wcu-header {
    text-align: center;
    margin-bottom: 52px;
  }

  .wcu-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #2a7de1;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .wcu-title {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 800;
    color: #0f1f4b;
    line-height: 1.15;
    margin: 0 0 14px;
    letter-spacing: -0.5px;
  }

  .wcu-title-accent { color: #2a7de1; }

  .wcu-subtitle {
    font-size: 16px;
    color: #5a6a8a;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .wcu-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .wcu-card {
    position: relative;
    border-radius: 16px;
    padding: 32px 28px 36px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    overflow: hidden;
    cursor: default;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease;
  }

  .wcu-card-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .wcu-card:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 20px 40px rgba(10, 30, 80, 0.18) !important;
  }

  .card-blue {
    background: #0f1f4b;
    color: #ffffff;
    box-shadow: 0 8px 28px rgba(10, 30, 80, 0.22);
  }

  .card-white {
    background: #ffffff;
    color: #0f1f4b;
    box-shadow: 0 8px 28px rgba(10, 30, 80, 0.09);
    border: 1px solid #dde6f4;
  }

  .wcu-card-icon {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }

  .card-blue .wcu-card-icon { color: #5badff; }
  .card-white .wcu-card-icon { color: #2a7de1; }

  .wcu-card-icon svg { width: 100%; height: 100%; }

  .wcu-card-title {
    font-size: 17px;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.3;
  }

  .card-blue .wcu-card-title { color: #ffffff; }
  .card-white .wcu-card-title { color: #0f1f4b; }

  .wcu-card-desc {
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
  }

  .card-blue .wcu-card-desc { color: #a8c4e8; }
  .card-white .wcu-card-desc { color: #5a6a8a; }

  .wcu-card-number {
    position: absolute;
    bottom: 16px;
    right: 20px;
    font-size: 52px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -2px;
    pointer-events: none;
    user-select: none;
  }

  .card-blue .wcu-card-number { color: rgba(255,255,255,0.06); }
  .card-white .wcu-card-number { color: rgba(15,31,75,0.06); }

  .wcu-cta-strip {
    margin-top: 52px;
    background: #0f1f4b;
    border-radius: 14px;
    padding: 28px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .wcu-cta-text {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.3;
  }

  .wcu-cta-btn {
    display: inline-block;
    background: #2a7de1;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    padding: 13px 30px;
    border-radius: 50px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.25s ease, transform 0.2s ease;
    letter-spacing: 0.3px;
  }

  .wcu-cta-btn:hover {
    background: #1a63c5;
    transform: translateX(3px);
  }

  @media (max-width: 900px) {
    .wcu-grid { grid-template-columns: repeat(2, 1fr); }
    .wcu-section { padding: 64px 18px 72px; }
  }

  @media (max-width: 560px) {
    .wcu-section { padding: 52px 16px 60px; }
    .wcu-header { margin-bottom: 36px; }
    .wcu-subtitle { font-size: 15px; }
    .wcu-grid { grid-template-columns: 1fr; gap: 16px; }
    .wcu-card { padding: 26px 22px 30px; gap: 14px; }
    .wcu-card-icon { width: 44px; height: 44px; }
    .wcu-card-title { font-size: 16px; }
    .wcu-card-number { font-size: 42px; bottom: 12px; right: 16px; }
    .wcu-cta-strip { flex-direction: column; align-items: flex-start; padding: 24px 22px; gap: 16px; }
    .wcu-cta-text { font-size: 16px; }
    .wcu-cta-btn { width: 100%; text-align: center; padding: 14px 20px; box-sizing: border-box; }
    .wcu-bubble-1 { width: 260px; height: 260px; }
    .wcu-bubble-2 { width: 180px; height: 180px; }
  }
`;

const reasons = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
        <path d="M14 24l7 7 13-13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Premium Quality Products",
    desc: "We use only professional-grade, car-safe cleaning solutions that protect your paint and finish every wash.",
    style: "card-blue",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6l4.5 9 10 1.5-7.25 7 1.75 10L24 29l-9 4.5 1.75-10L9.5 16.5l10-1.5z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Trained & Verified Professionals",
    desc: "Every technician is background-verified and trained to handle all car types with the utmost care.",
    style: "card-white",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="32" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 20v-5a8 8 0 0116 0v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="29" r="3" fill="currentColor" />
      </svg>
    ),
    title: "Doorstep Convenience",
    desc: "We come to your home, office, or anywhere you need — no queues, no driving, no waiting.",
    style: "card-blue",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 34c0-8 4-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 20V10M19 14l5-5 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="24" cy="35" rx="6" ry="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Water Efficient Cleaning",
    desc: "Our eco-friendly methods use 80% less water than traditional car washes — better for your car and the planet.",
    style: "card-white",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8C15.2 8 8 15.2 8 24s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Satisfaction Guaranteed",
    desc: "Not happy with the result? We'll re-wash for free. Your satisfaction is our promise, no questions asked.",
    style: "card-blue",
  },
];

export default function WhyChooseUs() {
  const [visible, setVisible] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, i])]);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, []);

  return (
    <>
      <style>{styles}</style>
      <section className="wcu-section">
        <div className="wcu-bubble wcu-bubble-1" />
        <div className="wcu-bubble wcu-bubble-2" />

        <div className="wcu-container">
          <div className="wcu-header">
            <span className="wcu-eyebrow">WHY CHOOSE US</span>
            <h2 className="wcu-title">
              The <span className="wcu-title-accent">Doorstep</span> Difference
            </h2>
            <p className="wcu-subtitle">
              More than a car wash — a premium experience delivered to you.
            </p>
          </div>

          <div className="wcu-grid">
            {reasons.map((item, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`wcu-card ${item.style} ${visible.includes(i) ? "wcu-card-visible" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="wcu-card-icon">{item.icon}</div>
                <div className="wcu-card-body">
                  <h3 className="wcu-card-title">{item.title}</h3>
                  <p className="wcu-card-desc">{item.desc}</p>
                </div>
                <div className="wcu-card-number">0{i + 1}</div>
              </div>
            ))}
          </div>

          
        </div>
      </section>
    </>
  );
}