"use client";

import React, { memo, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconBestPrices = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <rect x="12" y="6" width="28" height="36" rx="5" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <path d="M20 22 L32 10" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="33" cy="10" r="4" fill="#2DC8A8"/>
    <circle cx="19" cy="24" r="4" fill="white" stroke="#2DC8A8" strokeWidth="2"/>
    <line x1="22" y1="32" x2="30" y2="32" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="36" x2="28" y2="36" stroke="#b2e8de" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconInstantPayment = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <path d="M10 30 Q18 22 26 28 Q34 34 42 22" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M8 36 Q20 44 34 40 Q44 37 46 30" stroke="#b2e8de" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="26" cy="18" r="9" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <text x="26" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2DC8A8" fontFamily="system-ui">₹</text>
    <path d="M10 40 Q26 48 42 40" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSimple = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    {/* Hand with check gesture */}
    <path d="M18 34 L14 24 Q13 20 17 19 Q20 18 21 22 L22 26" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M22 26 L20 18 Q19 14 23 13 Q27 12 28 16 L29 24" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M29 24 L28 17 Q27 13 31 12 Q35 11 36 16 L37 24" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M37 24 L37 20 Q37 16 41 16 Q44 16 44 20 L44 32 Q44 42 34 44 Q24 44 20 38 L18 34" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#eaf9f5"/>
    {/* Sparkle */}
    <line x1="8"  y1="12" x2="8"  y2="18" stroke="#2DC8A8" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="5"  y1="15" x2="11" y2="15" stroke="#2DC8A8" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="42" y1="6"  x2="42" y2="10" stroke="#b2e8de" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="40" y1="8"  x2="44" y2="8"  stroke="#b2e8de" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconPickup = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    {/* Two people with arrows */}
    {/* Person 1 */}
    <circle cx="14" cy="12" r="5" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <path d="M8 28 Q8 20 14 20 Q20 20 20 28" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Person 2 */}
    <circle cx="38" cy="12" r="5" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <path d="M32 28 Q32 20 38 20 Q44 20 44 28" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Exchange arrows */}
    <path d="M22 22 L30 18" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arr)"/>
    <path d="M30 26 L22 30" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="30,15 34,19 30,21" fill="#2DC8A8"/>
    <polygon points="22,29 18,25 22,23" fill="#2DC8A8"/>
    {/* Box */}
    <rect x="18" y="34" width="16" height="12" rx="3" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <line x1="26" y1="34" x2="26" y2="46" stroke="#2DC8A8" strokeWidth="1.5"/>
    <line x1="20" y1="39" x2="32" y2="39" stroke="#2DC8A8" strokeWidth="1.5"/>
  </svg>
);

const IconDataWipe = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    {/* Phone */}
    <rect x="15" y="6" width="22" height="38" rx="5" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <rect x="19" y="6" width="14" height="4" rx="2" fill="#b2e8de"/>
    {/* Shield */}
    <path d="M26 14 L36 18 L36 28 Q36 36 26 40 Q16 36 16 28 L16 18 Z" fill="#2DC8A8" fillOpacity="0.15" stroke="#2DC8A8" strokeWidth="2" strokeLinejoin="round"/>
    {/* Check inside shield */}
    <path d="M21 27 L24 30 L31 23" stroke="#2DC8A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconInvoice = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    {/* Document */}
    <rect x="10" y="6" width="28" height="38" rx="5" fill="#eaf9f5" stroke="#2DC8A8" strokeWidth="2"/>
    <path d="M10 14 L38 14" stroke="#2DC8A8" strokeWidth="1.5"/>
    {/* Lines */}
    <line x1="16" y1="22" x2="32" y2="22" stroke="#2DC8A8" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="28" x2="28" y2="28" stroke="#b2e8de" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="33" x2="26" y2="33" stroke="#b2e8de" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Rupee stamp */}
    <circle cx="36" cy="38" r="9" fill="#2DC8A8"/>
    <text x="36" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="system-ui">₹</text>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    id: "best-prices",
    title: "Best Prices",
    description: "Objective AI-based pricing",
    icon: <IconBestPrices />,
  },
  {
    id: "instant-payment",
    title: "Instant Payment",
    description: "Instant Money Transfer in your preferred mode at time of pick up or store drop off",
    icon: <IconInstantPayment />,
  },
  {
    id: "simple-convenient",
    title: "Simple & Convenient",
    description: "Check price, schedule pickup & get paid",
    icon: <IconSimple />,
  },
  {
    id: "free-pickup",
    title: "Free Doorstep Pickup",
    description: "No fees for pickup across 1500 cities across India",
    icon: <IconPickup />,
  },
  {
    id: "data-wipe",
    title: "Factory Grade Data Wipe",
    description: "100% Safe and Data Security Guaranteed",
    icon: <IconDataWipe />,
  },
  {
    id: "invoice",
    title: "Valid Purchase Invoice",
    description: "Genuine Bill of Sale",
    icon: <IconInvoice />,
  },
];

// ─── Feature Card ─────────────────────────────────────────────────────────────

const FeatureCard = memo(({ feature, index, visible }: {
  feature: Feature;
  index: number;
  visible: boolean;
}) => (
  <div
    className="wu-card"
    role="listitem"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
    }}
  >
    <div className="wu-card__icon">{feature.icon}</div>
    <div className="wu-card__body">
      <h3 className="wu-card__title">{feature.title}</h3>
      <p className="wu-card__desc">{feature.description}</p>
    </div>
  </div>
));
FeatureCard.displayName = "FeatureCard";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .wu-section {
          --teal:      #2DC8A8;
          --teal-lt:   #3ddbb9;
          --teal-dk:   #1da88c;
          --teal-soft: rgba(45,200,168,0.10);
          --teal-ring: rgba(45,200,168,0.20);
          --ink:       #0c1015;
          --muted:     #5a6878;
          --border:    #ddeee8;
          --bg:        #edf7f4;
          --surface:   #ffffff;
          --font-h:    'Syne', system-ui, sans-serif;
          --font-b:    'DM Sans', system-ui, sans-serif;

          font-family: var(--font-b);
          background: var(--bg);
          padding: 4rem 3.5rem;
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        /* Soft mesh blobs */
        .wu-section::before,
        .wu-section::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .wu-section::before {
          width: 420px; height: 420px;
          top: -120px; right: -100px;
          background: radial-gradient(circle, rgba(45,200,168,0.09) 0%, transparent 70%);
        }

        .wu-section::after {
          width: 300px; height: 300px;
          bottom: -80px; left: -60px;
          background: radial-gradient(circle, rgba(45,200,168,0.07) 0%, transparent 70%);
        }

        /* ── Header ── */
        .wu-header {
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .wu-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal-dk);
          background: rgba(45,200,168,0.12);
          border: 1px solid var(--teal-ring);
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
          margin-bottom: 0.65rem;
        }

        .wu-eyebrow__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal);
          animation: blink 2.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.6); }
        }

        .wu-h2 {
          font-family: var(--font-h);
          font-size: clamp(1.65rem, 2.5vw, 2.2rem);
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 0.4rem;
        }

        .wu-h2 span { color: var(--teal); }

        .wu-sub {
          font-size: 0.88rem;
          color: var(--muted);
          margin: 0;
          font-weight: 400;
          max-width: 360px;
        }

        /* ── Grid ── */
        .wu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        /* ── Card ── */
        .wu-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: var(--surface);
          border: 1.5px solid rgba(255,255,255,0.9);
          border-radius: 18px;
          padding: 1.5rem 1.4rem;
          cursor: default;
          transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        .wu-card:hover {
          border-color: var(--teal-ring);
          box-shadow:
            0 10px 32px rgba(45,200,168,0.12),
            0 2px 8px rgba(0,0,0,0.05);
          transform: translateY(-4px);
        }

        /* Icon wrapper */
        .wu-card__icon {
          flex-shrink: 0;
          width: 56px; height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--teal-soft);
          border-radius: 14px;
          transition: background 0.2s, transform 0.2s;
        }

        .wu-card:hover .wu-card__icon {
          background: rgba(45,200,168,0.16);
          transform: scale(1.07);
        }

        /* Text block */
        .wu-card__body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding-top: 0.1rem;
        }

        .wu-card__title {
          font-family: var(--font-h);
          font-size: 0.97rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.3;
        }

        .wu-card__desc {
          font-size: 0.82rem;
          line-height: 1.65;
          color: var(--muted);
          margin: 0;
          font-weight: 400;
        }

        /* ── Bottom strip ── */
        .wu-strip {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .wu-strip__trust {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .wu-trust-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
        }

        .wu-trust-item__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--teal);
          flex-shrink: 0;
        }

        .wu-strip__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--teal);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: var(--font-b);
          font-size: 0.86rem;
          font-weight: 700;
          padding: 0.68rem 1.35rem;
          border-radius: 100px;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(45,200,168,0.28);
        }

        .wu-strip__cta:hover {
          background: var(--teal-dk);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(45,200,168,0.38);
        }

        .wu-strip__cta:active { transform: translateY(0); }
        .wu-strip__cta:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .wu-section { padding: 3rem 1.5rem; }
          .wu-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 560px) {
          .wu-grid { grid-template-columns: 1fr; }
          .wu-strip { flex-direction: column; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wu-card { transition: none !important; }
          .wu-card__icon { transition: none !important; }
          .wu-eyebrow__dot { animation: none; }
        }
      `}</style>

      <section
        className="wu-section"
        ref={sectionRef}
        aria-labelledby="wu-heading"
      >
        {/* ── Header ── */}
        <header className="wu-header">
          <span className="wu-eyebrow">
            <span className="wu-eyebrow__dot" aria-hidden="true" />
            Trusted by millions
          </span>
          <h2 className="wu-h2" id="wu-heading">
            Why <span>Us</span>
          </h2>
          <p className="wu-sub">
            Everything you need to sell your device — safely and instantly.
          </p>
        </header>

        {/* ── Feature grid ── */}
        <div className="wu-grid" role="list" aria-label="Why choose us">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="wu-strip">
          <div className="wu-strip__trust" aria-label="Trust signals">
            {["1500+ cities", "10L+ happy sellers", "Secure & certified"].map((t) => (
              <span key={t} className="wu-trust-item">
                <span className="wu-trust-item__dot" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="wu-strip__cta"
            onClick={() => console.log("Get Started")}
            aria-label="Get started selling your phone"
          >
            Get Started
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}