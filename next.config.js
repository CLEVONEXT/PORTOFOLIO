/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Desktop (Electron) + Capacitor need a fully static-friendly output option.
  // Web deploys normally; toggle with BUILD_TARGET=desktop|mobile if needed.
  output: process.env.BUILD_TARGET === "desktop" ? "standalone" : undefined,

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
