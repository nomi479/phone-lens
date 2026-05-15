"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServiceCard {
  id: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
  label: string;
  title: string;
  subtitle: string;
  blobColor: string;
  blobColor2: string;
  accentColor: string;
  badgeText: string;
}

// ─── Card Data ────────────────────────────────────────────────────────────────

const CARDS: ServiceCard[] = [
  {
    id: 1,
    imageSrc: "/phonestore.avif",
    imageAlt: "Mobile screen repair service",
    href: "/market/repairephone",
    label: "Most Popular",
    title: "Screen Repair",
    subtitle: "12-month warranty on every fix",
    blobColor: "#00D4A8",
    blobColor2: "#00897B",
    accentColor: "#00D4A8",
    badgeText: "From Rs. 499",
  },
  {
    id: 2,
    imageSrc: "/buyphone.avif",
    imageAlt: "Buy a new phone",
    href: "/market/buyphone",
    label: "New Arrivals",
    title: "Buy Phone",
    subtitle: "Latest models, best prices",
    blobColor: "#FF6B35",
    blobColor2: "#E64A19",
    accentColor: "#FF6B35",
    badgeText: "EMI Available",
  },
  {
    id: 3,
    imageSrc: "/brandnew.avif",
    imageAlt: "Phone sale offers",
    href: "/market/sellphone",
    label: "Limited Time",
    title: "Phone Sale",
    subtitle: "Up to 40% off selected models",
    blobColor: "#FFD700",
    blobColor2: "#FFA000",
    accentColor: "#FFD700",
    badgeText: "Ends Soon",
  },
  {
    id: 4,
    imageSrc: "/sellphone.avif",
    imageAlt: "Sell your old phone",
    href: "/market/sellphone",
    label: "Earn Cash",
    title: "Sell Phone",
    subtitle: "Get the best value for your old device",
    blobColor: "#00B4D8",
    blobColor2: "#0077B6",
    accentColor: "#00B4D8",
    badgeText: "Rs. 500 / Refer",
  },
  {
    id: 5,
    imageSrc: "/repairephone.avif",
    imageAlt: "Device protection plan",
    href: "/market/repairephone",
    label: "Best Seller",
    title: "Protection",
    subtitle: "Full cover from Rs. 199/month",
    blobColor: "#9C27B0",
    blobColor2: "#6A1B9A",
    accentColor: "#CE93D8",
    badgeText: "Rs. 199 / mo",
  },
];

// ─── Single Card ──────────────────────────────────────────────────────────────

function ServiceCardItem({ card }: { card: ServiceCard }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={card.href}
      aria-label={`${card.title} — ${card.subtitle}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        position: "relative",
        width: "200px",
        height: "260px",
        borderRadius: "14px",
        flexShrink: 0,
        boxShadow: hovered
          ? `28px 28px 70px #b0b0b0, -28px -28px 70px #ffffff, 0 0 0 2px ${card.accentColor}44`
          : "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
        transition: "box-shadow 0.35s ease, transform 0.35s ease",
        transform: hovered ? "translateY(-6px) scale(1.025)" : "translateY(0) scale(1)",
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Animated blob layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          overflow: "hidden",
          borderRadius: "14px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 40%, ${card.blobColor}, ${card.blobColor2})`,
            filter: "blur(14px)",
            animation: `blob-${card.id} 5s infinite ease`,
            opacity: hovered ? 0.85 : 0.7,
            transition: "opacity 0.35s ease",
          }}
        />
        <style>{`
          @keyframes blob-${card.id} {
            0%   { transform: translate(-100%, -100%) translate3d(0,    0,    0); }
            25%  { transform: translate(-100%, -100%) translate3d(100%,  0,    0); }
            50%  { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); }
            75%  { transform: translate(-100%, -100%) translate3d(0,   100%,  0); }
            100% { transform: translate(-100%, -100%) translate3d(0,    0,    0); }
          }
        `}</style>
      </div>

      {/* Frosted glass face */}
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          width: "190px",
          height: "250px",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "10px",
          outline: "2px solid rgba(255,255,255,0.85)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Top label badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: `${card.accentColor}22`,
            border: `1px solid ${card.accentColor}66`,
            color: card.accentColor === "#FFD700" ? "#7a5c00" : card.accentColor,
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "999px",
            fontFamily: "'Sora', sans-serif",
            zIndex: 3,
          }}
        >
          {card.label}
        </div>

        {/* Product image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "130px",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={card.imageSrc}
            alt={card.imageAlt}
            fill
            sizes="200px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.45s ease",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.92))",
            }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            padding: "8px 14px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "4px",
            flex: 1,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontSize: "11px",
              color: "#666",
              lineHeight: 1.4,
            }}
          >
            {card.subtitle}
          </p>

          {/* Price / badge pill */}
          <div
            style={{
              marginTop: "auto",
              marginBottom: "10px",
              background: card.accentColor,
              color: card.accentColor === "#FFD700" ? "#5a4000" : "#000",
              fontFamily: "'Sora', sans-serif",
              fontSize: "11px",
              fontWeight: 800,
              padding: "5px 14px",
              borderRadius: "999px",
              whiteSpace: "nowrap",
              boxShadow: `0 3px 12px ${card.accentColor}55`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          >
            {card.badgeText}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Card Grid Component ──────────────────────────────────────────────────────

export default function ServiceCardGrid() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        .card-scroll-track::-webkit-scrollbar { height: 0px; }
      `}</style>

      <section
        aria-label="Our services"
        style={{
          width: "100%",
          /*
           * FIX: NO horizontal padding here.
           * The parent div in home-page.tsx already applies
           * clamp(16px, 3vw, 48px) on both sides via pageContentStyle.
           * Adding padding here again would double the gutter and push
           * the cards further in than the HeroCarousel above.
           *
           * Only vertical spacing lives here.
           */
          paddingTop: "clamp(24px, 4vw, 48px)",
          paddingBottom: "clamp(24px, 4vw, 48px)",
          paddingLeft: 0,
          paddingRight: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Section heading — flush with the carousel edge */}
        <div style={{ marginBottom: "clamp(24px, 3vw, 36px)" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(10px, 1vw, 12px)",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#00D4A8",
            }}
          >
            What We Offer
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(22px, 3.5vw, 38px)",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.5px",
            }}
          >
            Our Services
          </h2>
        </div>

        {/*
         * Card track:
         * — paddingTop/Bottom only — for the neumorphic shadow breathing room.
         * — NO paddingLeft/paddingRight — parent already handles the gutter.
         */}
        <div
          className="card-scroll-track"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px, 3.5vw, 48px)",
            justifyContent: "center",
            overflowX: "auto",
            paddingTop: "16px",
            paddingBottom: "28px", /* room for neumorphic bottom shadow */
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {CARDS.map((card) => (
            <ServiceCardItem key={card.id} card={card} />
          ))}
        </div>
      </section>
    </>
  );
}