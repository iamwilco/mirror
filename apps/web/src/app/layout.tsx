import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Intersect Mirror",
  description: "Radical transparency dashboard for Intersect MBO",
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
        {children}
        <footer className="border-t border-white/10 bg-black/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-xs uppercase tracking-[0.3em] text-white/60 md:flex-row md:items-center md:justify-between">
            <p className="text-white/50">Intersect Mirror · Transparency Index</p>
            <nav className="flex flex-wrap items-center gap-6 text-[10px]">
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
              <Link className="transition hover:text-white" href="/#budget">
                Budget
              </Link>
              <Link className="transition hover:text-white" href="/#network">
                Network
              </Link>
              <Link className="transition hover:text-white" href="/about">
                About
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
