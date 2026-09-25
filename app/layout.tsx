import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friendly Badminton Tournament",
  description: "Live scores, courts, brackets, and Elo for a friendly badminton day."
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
