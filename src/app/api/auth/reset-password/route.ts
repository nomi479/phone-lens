import { NextResponse } from "next/server";
import { updatePassword } from "@/lib/user-store";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, retypePassword } = body;

  if (!email || !password || !retypePassword) {
    return NextResponse.json(
      { error: "Email and both password fields are required." },
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
    await updatePassword(email, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    if (message.includes("does not exist")) {
      return NextResponse.json(
        { error: "Email does not exist. Please create an account." },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
