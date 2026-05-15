"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Condition = "Good" | "Fair" | "Superb";

type Device = {
  device_name?: string;
  brand_name?: string;
  image?: string;
  thumbnail?: string;
  main_photo?: string;
  ram?: string | number;
  storage?: string;
  os?: string;
  price?: number;
};

type MobileApiDevice = {
  device_name?: string;
  brand_name?: string;
  image?: string;
  main_photo?: string;
  thumbnail?: string;
  ram?: string | number;
  memory?: string | number;
  storage?: string;
  disk?: string;
  price?: number;
};

type MobileApiResponse = {
  results?: MobileApiDevice[];
  error?: string;
  details?: string;
};

type SellForm = {
  brand: string;
  model: string;
  condition: Condition;
  color: string;
  price: string;
  description: string;
  imageUrl: string;
};

type SubmitStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE = "/sellphone.avif";
const CONDITIONS: Condition[] = ["Good", "Fair", "Superb"];

/**
 * Only real devices with actual specs.
 * Marketing / placeholder images (phonestore, sellphone, buyphone, etc.) removed.
 */
const FALLBACK_DEVICES: Device[] = [
  { device_name: "iPhone 14 Pro",    brand_name: "Apple",   image: "/newphones/iphone14.avif",   ram: "8GB",  storage: "256GB", price: 269999 },
  { device_name: "iPhone 12",        brand_name: "Apple",   image: "/newphones/iphone12.avif",   ram: "4GB",  storage: "64GB",  price: 139999 },
  { device_name: "Black iPhone",     brand_name: "Apple",   image: "/newphones/BlackIphone.jpg",  ram: "8GB",  storage: "256GB", price: 185000 },
  { device_name: "Simple iPhone",    brand_name: "Apple",   image: "/newphones/SimpleIphone.png", ram: "4GB",  storage: "64GB",  price: 85000  },
  { device_name: "Galaxy S25",       brand_name: "Samsung", image: "/newphones/galaxyS25.avif",   ram: "12GB", storage: "256GB", price: 315000 },
  { device_name: "Galaxy S20",       brand_name: "Samsung", image: "/newphones/galaxyS20.avif",   ram: "8GB",  storage: "128GB", price: 165000 },
  { device_name: "Handheld Phone",   brand_name: "Generic", image: "/newphones/handIphone.jpg",   ram: "6GB",  storage: "128GB", price: 95000  },
  { device_name: "Waterproof Phone", brand_name: "Generic", image: "/newphones/waterphone.png",   ram: "8GB",  storage: "128GB", price: 112000 },
];

// ─── Pure helpers (outside component — never recreated on render) ─────────────

function getImage(device: Device): string {
  return device.image || device.main_photo || device.thumbnail || PLACEHOLDER_IMAGE;
}

function getTitle(device: Device): string {
  return [device.brand_name, device.device_name].filter(Boolean).join(" ") || "Unknown Model";
}

function getSubtitle(device: Device): string {
  const specs = [device.ram ? `${device.ram} RAM` : null, device.storage].filter(Boolean);
  return specs.join(" • ") || "Phone details unavailable";
}

function estimatePrice(device: Device): number {
  const brand   = device.brand_name?.toLowerCase() ?? "";
  const ram     = Number(device.ram?.toString().match(/\d+/)?.[0]     ?? 0);
  const storage = Number(device.storage?.toString().match(/\d+/)?.[0] ?? 0);
  const bonus   = brand.includes("apple") ? 18000 : brand.includes("samsung") ? 8000 : 5000;
  return 9000 + ram * 1200 + storage * 120 + bonus;
}

function formatPKR(value: number): string {
  return `PKR ${value.toLocaleString("en-PK")}`;
}

function getDisplayPrice(device: Device): string {
  return formatPKR(device.price ?? estimatePrice(device));
}

/**
 * FIX — irrelevant images:
 * Guards against placeholder / marketing entries that have no real specs.
 * A "real" device must have meaningful ram, storage, and a price > 0.
 */
function isRealDevice(device: Device): boolean {
  const ramStr     = device.ram?.toString().toLowerCase()     ?? "";
  const storageStr = device.storage?.toString().toLowerCase() ?? "";
  const hasRam     = ramStr     !== "" && ramStr     !== "n/a";
  const hasStorage = storageStr !== "" && storageStr !== "n/a";
  const hasPrice   = (device.price ?? 0) > 0;
  return hasRam && hasStorage && hasPrice;
}

function mapApiDevice(item: MobileApiDevice): Device {
  return {
    device_name: item.device_name,
    brand_name:  item.brand_name,
    image:       item.image || item.main_photo || item.thumbnail,
    ram:         (item.ram ?? item.memory) as string | undefined,
    storage:     item.storage ?? item.disk,
    price:       item.price,
  };
}

// ─── SellModal (isolated component) ──────────────────────────────────────────

interface SellModalProps {
  device: Device;
  onClose: () => void;
}

/**
 * FIX — modal:
 * Extracted into its own component so its lifecycle is clean.
 * Visibility is driven purely by the parent rendering it or not —
 * no secondary `isModalOpen` boolean that could fall out of sync.
 */
function SellModal({ device, onClose }: SellModalProps) {
  const [form, setForm] = useState<SellForm>({
    brand:       device.brand_name  ?? "",
    model:       device.device_name ?? "",
    condition:   "Good",
    color:       "",
    price:       String(device.price ?? estimatePrice(device)),
    description: `Selling my ${device.brand_name ?? "phone"} ${device.device_name ?? "model"} in excellent condition.`,
    imageUrl:    getImage(device),
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: "idle" });

  const { status: sessionStatus } = useSession();
  const isAuthenticated = sessionStatus === "authenticated";
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Escape key, body scroll-lock, and initial focus — all cleaned up on unmount
  useEffect(() => {
    firstInputRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  /**
   * Backdrop click: close only when the click target IS the backdrop element,
   * not when it bubbles up from the panel inside it.
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isAuthenticated) {
        setSubmitStatus({ type: "error", message: "Please sign in before submitting your listing." });
        return;
      }

      setSubmitStatus({ type: "loading" });

      try {
        const payload = new FormData();
        (Object.keys(form) as (keyof SellForm)[]).forEach((k) =>
          payload.append(k, form[k])
        );

        const res = await fetch("/api/listings", {
          method: "POST",
          credentials: "include",
          body: payload,
        });
        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          setSubmitStatus({
            type: "error",
            message: result?.error ?? "Unable to submit listing. Please sign in and try again.",
          });
        } else {
          setSubmitStatus({ type: "success", message: "✅ Your phone has been submitted for sale." });
          setTimeout(onClose, 1500);
        }
      } catch {
        setSubmitStatus({ type: "error", message: "Network error. Please check your connection and retry." });
      }
    },
    [form, isAuthenticated, onClose]
  );

  const isLoading = submitStatus.type === "loading";

  return (
    <div className="rs-modal" role="presentation" onClick={handleBackdropClick}>
      <div className="rs-modal__backdrop" aria-hidden="true" />

      <div
        className="rs-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-modal-title"
      >
        {/* ── Header ── */}
        <div className="rs-modal__header">
          <div className="rs-modal__header-left">
            <div className="rs-modal__device-thumb">
              <Image
                src={getImage(device)}
                alt={getTitle(device)}
                fill
                sizes="56px"
                className="rs-modal__device-img"
                unoptimized
              />
            </div>
            <div>
              <p className="rs-modal__eyebrow">Sell this phone</p>
              <h2 id="sell-modal-title">{getTitle(device)}</h2>
              <p className="rs-modal__price-hint">{getDisplayPrice(device)} est.</p>
            </div>
          </div>

          <button
            type="button"
            className="rs-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="rs-modal__summary">
          <div className="rs-modal__summary-item">
            <span className="rs-modal__summary-label">Market price</span>
            <span className="rs-modal__summary-value">{getDisplayPrice(device)}</span>
          </div>
          <div className="rs-modal__summary-item">
            <span className="rs-modal__summary-label">Present price</span>
            <span className="rs-modal__summary-value">
              {device.price ? formatPKR(device.price) : "Not available"}
            </span>
          </div>
          <div className="rs-modal__summary-item">
            <span className="rs-modal__summary-label">Condition</span>
            <span className="rs-modal__summary-value">{form.condition}</span>
          </div>
        </div>

        {sessionStatus === "unauthenticated" && (
          <div className="rs-modal__auth-banner">
            <p>Please sign in to list your phone. Your request will be rejected otherwise.</p>
            <button type="button" className="rs-modal__auth-button" onClick={() => signIn()}>
              Sign in now
            </button>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="rs-modal__form" noValidate>
          <div className="rs-modal__grid">
            <div>
              <label htmlFor="brand" className="rs-label--small">Brand</label>
              <input
                ref={firstInputRef}
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="rs-input"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="model" className="rs-label--small">Model</label>
              <input
                id="model"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="rs-input"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="condition" className="rs-label--small">Condition</label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="rs-input"
                required
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="color" className="rs-label--small">Phone Color</label>
              <input
                id="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="rs-input"
                placeholder="e.g. Black, Silver"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="marketPrice" className="rs-label--small">Market price</label>
              <input
                id="marketPrice"
                name="marketPrice"
                value={getDisplayPrice(device)}
                className="rs-input rs-input--readonly"
                disabled
              />
            </div>

            <div>
              <label htmlFor="currentPrice" className="rs-label--small">Present price</label>
              <input
                id="currentPrice"
                name="currentPrice"
                value={device.price ? formatPKR(device.price) : "Not available"}
                className="rs-input rs-input--readonly"
                disabled
              />
            </div>

            <div>
              <label htmlFor="price" className="rs-label--small">Your sell price (PKR)</label>
              <input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="rs-input"
                min="1"
                step="100"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="rs-label--small">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="rs-textarea"
              rows={5}
              required
            />
          </div>

          <input type="hidden" name="imageUrl" value={form.imageUrl} />

          {/* Status feedback — typed discriminated union, no string-null toggle */}
          {submitStatus.type !== "idle" && (
            <p
              role={submitStatus.type === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`rs-modal__message rs-modal__message--${submitStatus.type}`}
            >
              {submitStatus.type === "loading" ? "Submitting…" : submitStatus.message}
            </p>
          )}

          <div className="rs-modal__actions">
            <button
              type="button"
              className="rs-modal__cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rs-modal__submit"
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading ? "Submitting…" : "Submit Sell Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeviceCard ───────────────────────────────────────────────────────────────

interface DeviceCardProps {
  device: Device;
  onSell: (device: Device) => void;
}

const DeviceCard = React.memo(function DeviceCard({ device, onSell }: DeviceCardProps) {
  // Stable callback — doesn't recreate a new arrow fn on every grid render
  const handleClick = useCallback(() => onSell(device), [device, onSell]);

  return (
    <article className="rs-card">
      <div className="rs-card__media">
        <Image
          src={getImage(device)}
          alt={getTitle(device)}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="rs-card__image"
          unoptimized
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className="rs-card__content">
        <p className="rs-card__brand">{device.brand_name}</p>
        <h3 className="rs-card__title">{getTitle(device)}</h3>
        <p className="rs-card__specs">{getSubtitle(device)}</p>
      </div>
      <div className="rs-card__footer">
        <div>
          <span className="rs-card__price">{getDisplayPrice(device)}</span>
          <span className="rs-card__info">PKR</span>
        </div>
        <button
          type="button"
          className="rs-card__button"
          onClick={handleClick}
          aria-label={`Sell ${getTitle(device)}`}
        >
          Sell Now
        </button>
      </div>
    </article>
  );
});

// ─── Root component ───────────────────────────────────────────────────────────

export default function RealSelling() {
  const [devices, setDevices]               = useState<Device[]>(FALLBACK_DEVICES.filter(isRealDevice));
  const [fetchState, setFetchState]         = useState<"loading" | "done" | "error">("loading");
  /**
   * FIX — modal:
   * Single source of truth. `selectedDevice !== null` === modal is open.
   * Removes the old dual-state anti-pattern (`isModalOpen` + `selectedDevice`)
   * which caused the modal to be unresponsive when the states fell out of sync.
   */
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDevices() {
      try {
        const res  = await fetch("/api/mobileapi/devices?search=iphone", { cache: "no-store" });
        const body = (await res.json().catch(() => ({}))) as MobileApiResponse;

        if (cancelled) return;
        if (!res.ok)   throw new Error(body?.error ?? body?.details ?? `HTTP ${res.status}`);
        if (body.error) throw new Error(body.error);

        // FIX — irrelevant images: filter API results the same way as fallbacks
        const fetched = (Array.isArray(body.results) ? body.results : [])
          .slice(0, 20)
          .map(mapApiDevice)
          .filter(isRealDevice);

        const merged = [...fetched, ...FALLBACK_DEVICES.filter(isRealDevice)].slice(0, 20);
        setDevices(merged);
        setFetchState("done");
      } catch (err) {
        if (cancelled) return;
        console.error("RealSelling fetch error:", err);
        setFetchState("error");
        // Fallback already set as initial state; nothing extra needed
      }
    }

    fetchDevices();
    return () => { cancelled = true; }; // prevent setState on unmounted component
  }, []);

  const openModal  = useCallback((device: Device) => setSelectedDevice(device), []);
  const closeModal = useCallback(() => setSelectedDevice(null), []);

  return (
    <section className="rs-root">
      {/* Heading */}
      <div className="rs-heading-wrap">
        <div>
          <p className="rs-label">Top Selling Mobile Phones</p>
          <h2 className="rs-heading">Trending phones with live device images</h2>
        </div>
      </div>

      {/* Status bar */}
      <div className="rs-toolbar" role="status" aria-live="polite">
        {fetchState === "loading" && (
          <span className="rs-badge rs-badge--info">Refreshing live phones…</span>
        )}
        {fetchState === "error" && (
          <span className="rs-badge rs-badge--warning">
            Unable to load live phones; showing sample devices instead.
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="rs-card-grid">
        {devices.map((device, index) => (
          <DeviceCard
            key={`${device.brand_name}-${device.device_name}-${index}`}
            device={device}
            onSell={openModal}
          />
        ))}
      </div>

      {/*
       * FIX — modal:
       * Rendered conditionally from a single state value.
       * When selectedDevice is set → SellModal mounts with fresh state.
       * When closeModal sets it to null → SellModal unmounts cleanly.
       * No stale `isModalOpen` flag to mismanage.
       */}
      {selectedDevice && (
        <SellModal device={selectedDevice} onClose={closeModal} />
      )}
    </section>
  );
}