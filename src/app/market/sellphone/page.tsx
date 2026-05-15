"use client";
import React, { useState, useCallback, memo, useRef } from "react";
import Image from "next/image";
import WhyUs from "./WhyUs";
import SellWoking from "./SellWoking";
import RealSelling from "./RealSelling";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brand {
  id: string;
  name: string;
  textColor: string;
  accentColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FEATURES = [
  { label: "Maximum Value",        icon: "💰" },
  { label: "Safe & Hassle-free",   icon: "🔒" },
  { label: "Free Doorstep Pickup", icon: "🚚" },
] as const;

const BRANDS: Brand[] = [
  { id: "apple",   name: "Apple",   textColor: "#1a1a1a", accentColor: "#555555" },
  { id: "xiaomi",  name: "Mi",      textColor: "#FF6900", accentColor: "#FF6900" },
  { id: "samsung", name: "Samsung", textColor: "#1428A0", accentColor: "#1428A0" },
  { id: "vivo",    name: "vivo",    textColor: "#415FFF", accentColor: "#415FFF" },
];

const STATS = [
  { value: "4.5L+",   label: "Devices Sold"     },
  { value: "₹500Cr+", label: "Paid to Sellers"  },
  { value: "4.8★",    label: "App Rating"        },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FeaturePill = memo(({ label, icon, index }: { label: string; icon: string; index: number }) => (
  <li className="sp-feature" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
    <span className="sp-feature__icon" aria-hidden="true">{icon}</span>
    <span className="sp-feature__label">{label}</span>
  </li>
));
FeaturePill.displayName = "FeaturePill";

const BrandCard = memo(({ brand, onClick, index }: {
  brand: Brand;
  onClick: (id: string) => void;
  index: number;
}) => {
  const handleClick = useCallback(() => onClick(brand.id), [brand.id, onClick]);
  return (
    <button
      type="button"
      className="sp-brand"
      onClick={handleClick}
      aria-label={`Sell ${brand.name} phone`}
      style={{ animationDelay: `${0.7 + index * 0.08}s`, "--accent": brand.accentColor } as React.CSSProperties}
    >
      <span className="sp-brand__glow" aria-hidden="true" />
      <span className="sp-brand__name" style={{ color: brand.textColor }}>{brand.name}</span>
    </button>
  );
});
BrandCard.displayName = "BrandCard";

const StatBadge = memo(({ value, label, index }: { value: string; label: string; index: number }) => (
  <div className="sp-stat" style={{ animationDelay: `${0.2 + index * 0.12}s` }}>
    <span className="sp-stat__value">{value}</span>
    <span className="sp-stat__label">{label}</span>
  </div>
));
StatBadge.displayName = "StatBadge";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SellPage() {
  const [query, setQuery]   = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    console.log("Search:", query.trim());
  }, [query]);

  const handleBrandClick = useCallback((id: string) => {
    // router.push(`/sell/${id}`)
    console.log("Brand:", id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Tokens ── */
        .sp-root {
          --teal:       #2DC8A8;
          --teal-lt:    #3ddbb9;
          --teal-dk:    #1da88c;
          --teal-soft:  rgba(45,200,168,0.10);
          --teal-ring:  rgba(45,200,168,0.22);
          --ink:        #0c1015;
          --muted:      #5a6573;
          --surface:    #ffffff;
          --bg:         #eef9f6;
          --border:     #ddeee8;
          --font-head:  'Syne', system-ui, sans-serif;
          --font-body:  'DM Sans', system-ui, sans-serif;
          --r-card:     18px;
          --r-pill:     100px;
        }

        /* ── Shell ── */
        .sp-root {
          font-family: var(--font-body);
          background: var(--bg);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
        }

        /* Layered mesh backdrop */
        .sp-root::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 70% at 80% 40%, rgba(45,200,168,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 5%  85%, rgba(45,200,168,0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* Subtle dot grid */
        .sp-root::after {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(45,200,168,0.18) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* ── Grid ── */
        .sp-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 420px;
          min-height: 460px;
        }

        /* ── Left ── */
        .sp-left {
          padding: 3.25rem 3rem 3.25rem 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: center;
        }

        /* Eyebrow */
        .sp-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--teal-soft);
          border: 1px solid var(--teal-ring);
          color: var(--teal-dk);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: var(--r-pill);
          width: fit-content;
          opacity: 0;
          animation: fadeUp 0.45s ease 0.05s forwards;
        }

        .sp-eyebrow__dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--teal);
          animation: blink 2.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.65); }
        }

        /* Heading */
        .sp-h1 {
          font-family: var(--font-head);
          font-size: clamp(2rem, 3vw, 2.9rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--ink);
          letter-spacing: -0.03em;
          opacity: 0;
          animation: fadeUp 0.5s ease 0.15s forwards;
        }

        .sp-h1 em {
          font-style: normal;
          position: relative;
          display: inline-block;
          color: var(--teal-dk);
        }

        /* Animated underline on "Instant Cash" */
        .sp-h1 em::after {
          content: '';
          position: absolute;
          left: 0; bottom: -3px;
          width: 100%; height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--teal), var(--teal-lt));
          transform-origin: left;
          animation: underlineGrow 0.6s cubic-bezier(.16,1,.3,1) 0.75s both;
        }

        @keyframes underlineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* Feature pills */
        .sp-features {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-wrap: wrap; gap: 0.5rem;
        }

        .sp-feature {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: var(--surface);
          border: 1.5px solid var(--border);
          padding: 0.42rem 0.88rem;
          border-radius: var(--r-pill);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          opacity: 0;
          animation: fadeUp 0.45s ease forwards;
          cursor: default;
          transition: border-color 0.2s, box-shadow 0.2s, color 0.2s, transform 0.2s;
        }

        .sp-feature:hover {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-soft);
          color: var(--teal-dk);
          transform: translateY(-2px);
        }

        .sp-feature__icon { font-size: 0.92rem; }

        /* Search */
        .sp-search-outer {
          opacity: 0;
          animation: fadeUp 0.5s ease 0.35s forwards;
        }

        .sp-search {
          display: flex; align-items: center;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: var(--r-card);
          padding: 0.45rem 0.45rem 0.45rem 1.1rem;
          gap: 0.75rem;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .sp-search--on {
          border-color: var(--teal);
          box-shadow: 0 0 0 4px var(--teal-soft), 0 6px 24px rgba(45,200,168,0.14);
        }

        .sp-search__ico { color: #c0c8d0; flex-shrink:0; transition: color 0.2s; }
        .sp-search--on .sp-search__ico { color: var(--teal); }

        .sp-search__inp {
          flex:1; border:none; outline:none;
          font-family: var(--font-body);
          font-size: 0.93rem; font-weight: 500;
          color: var(--ink); background: transparent;
        }
        .sp-search__inp::placeholder { color: #c5ced8; font-weight:400; }

        .sp-search__cta {
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-lt) 100%);
          color: #fff; border: none; cursor: pointer;
          border-radius: 12px;
          padding: 0.7rem 1.3rem;
          font-family: var(--font-body);
          font-size: 0.84rem; font-weight: 700;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(45,200,168,0.35);
          white-space: nowrap;
        }

        .sp-search__cta:hover  { opacity:0.9; transform:scale(1.03); box-shadow: 0 6px 20px rgba(45,200,168,0.4); }
        .sp-search__cta:active { transform:scale(0.97); }

        /* Divider */
        .sp-divider {
          display: flex; align-items: center; gap: 0.8rem;
          opacity: 0;
          animation: fadeUp 0.45s ease 0.52s forwards;
        }

        .sp-divider__bar {
          flex:1; height:1px; max-width:68px;
          background: linear-gradient(90deg, transparent, var(--border));
        }

        .sp-divider__bar:last-child {
          background: linear-gradient(90deg, var(--border), transparent);
        }

        .sp-divider__txt {
          font-size: 0.75rem; font-weight: 600;
          color: #aab4bc; letter-spacing:0.07em; text-transform:uppercase;
          white-space: nowrap;
        }

        /* Brands grid */
        .sp-brands {
          list-style:none; padding:0; margin:0;
          display: flex; flex-wrap:wrap; align-items:center; gap:0.6rem;
        }

        .sp-brand {
          position: relative;
          display: flex; align-items:center; justify-content:center;
          width: 88px; height: 58px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--r-card);
          cursor: pointer; overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
          transition: border-color 0.2s, box-shadow 0.25s, transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }

        .sp-brand:hover {
          border-color: var(--accent, var(--teal));
          box-shadow:
            0 8px 24px rgba(0,0,0,0.09),
            0 0 0 3px color-mix(in srgb, var(--accent, var(--teal)) 18%, transparent);
          transform: translateY(-3px) scale(1.05);
        }

        .sp-brand:active  { transform:translateY(0) scale(1); }
        .sp-brand:focus-visible { outline:2px solid var(--teal); outline-offset:2px; }

        .sp-brand__glow {
          position:absolute; inset:-50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent, var(--teal)) 25%, transparent) 0%, transparent 70%);
          opacity:0; transition: opacity 0.3s;
        }
        .sp-brand:hover .sp-brand__glow { opacity:1; }

        .sp-brand__name {
          position:relative;
          font-family: var(--font-head);
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: -0.01em;
        }

        /* More brands */
        .sp-more {
          display: inline-flex; align-items:center; justify-content:center;
          gap:0.25rem;
          width:88px; height:58px;
          background: none;
          border: 1.5px dashed var(--border);
          border-radius: var(--r-card);
          cursor:pointer; font-family:var(--font-body);
          font-size:0.78rem; font-weight:700;
          color: var(--muted);
          opacity:0;
          animation: fadeUp 0.4s ease 1.05s forwards;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .sp-more:hover {
          border-color: var(--teal);
          color: var(--teal-dk);
          background: var(--teal-soft);
        }

        /* Stats strip */
        .sp-stats {
          display:flex; gap:2rem;
          padding-top:1.1rem;
          border-top: 1px solid var(--border);
        }

        .sp-stat {
          display:flex; flex-direction:column; gap:0.1rem;
          opacity:0;
          animation: fadeUp 0.5s ease forwards;
        }

        .sp-stat__value {
          font-family: var(--font-head);
          font-size: 1.2rem; font-weight: 800;
          color: var(--ink); letter-spacing:-0.02em;
        }

        .sp-stat__label {
          font-size:0.7rem; font-weight:500;
          color: #a4adb8; letter-spacing:0.03em;
        }

        /* ── Right hero panel ── */
        .sp-right {
          position:relative; overflow:hidden;
          background: linear-gradient(160deg, #21c09d 0%, #2DC8A8 45%, #36d5b2 100%);
        }

        /* Concentric rings */
        .sp-ring {
          position:absolute; border-radius:50%;
          border:1px solid rgba(255,255,255,0.12);
          top:50%; left:50%;
          transform: translate(-50%,-50%);
          animation: expandRing 8s linear infinite;
        }

        .sp-ring:nth-child(1) { width:500px; height:500px; animation-delay:0s;   }
        .sp-ring:nth-child(2) { width:360px; height:360px; animation-delay:2.7s; }
        .sp-ring:nth-child(3) { width:220px; height:220px; animation-delay:5.3s; }

        @keyframes expandRing {
          0%   { opacity:0.5; }
          50%  { opacity:0.15; }
          100% { opacity:0.5; }
        }

        /* Sheen sweep */
        .sp-sheen {
          position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          animation: sweep 4s ease-in-out infinite;
        }

        @keyframes sweep {
          0%   { transform:translateX(-100%); }
          50%  { transform:translateX(100%);  }
          100% { transform:translateX(100%);  }
        }

        /* Floating bills */
        .sp-bill {
          position:absolute;
          width:54px; height:30px;
          border-radius:6px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.30);
          backdrop-filter: blur(6px);
          display:flex; align-items:center; justify-content:center;
          font-size:0.7rem; font-weight:800;
          color:rgba(255,255,255,0.9);
          letter-spacing:0.04em;
          animation: floatUp 5s ease-in-out infinite;
        }

        .sp-bill:nth-child(4) { top:11%; right:15%; animation-delay:0s;    transform:rotate(14deg); }
        .sp-bill:nth-child(5) { top:21%; right:4%;  animation-delay:1.3s;  transform:rotate(-9deg); }
        .sp-bill:nth-child(6) { bottom:26%; right:9%; animation-delay:0.7s; transform:rotate(21deg); }
        .sp-bill:nth-child(7) { top:7%;  left:9%;   animation-delay:2.1s;  transform:rotate(-19deg); }
        .sp-bill:nth-child(8) { bottom:14%; left:14%; animation-delay:1s;   transform:rotate(11deg); }

        @keyframes floatUp {
          0%,100% { translate:0 0; }
          50%      { translate:0 -12px; }
        }

        /* Hero image */
        .sp-hero-img {
          position:absolute;
          bottom:0; left:50%;
          transform:translateX(-50%);
          width:88%; height:92%;
          object-fit:contain;
          object-position:bottom center;
          filter:drop-shadow(0 -12px 32px rgba(0,0,0,0.18));
        }

        /* Floating trust chip */
        .sp-trust {
          position:absolute; bottom:1.5rem; left:50%;
          transform:translateX(-50%);
          background:rgba(255,255,255,0.18);
          border:1px solid rgba(255,255,255,0.35);
          backdrop-filter:blur(14px);
          border-radius:var(--r-pill);
          padding:0.5rem 1.1rem;
          white-space:nowrap;
          font-size:0.75rem; font-weight:700;
          color:#fff; letter-spacing:0.04em;
          display:flex; align-items:center; gap:0.4rem;
          box-shadow:0 4px 20px rgba(0,0,0,0.12);
          animation: fadeUp 0.5s ease 1s forwards;
          opacity:0;
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }

        /* ── Responsive ── */
        @media (max-width:900px) {
          .sp-grid { grid-template-columns:1fr; }
          .sp-left { padding:2.5rem 1.75rem 2rem; }
          .sp-right { height:260px; border-radius:0 0 28px 28px; }
          .sp-h1 { font-size:1.9rem; }
          .sp-stats { gap:1.25rem; }
        }

        @media (prefers-reduced-motion:reduce) {
          .sp-bill,.sp-sheen,.sp-ring,.sp-h1 em::after { animation:none !important; }
          .sp-eyebrow,.sp-h1,.sp-feature,.sp-search-outer,
          .sp-divider,.sp-brand,.sp-more,.sp-stat,.sp-trust {
            animation:none; opacity:1;
          }
          .sp-brand,.sp-feature { transition:none; }
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-grid">

          {/* ── Left pane ── */}
          <div className="sp-left">

            <span className="sp-eyebrow">
              <span className="sp-eyebrow__dot" />
              India&apos;s #1 Phone Resale Platform
            </span>

            <h1 className="sp-h1">
              Sell Old Mobile Phone<br />
              for <em>Instant Cash</em>
            </h1>

            <ul className="sp-features" aria-label="Key benefits">
              {FEATURES.map((f, i) => (
                <FeaturePill key={f.label} label={f.label} icon={f.icon} index={i} />
              ))}
            </ul>

            <div className="sp-search-outer">
              <form
                className={`sp-search${focused ? " sp-search--on" : ""}`}
                onSubmit={handleSearch}
                role="search"
                aria-label="Search mobile phones to sell"
              >
                <svg className="sp-search__ico" aria-hidden="true"
                  width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  ref={inputRef}
                  type="search"
                  className="sp-search__inp"
                  placeholder="Search your Mobile Phone to sell…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  aria-label="Mobile phone search"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="sp-search__cta">
                  Get Price ›
                </button>
              </form>
            </div>

            <div className="sp-divider" aria-hidden="true">
              <span className="sp-divider__bar" />
              <span className="sp-divider__txt">Or choose a brand</span>
              <span className="sp-divider__bar" />
            </div>

            <ul className="sp-brands" aria-label="Popular brands">
              {BRANDS.map((brand, i) => (
                <li key={brand.id} style={{ display:"contents" }}>
                  <BrandCard brand={brand} onClick={handleBrandClick} index={i} />
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="sp-more"
                  onClick={() => console.log("More brands")}
                  aria-label="Browse all brands"
                >
                  More&nbsp;›
                </button>
              </li>
            </ul>

            <div className="sp-stats" role="list" aria-label="Platform statistics">
              {STATS.map((s, i) => (
                <StatBadge key={s.label} value={s.value} label={s.label} index={i} />
              ))}
            </div>

          </div>

          {/* ── Right hero panel ── */}
          <div className="sp-right" aria-hidden="true">
            <span className="sp-ring" />
            <span className="sp-ring" />
            <span className="sp-ring" />
            <div className="sp-sheen" />

            {/* Floating cash notes */}
            {["$","₹","$","₹","$"].map((sym, i) => (
              <span key={i} className="sp-bill">{sym}</span>
            ))}

            {/*
              Replace src with your real hero image path.
              priority={true} → marks as LCP for Next.js to preload.
            */}
            <Image
              src="/sellphone.avif"
              alt="Happy seller holding phone and cash"
              className="sp-hero-img"
              width={420}
              height={500}
              priority
              quality={90}
            />

            <span className="sp-trust">
              ✅&nbsp;Instant payment guaranteed
            </span>
          </div>

        </div>
      </div>
      <SellWoking/>
      <WhyUs/>
      <RealSelling/>
    </>
  );
}