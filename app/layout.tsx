import "./globals.css";
import "./adjustments.css";
import "./fixes.css";
import "./organizer/slot-groups.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { LocaleProvider } from "./LocaleProvider";

const notoSans=Noto_Sans({subsets:["latin","vietnamese"],variable:"--font-noto",display:"swap"});

export const metadata: Metadata = {
  title: "Friendly Badminton Tournament",
  description: "Live scores, courts, brackets, and Elo for a friendly badminton day."
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={notoSans.variable}><LocaleProvider>{children}</LocaleProvider></body></html>;
}
