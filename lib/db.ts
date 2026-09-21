// lib/db.ts — Conexión a la base propia del sitio (Neon), SEPARADA del
// Postgres del ERP (ver PLAN_WEB_PUBLICA.md en Dinaseg-ERP: este sitio nunca
// tiene ni debe tener credenciales del Postgres del ERP).
//
// Mientras Carlos no haya creado la cuenta de Neon y pasado DB_URL, el pool
// queda en null y las funciones que dependen de la base degradan solas (ver
// app/api/quotes/route.ts) en vez de tirar el sitio abajo.
//
// Nombre sin prefijo "PUBLIC_" a propósito: Vercel rechaza cualquier
// variable "PUBLIC_*" como tipo Secret (la trata como si tuviera que ser
// visible en el navegador) — en Next.js lo que se expone al cliente es
// "NEXT_PUBLIC_*", no "PUBLIC_*", pero Vercel igual lo bloquea por el
// nombre. "DB_URL" evita la confusión y queda privada sin problema.
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!process.env.DB_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DB_URL });
  }
  return pool;
}

export function dbConfigurada(): boolean {
  return Boolean(process.env.DB_URL);
}

// Se agregó `ficha_tecnica_url` a `public_products` el 20-sep-2026 (ver
// server/public-sync.js en Dinaseg-ERP, que trae la misma migración
// `ADD COLUMN IF NOT EXISTS`). Ese ALTER solo corre cuando el ERP ejecuta la
// sincronización — si el sitio se despliega ANTES de esa corrida, la
// columna no existe todavía y las consultas de lib/products.ts fallan por
// completo (no solo la ficha técnica: el catch genérico devolvía []  y
// desaparecían TODOS los productos del sitio, con o sin foto — bug real
// visto en producción el 20-sep-2026). Este sitio también corre el mismo
// ALTER, idempotente y barato, así ninguno de los dos deploys depende del
// orden en que se hagan.
let schemaLista = false;
export async function ensurePublicProductsSchema(): Promise<void> {
  if (schemaLista) return;
  const p = getPool();
  if (!p) return;
  await p.query(`ALTER TABLE IF EXISTS public_products ADD COLUMN IF NOT EXISTS ficha_tecnica_url TEXT`);
  schemaLista = true;
}
