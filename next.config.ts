import type { NextConfig } from "next";

/** Arquivos que quase nunca mudam ficam no cache do navegador (e de um CDN, se houver): menos tráfego a cada visita. */
const WEEK = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/historia/:path*", headers: [{ key: "Cache-Control", value: WEEK }] },
      { source: "/programas/:path*", headers: [{ key: "Cache-Control", value: WEEK }] },
    ];
  },
};

export default nextConfig;
