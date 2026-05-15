import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// ─── Config ───────────────────────────────────────────────────────────────────

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY;

const aiClient = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const MODEL_FALLBACK_CHAIN = [
  // try the user-provided preview model first
  "gemini-3-flash-preview",
  // 2.0 generation — available on free tier as of 2025
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  // 1.5 generation — versioned IDs are more stable than aliases on free tier
  "gemini-1.5-flash-8b-001",
  "gemini-1.5-flash-001",
] as const;

const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 1500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isTransientError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes("503") || m.includes("429") ||
    m.includes("overloaded") || m.includes("high demand") ||
    m.includes("rate limit") || m.includes("quota exceeded")
  );
}

function isHardError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message;
  // 404 = model doesn't exist for this key/version
  // 400 = bad request (won't fix itself with retry)
  // 401/403 = auth/permission — key restriction or billing issue
  return (
    m.includes("404") || m.includes("400") ||
    m.includes("401") || m.includes("403") ||
    m.includes("API_KEY_INVALID") || m.includes("PERMISSION_DENIED")
  );
}

function normalizePriceText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const hasPKR = /\b(PKR|Rs\.?|₹|رپ|رُپَیہ)\b/i.test(trimmed);
  const hasDollar = /^\s*\$|\bUSD\b|\bdollars?\b/i.test(trimmed);

  if (hasPKR) {
    return trimmed.replace(/^\s*(PKR|Rs\.?|₹)\s*/i, "PKR ").trim();
  }

  const cleaned = trimmed.replace(/^\s*\$|\bUSD\b|\bdollars?\b/gi, "").trim();
  const numeric = cleaned.replace(/,/g, "");

  if (/^[0-9]+(\.[0-9]+)?$/.test(numeric)) {
    return `PKR ${Number(numeric).toLocaleString("en-PK", {
      maximumFractionDigits: numeric.includes(".") ? 2 : 0,
    })}`;
  }

  if (hasDollar) {
    return `PKR ${cleaned}`;
  }

  return /[0-9]/.test(trimmed) ? `PKR ${trimmed}` : trimmed;
}

function normalizeTextField(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^(unknown|n\/a|not available|none|unspecified)$/i.test(trimmed)) return undefined;
  return trimmed;
}

function cleanSummary(value: unknown): string | undefined {
  const text = normalizeTextField(value);
  if (!text) return undefined;
  if (/^\s*[\[{].*[\]}]\s*$/s.test(text)) return undefined;
  return text;
}

function extractLabeledFields(outputText: string) {
  const getField = (keys: string[]) => {
    for (const key of keys) {
      const pattern = new RegExp(`${key}\\s*[:\\-–]?\\s*([^\\n\\r]+)`, "i");
      const match = outputText.match(pattern);
      if (match?.[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, "").trim();
      }
    }
    return undefined;
  };

  return {
    brand: getField(["brand", "make"]),
    model: getField(["model", "device", "phone"]),
    specifications: getField(["specifications", "specs", "configuration"]),
    screenSize: getField(["screen size", "display size", "size"]),
    condition: getField(["condition", "state", "physical condition"]),
    color: getField(["color", "colour"]),
    estimatedNewPrice: getField(["estimated new price", "new price", "price when new"]),
    estimatedCurrentPrice: getField(["estimated current price", "current price", "market price", "selling price"]),
    summary: getField(["summary", "notes", "description"]),
    confidence: getField(["confidence", "certainty", "confidence level"]),
  };
}

// ─── Core generation with fallback ───────────────────────────────────────────

async function generateWithFallback(
  prompt: string,
  base64Image: string,
  mimeType: string
): Promise<{ text: string; modelName: string }> {
  if (!aiClient) throw new Error("Gemini client is not initialised.");

  const triedErrors: string[] = [];

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { mimeType, data: base64Image } },
                { text: prompt },
              ],
            },
          ],
          config: {
            maxOutputTokens: 1024,
            temperature: 0.2,
          },
        });

        const text = response.text?.trim() ?? "";

        console.log(`[detectphone] ✅ model=${modelName} attempt=${attempt}`);
        return { text, modelName };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[detectphone] ❌ model=${modelName} attempt=${attempt}: ${msg}`);
        triedErrors.push(`${modelName} (attempt ${attempt}): ${msg}`);

        if (isHardError(err)) {
          // No point retrying — skip straight to next model
          break;
        }

        if (isTransientError(err) && attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }

        break;
      }
    }
  }

  const allAre404 = triedErrors.every((e) => e.includes("404"));
  const hint = allAre404
    ? "\n\n⚠️  ALL models returned 404. This almost always means your API key " +
      "has HTTP-referrer or IP restrictions set in Google Cloud Console that " +
      "block server-side requests.\n" +
      "Fix: console.cloud.google.com → APIs & Services → Credentials → " +
      "Edit key → Application restrictions → None (or IP addresses).\n" +
      "Also verify: API restrictions must include 'Generative Language API'."
    : "";

  throw new Error(
    `All Gemini models failed.${hint}\n\nDetails:\n` +
      triedErrors.map((e) => `  • ${e}`).join("\n")
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  if (!GEMINI_API_KEY || !aiClient) {
    return NextResponse.json(
      {
        error:
          "Google Gemini API key is not configured. " +
          "Set GOOGLE_GEMINI_API_KEY in your .env.local file.",
      },
      { status: 500 }
    );
  }

  // ── Parse form data ──────────────────────────────────────────────────────
  const formData = await request.formData();
  const image     = formData.get("image");
  const userPrompt = String(
    formData.get("prompt") ??
      "Identify this phone. Provide brand, model, specs, screen size, " +
      "condition, colour, current market price, and the price when new in Pakistani Rupees (PKR)."
  );

  if (!image || !(image instanceof File)) {
    return NextResponse.json(
      { error: "Please upload a valid phone image." },
      { status: 400 }
    );
  }

  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Uploaded file must be an image." },
      { status: 400 }
    );
  }

  // ── Save upload ──────────────────────────────────────────────────────────
  const buffer    = Buffer.from(await image.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "detectphone");
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = path.extname(image.name) || ".jpg";
  const fileName  = `detectphone-${Date.now()}${extension}`;
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  const base64Image = buffer.toString("base64");

  // ── Build prompt ─────────────────────────────────────────────────────────
  const analysisPrompt = `You are a specialist mobile phone analyst.
Analyse the phone in the image and return a single JSON object with EXACTLY these fields:

{
  "brand": "string",
  "model": "string",
  "specifications": "string",
  "screenSize": "string",
  "condition": "string",
  "color": "string",
  "estimatedNewPrice": "string",
  "estimatedCurrentPrice": "string",
  "summary": "string",
  "confidence": "high | medium | low"
}

STRICT RULES:
- Preferred output is a JSON object only — no markdown, no code fences, no explanation.
- If you cannot return valid JSON, provide a clear plain-text answer with each field labelled on its own line.
- Use "unknown" for any field you cannot determine.
- Always return price values in Pakistani Rupees (PKR). Use PKR or Rs. formatting for price fields.
- Attempt to identify the phone from any photo style: front, back, side, screen-on, hand-held, partial device, case, or reflection.
- Use only the visible phone details in the image.
- ${userPrompt}`;

  // ── Call Gemini ──────────────────────────────────────────────────────────
  try {
    const { text: outputText, modelName } = await generateWithFallback(
      analysisPrompt,
      base64Image,
      image.type
    );

    const cleaned = outputText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedResult: Record<string, unknown> | null = null;
    try {
      parsedResult = JSON.parse(cleaned || "{}");
    } catch {
      parsedResult = null;
    }

    const fallbackResult = parsedResult ?? extractLabeledFields(outputText);
    const normalizedResult = {
      brand: normalizeTextField(fallbackResult.brand),
      model: normalizeTextField(fallbackResult.model),
      specifications: normalizeTextField(fallbackResult.specifications),
      screenSize: normalizeTextField(fallbackResult.screenSize),
      condition: normalizeTextField(fallbackResult.condition),
      color: normalizeTextField(fallbackResult.color),
      estimatedNewPrice: normalizePriceText(fallbackResult.estimatedNewPrice),
      estimatedCurrentPrice: normalizePriceText(fallbackResult.estimatedCurrentPrice),
      summary:
        cleanSummary(fallbackResult.summary) ??
        cleanSummary(outputText) ??
        undefined,
      confidence: normalizeTextField(fallbackResult.confidence) ?? "low",
    };

    return NextResponse.json({
      previewUrl: `/uploads/detectphone/${fileName}`,
      modelName,
      modelOutput: outputText,
      parsedResult: normalizedResult,
    });

  } catch (error: unknown) {
    console.error("/api/detectphone fatal error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while analysing the phone image.";

    const status =
      message.includes("503") || message.includes("unavailable") ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}