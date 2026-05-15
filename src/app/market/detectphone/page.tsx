"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

type AnalysisResult = {
  brand?: string;
  model?: string;
  specifications?: string;
  screenSize?: string;
  condition?: string;
  color?: string;
  estimatedNewPrice?: string;
  estimatedCurrentPrice?: string;
  summary?: string;
};

export default function DetectPhonePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState(
    "Please identify this phone and provide brand, model, specifications, size, condition, phone color, estimated new price and current selling price in Pakistani Rupees (PKR). Use the phone image even if it is hand-held, angled, front-facing, or only partially visible."
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const instructions = useMemo(
    () => [
      "Upload any phone photo: front, back, side, hand-held, or partial view.",
      "Get AI-powered valuation and condition scoring for the resale marketplace.",
      "Receive model, specs, screen size, condition, color, and current price insight.",
    ],
    []
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResult(null);
    setError("");
    setStatus("idle");

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl("");
      if (file) {
        setError("Please upload a valid image file.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    setError("");

    if (!imageFile) {
      setError("Please choose a phone image before analyzing.");
      return;
    }

    const payload = new FormData();
    payload.append("image", imageFile);
    payload.append("prompt", prompt);

    setStatus("loading");

    try {
      const response = await fetch("/api/detectphone", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to analyze the phone image.");
      }

      setStatus("success");
      setResult(data.parsedResult ?? {
        brand: undefined,
        model: undefined,
        specifications: undefined,
        screenSize: undefined,
        condition: undefined,
        color: undefined,
        estimatedNewPrice: undefined,
        estimatedCurrentPrice: undefined,
        summary: undefined,
      });
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
    } catch (err) {
      setStatus("error");
      setError(String(err ?? "Something went wrong. Please try again."));
    }
  };

  const formatValue = (value?: string, fallback = "Not detected") =>
    value && value.trim() ? value : fallback;

  const formatPrice = (value?: string) =>
    value && value.trim() ? value : "Awaiting clearer photo for price";

  const formatSummary = (value?: string) =>
    value && value.trim()
      ? value
      : "Summary unavailable. Try a sharper phone image or a different angle.";

  return (
    <main className="dp-root">
      <section className="dp-hero">
        <div className="dp-copy">
          <span className="dp-eyebrow">AI Marketplace Valuation</span>
          <h1 className="dp-title">Upload a phone image and get instant resale intelligence</h1>
          <p className="dp-description">
            A modern artificial intelligence marketplace engine analyzes your phone photo and provides
            brand, model, condition, color, and resale price insight for buyers and sellers.
          </p>
          <div className="dp-points">
            {instructions.map((point) => (
              <div key={point} className="dp-point">
                <span className="dp-point-dot" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="dp-panel">
          <form className="dp-form" onSubmit={handleSubmit}>
            <label className="dp-label" htmlFor="phone-image">
              Upload phone image
            </label>
            <input
              id="phone-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="dp-file-input"
            />

            <label className="dp-label" htmlFor="prompt">
              Your request
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="dp-textarea"
              placeholder="Describe what you want the AI to extract from the phone image."
            />

            {error ? <p className="dp-error">{error}</p> : null}
            <button type="submit" className="dp-button" disabled={status === "loading"}>
              {status === "loading" ? "Analyzing image…" : "Generate AI Valuation"}
            </button>
          </form>
        </aside>
      </section>

      {previewUrl ? (
        <section className="dp-preview-card">
          <div className="dp-preview-label">Preview</div>
          <div className="dp-preview-image" aria-label="Phone preview">
            <Image
              src={previewUrl}
              alt="Phone preview"
              fill
              style={{ objectFit: "contain", objectPosition: "center", borderRadius: "1.75rem" }}
              unoptimized
            />
          </div>
        </section>
      ) : null}

      {status === "success" && result ? (
        <section className="dp-results">
          <div className="dp-results-header">
            <div>
              <p className="dp-eyebrow">Valuation ready</p>
              <h2>Resale summary and pricing guidance</h2>
            </div>
          </div>

          <div className="dp-grid">
            <div className="dp-card">
              <p className="dp-card-label">Brand</p>
              <p className="dp-card-value">{formatValue(result.brand)}</p>
            </div>
            <div className="dp-card">
              <p className="dp-card-label">Model</p>
              <p className="dp-card-value">{formatValue(result.model)}</p>
            </div>
            <div className="dp-card">
              <p className="dp-card-label">Condition</p>
              <p className="dp-card-value">{formatValue(result.condition)}</p>
            </div>
            <div className="dp-card">
              <p className="dp-card-label">Phone color</p>
              <p className="dp-card-value">{formatValue(result.color)}</p>
            </div>
            <div className="dp-card dp-card-wide">
              <p className="dp-card-label">Screen size</p>
              <p className="dp-card-value">{formatValue(result.screenSize)}</p>
            </div>
            <div className="dp-card dp-card-wide">
              <p className="dp-card-label">Estimated new price (PKR)</p>
              <p className="dp-card-value">{formatPrice(result.estimatedNewPrice)}</p>
            </div>
            <div className="dp-card dp-card-wide">
              <p className="dp-card-label">Estimated current price (PKR)</p>
              <p className="dp-card-value">{formatPrice(result.estimatedCurrentPrice)}</p>
            </div>
          </div>

          {!result.estimatedNewPrice && !result.estimatedCurrentPrice ? (
            <div className="dp-note">
              Pricing guidance is pending. Upload a sharper or more complete phone image for a better estimate.
            </div>
          ) : null}

          <div className="dp-section">
            <h3>Specifications</h3>
            <p className="dp-text-block">{formatValue(result.specifications, "No additional specs were extracted.")}</p>
          </div>

          <div className="dp-section">
            <h3>Summary</h3>
            <p className="dp-text-block">{formatSummary(result.summary)}</p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
