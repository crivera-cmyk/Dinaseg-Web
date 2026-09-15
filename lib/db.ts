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
