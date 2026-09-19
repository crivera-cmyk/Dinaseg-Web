import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos reales de producto vienen del puente público del ERP
    // (GET /api/public/product-photo/:sku, sin auth a propósito) mientras
    // no esté lista la migración a Cloudflare R2 de Fase 2 — ver
    // lib/products.ts y PLAN_WEB_PUBLICA.md en Dinaseg-ERP.
    remotePatterns: [{ protocol: "https", hostname: "erp.dinaseg.cl", pathname: "/api/public/product-photo/**" }],
  },
};

export default nextConfig;
