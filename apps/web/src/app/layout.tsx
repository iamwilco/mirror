import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intersect Mirror — Cardano Transparency Dashboard",
  description:
    "Radical transparency dashboard for Intersect MBO. Track budgets, governance, people, and influence across the Cardano ecosystem.",
  openGraph: {
    title: "Intersect Mirror — Cardano Transparency Dashboard",
    description:
      "Track ₳263M+ in treasury flows, 39 on-chain proposals, 7 board members, and 9 committees. See what is verified, what is missing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <Header />
        {children}
        <footer className="border-t border-white/10 bg-black/30">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Intersect Mirror</p>
                <p className="max-w-sm text-sm text-white/40">
                  Independent transparency index for Intersect MBO.
                  Not affiliated with Intersect, IOG, EMURGO, or Cardano Foundation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
                <Link className="text-white/40 transition hover:text-white" href="/history">History</Link>
                <Link className="text-white/40 transition hover:text-white" href="/hierarchy">Power Map</Link>
                <Link className="text-white/40 transition hover:text-white" href="/accountability">Accountability</Link>
                <Link className="text-white/40 transition hover:text-white" href="/operations">Operations</Link>
                <Link className="text-white/40 transition hover:text-white" href="/budget">Budget</Link>
                <Link className="text-white/40 transition hover:text-white" href="/members">People</Link>
                <Link className="text-white/40 transition hover:text-white" href="/elections">Elections</Link>
                <Link className="text-white/40 transition hover:text-white" href="/suggestions">Suggestions</Link>
                <Link className="text-white/40 transition hover:text-white" href="/sources">Sources</Link>
                <Link className="text-white/40 transition hover:text-white" href="/contribute">Contribute</Link>
              </div>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 text-[11px] text-white/25">
              All data is sourced and verifiable. No speculation. No affiliation. Open source.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
