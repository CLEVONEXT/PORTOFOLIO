import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SITE } from "@/lib/constants";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import { ThemeProvider } from "@/components/layout/ThemeToggle";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: `${SITE.brand} — ${SITE.owner}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — ${SITE.owner}`,
    description: "Editorial portfolio of a software engineering student.",
    images: ["/og-image.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon.jpeg", type: "image/jpeg", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.jpeg", type: "image/jpeg", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.jpeg", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Applies the saved theme before first paint to avoid a flash.
  const themeScript = `
    (function(){try{var t=localStorage.getItem('clevonext:theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();
  `;

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider>
        {children}
        </ThemeProvider>
        <ServiceWorkerRegistrar />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1E1E1E",
              border: "1px solid #333333",
              color: "#E0E0E0",
            },
          }}
        />
      </body>
    </html>
  );
}