import { NextResponse } from "next/server";

const MOBILE_API_BASE = "https://api.mobileapi.dev/devices/search/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "iphone";
  const apiKey = process.env.MOBILE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing server API key for MobileAPI.dev" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    name: search,
    key: apiKey,
  });
  const url = `${MOBILE_API_BASE}?${params.toString()}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Authorization": `Token ${apiKey}`,
  };

  try {
    const response = await fetch(url, { headers, next: { revalidate: 60 } });
    const message = await response.text();

    if (!response.ok) {
      let parsedMessage: unknown = message;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        // keep raw text
      }

      return NextResponse.json(
        {
          error: "Failed to fetch device data",
          status: response.status,
          details: parsedMessage,
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(message);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("/api/mobileapi/devices error:", error);
    return NextResponse.json(
      { error: "Unable to load device data", details: `${error}` },
      { status: 500 }
    );
  }
}
