import { NextResponse } from "next/server";
import { setOrganizerSession, validOrganizerPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (typeof password !== "string" || !validOrganizerPassword(password)) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  setOrganizerSession();
  return NextResponse.json({ ok: true });
}
