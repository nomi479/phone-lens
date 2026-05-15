"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ServiceCard {
  id: number;
  emoji: string;
  href: string;
  label: string;
  labelBg: string;
  labelColor: string;
  title: string;
  subtitle: string;
  iconBg: string;
  badgeBg: string;
  badgeColor: string;
  badgeText: string;
  featured?: boolean;
  featuredBorderColor?: string;
}

const CARDS: ServiceCard[] = [
  {
    id: 1,
    emoji: "🔧",
    href: "/market/repairephone",
    label: "Most Popular",
    labelBg: "#9FE1CB",
    labelColor: "#085041",
    title: "Screen Repair",
    subtitle: "12-month warranty on every fix",
    iconBg: "#E1F5EE",
    badgeBg: "#1D9E75",
    badgeColor: "#E1F5EE",
    badgeText: "From Rs. 499",
  },
  {
    id: 2,
    emoji: "📱",
    href: "/market/buyphone",
    label: "New Arrivals",
    labelBg: "#F5C4B3",
    labelColor: "#712B13",
    title: "Buy Phone",
    subtitle: "Latest models, best prices",
    iconBg: "#FAECE7",
    badgeBg: "#993C1D",
    badgeColor: "#FAECE7",
    badgeText: "EMI Available",
  },
  {
    id: 3,
    emoji: "🏷️",
    href: "/market/sellphone",
    label: "Limited Time",
    labelBg: "#FAC775",
    labelColor: "#412402",
    title: "Phone Sale",
    subtitle: "Up to 40% off selected models",
    iconBg: "#FAEEDA",
    badgeBg: "#BA7517",
    badgeColor: "#FAEEDA",
    badgeText: "Ends Soon",
    featured: true,
    featuredBorderColor: "#BA7517",
  },
  {
    id: 4,
    emoji: "💸",
    href: "/market/sellphone",
    label: "Earn Cash",
    labelBg: "#B5D4F4",
    labelColor: "#042C53",
    title: "Sell Phone",
    subtitle: "Best value for your old device",
    iconBg: "#E6F1FB",
    badgeBg: "#185FA5",
    badgeColor: "#E6F1FB",
    badgeText: "Rs. 500 / Refer",
    featured: true,
    featuredBorderColor: "#185FA5",
  },
  {
    id: 5,
    emoji: "🛡️",
    href: "/market/repairephone",
    label: "Best Seller",
    labelBg: "#CECBF6",
    labelColor: "#26215C",
    title: "Protection",
    subtitle: "Full cover from Rs. 199/month",
    iconBg: "#EEEDFE",
    badgeBg: "#534AB7",
    badgeColor: "#EEEDFE",
    badgeText: "Rs. 199 / mo",
  },
];

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
        borderRadius: "16px",
        overflow: "hidden",
        background: "#fff",
        border: card.featured
          ? `2px solid ${card.featuredBorderColor}`
          : "0.5px solid rgba(0,0,0,0.08)",
        boxShadow: hovered
          ? "0 16px 36px rgba(0,0,0,0.11)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Icon area */}
      <div
        style={{
          height: "clamp(90px, 13vw, 120px)",
          background: card.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: card.labelBg,
            color: card.labelColor,
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            padding: "3px 9px",
            borderRadius: "999px",
            fontFamily: "'Sora', sans-serif",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          {card.label}
        </span>
        <span
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            transform: hovered ? "scale(1.12)" : "scale(1)",
            transition: "transform 0.3s ease",
            display: "block",
          }}
        >
          {card.emoji}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "clamp(10px, 1.5vw, 14px)" }}>
        <h3
          style={{
            margin: "0 0 3px",
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(13px, 1.5vw, 15px)",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.2px",
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            margin: "0 0 10px",
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(10px, 1vw, 11px)",
            color: "#666",
            lineHeight: 1.4,
          }}
        >
          {card.subtitle}
        </p>
        <span
          style={{
            display: "inline-block",
            background: card.badgeBg,
            color: card.badgeColor,
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(10px, 1vw, 11px)",
            fontWeight: 800,
            padding: "4px 12px",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          {card.badgeText}
        </span>
      </div>
    </Link>
  );
}

export default function ServiceCardGrid() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&display=swap');
        .sc-grid {
          display: grid;
          gap: clamp(12px, 2vw, 20px);
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 480px) {
          .sc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .sc-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1024px) {
          .sc-grid { grid-template-columns: repeat(5, 1fr); }
        }
        .sc-divider {
          width: 32px; height: 3px; border-radius: 2px;
          background: #00C49A; margin-bottom: 14px;
        }
      `}</style>

      <section
        aria-label="Our services"
        style={{
          width: "100%",
          paddingTop: "clamp(20px, 4vw, 48px)",
          paddingBottom: "clamp(20px, 4vw, 48px)",
          boxSizing: "border-box",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        {/* Heading */}
        <p style={{
          margin: "0 0 8px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "#00C49A",
        }}>
          What We Offer
        </p>
        <h2 style={{
          margin: "0 0 8px",
          fontSize: "clamp(22px, 5vw, 40px)",
          fontWeight: 800,
          color: "#111",
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
        }}>
          Sell Your Old<br />Device Now
        </h2>
        <div className="sc-divider" />
        <p style={{
          margin: "0 0 clamp(20px, 3vw, 36px)",
          fontSize: "clamp(13px, 1.5vw, 15px)",
          color: "#666",
          maxWidth: "500px",
          lineHeight: 1.6,
        }}>
          Get instant cash for your old phone — or explore our full range of services below.
        </p>

        {/* Grid */}
        <div className="sc-grid">
          {CARDS.map((card) => (
            <ServiceCardItem key={card.id} card={card} />
          ))}
        </div>
      </section>
    </>
  );
}