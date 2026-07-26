import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.aetherissolutions.com"),
  title: {
    default: "Aetheris UI — premium modules for sites that sell",
    template: "%s · Aetheris UI",
  },
  description:
    "Immersive, installable UI modules for Next.js. Motion, scroll, and shader components you add in one command — light-first, brand-tokenized, built in public by Aetheris.",
  openGraph: {
    title: "Aetheris UI — premium modules for sites that sell",
    description:
      "Immersive, installable UI modules for Next.js — motion, scroll, and shader components in one command.",
    url: "https://ui.aetherissolutions.com",
    siteName: "Aetheris UI",
    images: [{ url: "/og.png", width: 2400, height: 1260 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aetheris UI — premium modules for sites that sell",
    description:
      "Immersive, installable UI modules for Next.js — motion, scroll, and shader components in one command.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
