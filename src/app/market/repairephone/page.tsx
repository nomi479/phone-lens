"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SERVICES = [
  { title: "Screen Repair", icon: "/PanelImage.png", description: "Cracked screen replacement and glass repair." },
  { title: "Battery Service", icon: "/Battery.png", description: "Battery swap, diagnostics, and long-lasting power." },
  { title: "Microphone Fix", icon: "/Mic.png", description: "Clear voice calls with expert mic repair." },
  { title: "Speaker Repair", icon: "/Speaker.png", description: "Restore loud, crisp audio for calls and media." },
  { title: "Back Cover", icon: "/Back.png", description: "Back panel replacement and frame restoration." },
];

const BRANDS = [
  "Apple",
  "Xiaomi",
  "Samsung",
  "Vivo",
  "OnePlus",
  "Oppo",
  "realme",
  "Motorola",
  "Nokia",
  "Honor",
  "Asus",
  "Google",
  "POCO",
  "Infinix",
  "iQOO",
  "Nothing",
];

export default function RepairPage() {
  const router = useRouter();

  const handleServiceClick = () => {
    router.push("/");
  };

  return (
    <main className="rp-root">
      <section className="rp-hero">
        <div className="rp-hero-copy">
          <p className="rp-eyebrow">Repair, jab aap chaho</p>
          <h1>Open all 7 days | 10 AM – 9 PM</h1>
          <p className="rp-hero-text">
            Fast doorstep phone repair in your city, backed by a 6-month warranty and easy 7-day refund policy.
          </p>
          <div className="rp-hero-badges">
            <span>Doorstep repair</span>
            <span>6-month warranty*</span>
            <span>7-day refund*</span>
          </div>
          <button type="button" className="rp-hero-button" onClick={handleServiceClick}>
            Book Repair
          </button>
        </div>

        <div className="rp-hero-visual">
          <div className="rp-hero-card">
            <Image
              src="/RepareImage.png"
              alt="Repair your phone"
              fill
              className="rp-hero-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="rp-services">
        <div className="rp-services-header">
          <h2>Services Available</h2>
          <p>Tap any service below to start and return home instantly.</p>
        </div>

        <div className="rp-service-grid">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              type="button"
              className="rp-service-card"
              onClick={handleServiceClick}
            >
              <div className="rp-service-icon">
                <Image src={service.icon} alt={service.title} width={56} height={56} />
              </div>
              <div className="rp-service-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rp-brands">
        <div className="rp-brands-header">
          <h2>Top Brands</h2>
          <p>Trusted brands we service quickly and reliably.</p>
        </div>
        <div className="rp-brand-grid">
          {BRANDS.map((brand) => (
            <div key={brand} className="rp-brand-card">
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
