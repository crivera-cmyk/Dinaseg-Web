import { NextRequest, NextResponse } from "next/server";
import { getProductsBySkus } from "@/lib/products";

// GET /api/products?skus=sku1,sku2 — usado por el comparador (client
// component, no puede pegarle directo a Neon) para traer nombre/familia/
// marca de los SKUs guardados en localStorage. Solo lectura, sin datos
// sensibles (nunca costo/precio, ver server/public-sync.js en Dinaseg-ERP).
export async function GET(req: NextRequest) {
  const skusParam = req.nextUrl.searchParams.get("skus") || "";
  const skus = skusParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (skus.length === 0) return NextResponse.json({ productos: [] });

  const productos = await getProductsBySkus(skus);
  return NextResponse.json({ productos });
}
