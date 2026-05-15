"use client";

import React, { memo, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ─── SVG Icons (inline, zero dependency, matches screenshot style) ─────────────

const PriceIcon = () => (
  <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Phone body */}
    <rect x="10" y="8" width="46" height="78" rx="7" stroke="#1a1a1a" strokeWidth="2.8" fill="white"/>
    <rect x="10" y="8" width="46" height="78" rx="7" fill="#f8fffe"/>
    <rect x="22" y="8" width="22" height="5" rx="2.5" fill="#ddd"/>
    {/* Rupee symbol */}
    <text x="33" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="#2DC8A8" fontFamily="system-ui">₹</text>
    {/* Price tag */}
    <rect x="42" y="55" width="34" height="26" rx="5" fill="white" stroke="#2DC8A8" strokeWidth="2.2"/>
    <circle cx="49" cy="62" r="2.5" fill="#2DC8A8"/>
    <line x1="51" y1="62" x2="70" y2="62" stroke="#2DC8A8" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="51" y1="68" x2="65" y2="68" stroke="#ddd" strokeWidth="1.6" strokeLinecap="round"/>
    {/* Tag string */}
    <line x1="49" y1="55" x2="49" y2="48" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PickupIcon = () => (
  <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Scooter body */}
    <ellipse cx="28" cy="72" rx="13" ry="13" stroke="#1a1a1a" strokeWidth="2.6" fill="white"/>
    <ellipse cx="28" cy="72" rx="6" ry="6" fill="#2DC8A8" fillOpacity="0.2" stroke="#2DC8A8" strokeWidth="1.5"/>
    <ellipse cx="78" cy="72" rx="13" ry="13" stroke="#1a1a1a" strokeWidth="2.6" fill="white"/>
    <ellipse cx="78" cy="72" rx="6" ry="6" fill="#2DC8A8" fillOpacity="0.2" stroke="#2DC8A8" strokeWidth="1.5"/>
    {/* Body */}
    <path d="M41 59 Q50 42 65 42 L75 42 L78 59 Z" fill="#f8fffe" stroke="#1a1a1a" strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="M28 59 L41 59 L48 48" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M65 42 L70 32 L78 32" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round"/>
    {/* Rider */}
    <circle cx="68" cy="22" r="9" fill="#f8fffe" stroke="#1a1a1a" strokeWidth="2.2"/>
    <path d="M59 35 Q62 28 68 28 Q74 28 77 35 L75 42 L61 42 Z" fill="#f8fffe" stroke="#1a1a1a" strokeWidth="2.2"/>
    {/* Clock */}
    <circle cx="82" cy="38" r="14" fill="#2DC8A8"/>
    <circle cx="82" cy="38" r="11" fill="white" stroke="#2DC8A8" strokeWidth="1.5"/>
    <line x1="82" y1="32" x2="82" y2="38" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="82" y1="38" x2="87" y2="42" stroke="#2DC8A8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="82" cy="38" r="2" fill="#1a1a1a"/>
  </svg>
);

const CashIcon = () => (
  <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Stack of notes */}
    <rect x="8"  y="30" width="84" height="40" rx="6" fill="#e8f5e9" stroke="#ccc" strokeWidth="1.8"/>
    <rect x="5"  y="24" width="84" height="40" rx="6" fill="#f0faf8" stroke="#bbb" strokeWidth="1.8"/>
    <rect x="8"  y="18" width="84" height="40" rx="6" fill="white"   stroke="#1a1a1a" strokeWidth="2.4"/>
    {/* Rupee circle */}
    <circle cx="50" cy="38" r="14" fill="#f0faf8" stroke="#2DC8A8" strokeWidth="2.2"/>
    <text x="50" y="44" textAnchor="middle" fontSize="16" fontWeight="700" fill="#2DC8A8" fontFamily="system-ui">₹</text>
    {/* Decorative lines */}
    <line x1="16" y1="26" x2="24" y2="26" stroke="#2DC8A8" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="76" y1="26" x2="84" y2="26" stroke="#2DC8A8" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="16" y1="50" x2="24" y2="50" stroke="#ddd" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="76" y1="50" x2="84" y2="50" stroke="#ddd" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

// ─── Steps Data ───────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    step: 1,
    title: "Check Price",
    description:
      "Select your device & tell us about its current condition, and our advanced AI tech will tailor make the perfect price for you.",
    icon: <PriceIcon />,
  },
  {
    step: 2,
    title: "Schedule Pickup",
    description:
      "Book a free pickup from your home or work at a time slot that best suits your convenience.",
    icon: <PickupIcon />,
  },
  {
    step: 3,
    title: "Get Paid",
    description:
      "Did we mention you get paid as soon as our executive picks up your device? It's instant payment all the way!",
    icon: <CashIcon />,
  },
];

// ─── Step Card ────────────────────────────────────────────────────────────────

const StepCard = memo(({ step, index, visible }: { step: Step; index: number; visible: boolean }) => (
  <div
    className="hw-card"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.55s ease ${index * 0.15}s, transform 0.55s ease ${index * 0.15}s`,
    }}
    aria-label={`Step ${step.step}: ${step.title}`}
  >
    {/* Connector dot (middle cards only, decorative) */}
    {index < STEPS.length - 1 && (
      <span className="hw-connector" aria-hidden="true" />
    )}

    {/* Icon area */}
    <div className="hw-icon-wrap">
      <div className="hw-icon-bg" aria-hidden="true" />
      {step.icon}
    </div>

    {/* Step number + title */}
    <div className="hw-step-head">
      <span className="hw-badge" aria-hidden="true">{step.step}</span>
      <h3 className="hw-title">{step.title}</h3>
    </div>

    {/* Description */}
    <p className="hw-desc">{step.description}</p>
  </div>
));
StepCard.displayName = "StepCard";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HowCashifyWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Trigger entrance animation when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .hw-section {
          --teal:      #2DC8A8;
          --teal-lt:   #3ddbb9;
          --teal-dk:   #1da88c;
          --teal-soft: rgba(45,200,168,0.10);
          --teal-ring: rgba(45,200,168,0.20);
          --ink:       #0c1015;
          --muted:     #5a6878;
          --border:    #e8eef2;
          --bg:        #ffffff;
          --font-h:    'Syne', system-ui, sans-serif;
          --font-b:    'DM Sans', system-ui, sans-serif;

          font-family: var(--font-b);
          background: var(--bg);
          padding: 4rem 3.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background accent */
        .hw-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,200,168,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Heading area ── */
        .hw-head {
          margin-bottom: 3.5rem;
          display: flex;
          align-items: flex-end;
          gap: 1rem;
        }

        .hw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal-dk);
          background: var(--teal-soft);
          border: 1px solid var(--teal-ring);
          padding: 0.32rem 0.8rem;
          border-radius: 100px;
          margin-bottom: 0.6rem;
        }

        .hw-heading-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .hw-h2 {
          font-family: var(--font-h);
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0;
        }

        .hw-h2 span {
          color: var(--teal);
        }

        .hw-sub {
          font-size: 0.9rem;
          color: var(--muted);
          font-weight: 400;
          margin: 0;
          max-width: 380px;
        }

        /* ── Grid ── */
        .hw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          position: relative;
        }

        /* Horizontal dashed connector line behind cards */
        .hw-grid::before {
          content: '';
          position: absolute;
          top: 88px;
          left: calc(16.66% + 1rem);
          right: calc(16.66% + 1rem);
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            var(--teal) 0px, var(--teal) 8px,
            transparent 8px, transparent 16px
          );
          z-index: 0;
          opacity: 0.35;
        }

        /* ── Card ── */
        .hw-card {
          position: relative;
          z-index: 1;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 2rem 1.75rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
          cursor: default;
        }

        .hw-card:hover {
          border-color: var(--teal-ring);
          box-shadow:
            0 12px 40px rgba(45,200,168,0.10),
            0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-5px);
        }

        /* ── Icon area ── */
        .hw-icon-wrap {
          position: relative;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hw-icon-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 55%, var(--teal-soft) 0%, transparent 70%);
          border-radius: 50%;
          transition: opacity 0.25s;
        }

        .hw-card:hover .hw-icon-bg { opacity: 1.4; }

        /* ── Step number + title ── */
        .hw-step-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hw-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--teal);
          color: #fff;
          font-family: var(--font-h);
          font-size: 0.88rem;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(45,200,168,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hw-card:hover .hw-badge {
          transform: scale(1.12);
          box-shadow: 0 6px 18px rgba(45,200,168,0.45);
        }

        .hw-title {
          font-family: var(--font-h);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          margin: 0;
        }

        /* ── Description ── */
        .hw-desc {
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--muted);
          margin: 0;
          font-weight: 400;
        }

        /* ── Connector dots between cards ── */
        .hw-connector {
          display: none; /* handled by ::before on grid */
        }

        /* ── Bottom strip ── */
        .hw-strip {
          margin-top: 3rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .hw-strip__text {
          font-size: 0.88rem;
          color: var(--muted);
          font-weight: 500;
        }

        .hw-strip__text strong {
          color: var(--ink);
          font-weight: 700;
        }

        .hw-strip__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: var(--teal);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: var(--font-b);
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.7rem 1.4rem;
          border-radius: 100px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(45,200,168,0.30);
          letter-spacing: 0.01em;
        }

        .hw-strip__cta:hover {
          background: var(--teal-dk);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(45,200,168,0.40);
        }

        .hw-strip__cta:active { transform:translateY(0); }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .hw-section { padding: 3rem 1.5rem; }
          .hw-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .hw-grid::before { display: none; }
          .hw-card { flex-direction: row; align-items: flex-start; gap: 1.25rem; padding: 1.5rem; }
          .hw-icon-wrap { height: 64px; width: 64px; flex-shrink: 0; }
          .hw-strip { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 540px) {
          .hw-card { flex-direction: column; }
          .hw-icon-wrap { width: 100%; height: 90px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hw-card { transition: none !important; }
          .hw-badge { transition: none !important; }
        }
      `}</style>

      <section
        className="hw-section"
        ref={sectionRef}
        aria-labelledby="hw-heading"
      >
        {/* ── Heading ── */}
        <header className="hw-head">
          <div className="hw-heading-wrap">
            <span className="hw-eyebrow" aria-hidden="true">Simple 3-step process</span>
            <h2 className="hw-h2" id="hw-heading">
              How <span>Cashify</span> Works
            </h2>
            <p className="hw-sub">
              Sell your old device in minutes — no haggling, no hassle.
            </p>
          </div>
        </header>

        {/* ── Steps grid ── */}
        <div
          className="hw-grid"
          role="list"
          aria-label="Steps to sell your phone"
        >
          {STEPS.map((step, i) => (
            <StepCard key={step.step} step={step} index={i} visible={visible} />
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="hw-strip">
          <p className="hw-strip__text">
            Ready to sell? <strong>Get your price in under 60 seconds.</strong>
          </p>
          <button
            type="button"
            className="hw-strip__cta"
            onClick={() => console.log("Sell Now clicked")}
            aria-label="Start selling your phone now"
          >
            Sell Now
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"
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