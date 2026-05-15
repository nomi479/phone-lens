import { NextResponse } from "next/server";
import { createUser } from "@/lib/user-store";

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, email, password, retypePassword, phone } = body;

  if (!firstName || !lastName || !email || !password || !retypePassword) {
    return NextResponse.json(
      { error: "All required fields must be filled in." },
      { status: 400 }
    );
  }

  if (password !== retypePassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 }
    );
  }

  try {
    await createUser({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 }
    );
  }
}
