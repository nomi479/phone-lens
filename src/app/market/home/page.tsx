import type { Metadata } from "next";
import React from "react";
import HeroCarousel from "../../components/Herocarousel";
import Services from "../../components/services";
import ServiceCardGrid from "../../components/oldservices";
import Store from "../../components/store";
import Comments from "../../components/comments";
import PhoneLenzDescription from "@/app/components/description";
import Description from "@/app/components/description";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Mobile Repair & Accessories | 12-Month Warranty Guarantee",
  description:
    "Book your mobile screen repair today and enjoy a 12-month warranty. Shop accessories, trade in your old device, and explore protection plans — all in one place.",
  openGraph: {
    title: "Mobile Repair & Accessories | 12-Month Warranty Guarantee",
    description:
      "Screen repairs with a 12-month warranty guarantee. Free delivery on accessories. Instant trade-in credit. Comprehensive device protection plans.",
    type: "website",
  },
};

// ─── Shared horizontal constraint ────────────────────────────────────────────
//
// Both HeroCarousel and Services are wrapped in ONE container div so they
// always share identical maxWidth, left margin, and right margin.
//
// Rule: never put one sibling inside a <section> and another outside it —
// that's what caused the misaligned left/right edges before.

const pageContentStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  // clamp() gives 16px gutter on mobile, scales up to 48px on wide screens
  paddingLeft:  "clamp(16px, 3vw, 48px)",
  paddingRight: "clamp(16px, 3vw, 48px)",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      {/*
       * Single shared constraint wrapper.
       * Every child section inherits the same horizontal gutter automatically.
       * Add new sections inside this div to keep them aligned.
       */}
      <div style={pageContentStyle}>

        <section aria-label="Featured promotions">
          <HeroCarousel />
        </section>

        <section aria-label="Our services">
          <Services />
        </section>
        <section aria-label="Our services">
          <ServiceCardGrid />
        </section>
         <section aria-label="Our services">
          <Store />
        </section>
        <section aria-label="Our services">
          <Comments />
        </section>
          <section aria-label="Our services">
          <Description />
        </section>

        {/* Add more aligned sections here */}

      </div>

      {/*
       * Full-bleed sections (e.g. a background-colour banner that should
       * stretch edge-to-edge) go OUTSIDE the div above, then use their own
       * inner container with the same pageContentStyle for text/content.
       */}
    </main>
  );
}