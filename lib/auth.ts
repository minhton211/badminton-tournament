import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "organizer_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
function secret() {
  const value = process.env.ORGANIZER_SESSION_SECRET;
  if (!value) throw new Error("ORGANIZER_SESSION_SECRET must be set.");
  return value;
}
function token() { return createHmac("sha256", secret()).update("organizer").digest("hex"); }

export function validOrganizerPassword(password: string) {
  const configured = process.env.ORGANIZER_PASSWORD;
  if (!configured || password.length !== configured.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(configured));
}
export function setOrganizerSession() {
  // Persist the signed session, not the password. The browser can restore this
  // cookie after it closes, while the password remains unavailable to scripts.
  cookies().set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}
export function isOrganizer() {
  const value = cookies().get(COOKIE)?.value;
  const expected = token();
  if (!value || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
export function requireOrganizer() { if (!isOrganizer()) throw new Error("Unauthorized"); }
