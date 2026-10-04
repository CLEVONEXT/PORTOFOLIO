import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SITE } from "@/lib/constants";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — ${SITE.owner}`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    "Portofolio personal Moh. Arsyil Afif Mdani — Software Engineering. Editorial, minimalis, dan elegan.",
  keywords: [
    "Clevonext",
    "Portfolio",
    "Software Engineering",
    "Moh. Arsyil Afif Mdani",
    "Next.js",
    "Web Developer",
  ],
  authors: [{ name: SITE.owner }],
  creator: SITE.owner,
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    title: `${SITE.brand} — ${SITE.owner}`,
    description: "Editorial portfolio of a software engineering student.",
    url: SITE.url,
    siteName: SITE.brand,
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — ${SITE.owner}`,
    description: "Editorial portfolio of a software engineering student.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} font-sans`}>
        {children}
        <ServiceWorkerRegistrar />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(17,17,20,0.85)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(18px)",
              color: "#f2efe9",
            },
          }}
        />
      </body>
    </html>
  );
}