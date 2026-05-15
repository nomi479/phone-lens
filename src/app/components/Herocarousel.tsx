"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Slide {
  id: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;       // primary accent colour
  accentDark: string;   // darker shade for gradients
}

// ─── Slide Data ─────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  {
    id: 1,
    imageSrc: "/bookrepaire.avif",
    imageAlt: "Mobile screen repair — 12-month warranty offer",
    href: "/market/repairephone",
    tag: "Limited Offer",
    title: "12-Month Warranty",
    subtitle: "Repair your screen today and get double the standard cover — absolutely free.",
    cta: "Book Repair",
    accent: "#00D4A8",
    accentDark: "#007a62",
  },
  {
    id: 2,
    imageSrc: "/buyphone.avif",
    imageAlt: "Shop premium phone accessories with free delivery",
    href: "/market/buyphone",
    tag: "New Arrivals",
    title: "Free Delivery",
    subtitle: "On every accessories order above Rs. 999. Delivered to your doorstep.",
    cta: "Shop Now",
    accent: "#FF6B35",
    accentDark: "#a03800",
  },
  {
    id: 3,
    imageSrc: "/phonesale.avif",
    imageAlt: "Trade in your old device for instant credit",
    href: "/market/sellphone",
    tag: "Best Value",
    title: "Instant Trade-In",
    subtitle: "Get the highest payout for your old phone — credited in minutes.",
    cta: "Get Estimate",
    accent: "#FFD700",
    accentDark: "#8a7000",
  },
  {
    id: 4,
    imageSrc: "/joinboy.avif",
    
    imageAlt: "Device protection plans from Rs. 199 per month",
    href: "/market/detectphone",
    tag: "Best Seller",
    title: "Full Protection",
    subtitle: "Comprehensive device cover from just Rs. 199/month. Cancel anytime.",
    cta: "View Plans",
    accent: "#00B4D8",
    accentDark: "#005f73",
  },
];

const INTERVAL = 4000; // ms between auto-advances

// ─── Animated Progress Bar ──────────────────────────────────────────────────

function ProgressBar({
  duration,
  running,
  accent,
}: {
  duration: number;
  running: boolean;
  accent: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "rgba(255,255,255,0.15)",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      <div
        key={`${running}-${accent}`}
        style={{
          height: "100%",
          background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
          animation: running ? `progress ${duration}ms linear forwards` : "none",
          width: running ? "0%" : "0%",
          boxShadow: `0 0 8px ${accent}`,
        }}
      />
      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
}

// ─── Slide Counter ──────────────────────────────────────────────────────────

function SlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(14px, 2.5vh, 28px)",
        right: "clamp(16px, 2.5vw, 36px)",
        zIndex: 15,
        display: "flex",
        alignItems: "baseline",
        gap: "2px",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
      }}
    >
      <span style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, lineHeight: 1 }}>
        {String(current + 1).padStart(2, "0")}
      </span>
      <span style={{ fontSize: "clamp(11px, 1.4vw, 14px)", opacity: 0.6, margin: "0 2px" }}>/</span>
      <span style={{ fontSize: "clamp(11px, 1.4vw, 14px)", opacity: 0.6 }}>
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Main Carousel ──────────────────────────────────────────────────────────

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      const next = (SLIDES.length + index) % SLIDES.length;
      setDirection(dir);
      setPrev(active);
      setActive(next);
      setProgressKey((k) => k + 1);
    },
    [active]
  );

  const goNext = useCallback(() => goTo(active + 1, "next"), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1, "prev"), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext, paused]);

  // Clear "prev" after transition ends
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [prev]);

  const slide = SLIDES[active];

  return (
    <>
      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        /* Ken Burns zoom on active image */
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translateX(0); }
          100% { transform: scale(1.08) translateX(-1%); }
        }

        /* Slide-in from right (next) */
        @keyframes slideInRight {
          from { transform: translateX(6%) }
          to   { transform: translateX(0)  }
        }

        /* Slide-in from left (prev) */
        @keyframes slideInLeft {
          from { transform: translateX(-6%) }
          to   { transform: translateX(0)   }
        }

        /* Content fade-up stagger */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px) }
          to   { opacity: 1; transform: translateY(0)    }
        }

        /* Shimmer skeleton */
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }

        /* Arrow hover */
        .hc-arrow:hover {
          background: rgba(255,255,255,0.28) !important;
          transform: translateY(-50%) scale(1.08) !important;
        }
        .hc-arrow:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }

        /* Dot hover */
        .hc-dot:hover {
          background: rgba(255,255,255,0.85) !important;
        }

        /* CTA hover handled inline via onMouse* */
      `}</style>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: SLIDES.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: s.href,
            })),
          }),
        }}
      />

      {/* ── Outer wrapper: 90vh with 50px top/bottom padding ── */}
      <div
        style={{
          width: "100%",
          height: "90vh",
          minHeight: "380px",
          maxHeight: "960px",
          paddingTop: "50px",
          paddingBottom: "50px",
          boxSizing: "border-box",
        }}
      >
        <section
          aria-label="Promotional offers"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "clamp(12px, 1.5vw, 20px)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.3)",
            backgroundColor: "#0a2a26",
          }}
        >
          {/* Live region */}
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{ position: "absolute", left: "-9999px", top: 0 }}
          >
            {`Slide ${active + 1} of ${SLIDES.length}: ${slide.title} — ${slide.subtitle}`}
          </div>

          {/* ── Progress bar (top) ── */}
          <ProgressBar
            key={progressKey}
            duration={INTERVAL}
            running={!paused}
            accent={slide.accent}
          />

          {/* ── Slide counter (top-right) ── */}
          <SlideCounter current={active} total={SLIDES.length} />

          {/* ── Slides ── */}
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            const isPrev = i === prev;
            if (!isActive && !isPrev) return null;

            return (
              <article
                key={s.id}
                aria-roledescription="slide"
                aria-label={s.imageAlt}
                aria-hidden={!isActive}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: isActive ? 2 : 1,
                  overflow: "hidden",
                }}
              >
                {/* Skeleton shimmer while image loads */}
                {!loaded[i] && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, #0a2a26 25%, #0d3d36 50%, #0a2a26 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s infinite",
                    }}
                  />
                )}

                {/* Banner image with Ken Burns on active */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    animation: isActive
                      ? `kenBurns ${INTERVAL}ms ease-out forwards, ${
                          direction === "next" ? "slideInRight" : "slideInLeft"
                        } 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both`
                      : "none",
                  }}
                >
                  <Image
                    src={s.imageSrc}
                    alt={s.imageAlt}
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    draggable={false}
                  />
                </div>

                {/* ── Gradient overlays — left text-safe zone + bottom vignette ── */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                      linear-gradient(
                        105deg,
                        rgba(0,0,0,0.72) 0%,
                        rgba(0,0,0,0.48) 38%,
                        transparent 62%
                      ),
                      linear-gradient(
                        to top,
                        rgba(0,0,0,0.55) 0%,
                        transparent 45%
                      )
                    `,
                    zIndex: 1,
                  }}
                />

                {/* ── Accent colour wash (bottom-left glow) ── */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "-30%",
                    left: "-10%",
                    width: "55%",
                    height: "80%",
                    background: `radial-gradient(ellipse at center, ${s.accent}22 0%, transparent 70%)`,
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />

                {/* ── Text content ── */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding:
                        "clamp(24px, 4vh, 56px) clamp(20px, 5vw, 72px)",
                    }}
                  >
                    {/* Tag pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: `${s.accent}28`,
                        border: `1px solid ${s.accent}66`,
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: s.accent,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "clamp(9px, 1vw, 11px)",
                        fontWeight: 500,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        padding: "5px 14px",
                        borderRadius: "999px",
                        width: "fit-content",
                        marginBottom: "clamp(10px, 1.5vh, 18px)",
                        animation: "fadeUp 0.5s 0.05s ease both",
                      }}
                    >
                      {/* Pulse dot */}
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: s.accent,
                          display: "inline-block",
                          animation: "fadeUp 0.5s ease both",
                        }}
                      />
                      {s.tag}
                    </div>

                    {/* Headline */}
                    <h2
                      style={{
                        margin: "0 0 clamp(8px, 1.2vh, 16px)",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "clamp(24px, 5vw, 64px)",
                        fontWeight: 800,
                        lineHeight: 1.08,
                        letterSpacing: "-1px",
                        color: "#fff",
                        textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                        maxWidth: "clamp(280px, 55%, 640px)",
                        animation: "fadeUp 0.55s 0.12s ease both",
                      }}
                    >
                      {/* First word coloured */}
                      <span style={{ color: s.accent }}>
                        {s.title.split(" ")[0]}
                      </span>{" "}
                      {s.title.split(" ").slice(1).join(" ")}
                    </h2>

                    {/* Subtitle */}
                    <p
                      style={{
                        margin: "0 0 clamp(18px, 3vh, 36px)",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "clamp(12px, 1.5vw, 17px)",
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.72)",
                        maxWidth: "clamp(240px, 42%, 520px)",
                        animation: "fadeUp 0.55s 0.2s ease both",
                      }}
                    >
                      {s.subtitle}
                    </p>

                    {/* CTA */}
                    <a
                      href={s.href}
                      aria-label={`${s.cta} — ${s.title}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: s.accent,
                        color: "#000",
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(12px, 1.3vw, 15px)",
                        padding:
                          "clamp(11px, 1.4vh, 17px) clamp(22px, 2.8vw, 38px)",
                        borderRadius: "10px",
                        textDecoration: "none",
                        letterSpacing: "0.2px",
                        whiteSpace: "nowrap",
                        width: "fit-content",
                        boxShadow: `0 4px 24px ${s.accent}55`,
                        transition:
                          "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                        animation: "fadeUp 0.55s 0.28s ease both",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.transform = "scale(1.055) translateY(-1px)";
                        el.style.boxShadow = `0 8px 32px ${s.accent}88`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.transform = "scale(1) translateY(0)";
                        el.style.boxShadow = `0 4px 24px ${s.accent}55`;
                      }}
                    >
                      {s.cta}
                      {/* Arrow icon */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 7h12M8 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </article>
            );
          })}

          {/* ── Prev arrow ── */}
          <button
            className="hc-arrow"
            onClick={goPrev}
            aria-label="Previous slide"
            style={{
              position: "absolute",
              top: "50%",
              left: "clamp(10px, 1.8vw, 22px)",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "clamp(36px, 4vw, 52px)",
              height: "clamp(36px, 4vw, 52px)",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "background 0.2s, transform 0.2s",
            }}
          >
            <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
              <path d="M10 1L2 10l8 9" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ── Next arrow ── */}
          <button
            className="hc-arrow"
            onClick={goNext}
            aria-label="Next slide"
            style={{
              position: "absolute",
              top: "50%",
              right: "clamp(10px, 1.8vw, 22px)",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "clamp(36px, 4vw, 52px)",
              height: "clamp(36px, 4vw, 52px)",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "background 0.2s, transform 0.2s",
            }}
          >
            <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
              <path d="M1 1l8 9-8 9" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ── Dot indicators ── */}
          <div
            role="tablist"
            aria-label="Select a slide"
            style={{
              position: "absolute",
              bottom: "clamp(14px, 2vh, 22px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 10,
            }}
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                className="hc-dot"
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                onClick={() => goTo(i, i > active ? "next" : "prev")}
                style={{
                  width: i === active ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background:
                    i === active
                      ? SLIDES[active].accent
                      : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                  transition: "width 0.35s ease, background 0.35s ease",
                  boxShadow:
                    i === active
                      ? `0 0 8px ${SLIDES[active].accent}99`
                      : "none",
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}