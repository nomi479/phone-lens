"use client";
import React, { useState, useEffect, useCallback } from "react";
import { store, StoreType } from "../data/store";

const MARKETS = ["All", ...Array.from(new Set(store.map((s) => s.market)))];

function getCardsPerPage(): number {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.3 2.8,11 3.5,7.5 1,5 4.5,4.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.21 3.38 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.27 5.27l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

type StoreCardProps = { item: StoreType };

function StoreCard({ item }: StoreCardProps) {
  const ratingColor =
    item.rating >= 4.5
      ? { bg: "#E1F5EE", text: "#0F6E56" }
      : item.rating >= 4.2
      ? { bg: "#E6F1FB", text: "#185FA5" }
      : { bg: "#F1EFE8", text: "#5F5E5A" };

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[15px] font-semibold leading-snug text-gray-800">
          {item.name}
        </h2>
        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: ratingColor.bg, color: ratingColor.text }}
        >
          <StarIcon />
          {item.rating.toFixed(1)}
        </span>
      </div>

      {/* Market pill */}
      <span className="mt-2 inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-medium text-blue-700">
        {item.market}
      </span>

      {/* Meta */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-400">
            <MapPinIcon />
          </span>
          {item.area}, {item.city}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-400">
            <PhoneIcon />
          </span>
          {item.phone}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={item.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View on map
        </a>
        <a
          href={`tel:${item.phone}`}
          className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Call
        </a>
      </div>
    </div>
  );
}

export default function Store() {
  const [activeMarket, setActiveMarket] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const update = () => setCardsPerPage(getCardsPerPage());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filtered = activeMarket === "All" ? store : store.filter((s) => s.market === activeMarket);
  const totalPages = Math.ceil(filtered.length / cardsPerPage);
  const pageItems = filtered.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage);

  const handleMarket = (market: string) => {
    setActiveMarket(market);
    setCurrentPage(0);
  };

  const move = useCallback(
    (dir: number) => {
      setCurrentPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir)));
    },
    [totalPages]
  );

  const rangeStart = currentPage * cardsPerPage + 1;
  const rangeEnd = Math.min((currentPage + 1) * cardsPerPage, filtered.length);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-10">
      {/* Page heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Our Exclusive Stores
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Find the nearest mobile store in Lahore
        </p>
      </div>

      {/* Market filter tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {MARKETS.map((market) => (
          <button
            key={market}
            onClick={() => handleMarket(market)}
            className={`rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeMarket === market
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {market}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((item) => (
          <StoreCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex flex-col items-center gap-4">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentPage
                  ? "w-5 h-2 bg-blue-600"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {/* Nav row */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => move(-1)}
            disabled={currentPage === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          <span className="text-sm text-gray-500">
            {rangeStart}–{rangeEnd} of {filtered.length} stores
          </span>

          <button
            onClick={() => move(1)}
            disabled={currentPage >= totalPages - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}