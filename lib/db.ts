// lib/db.ts — Conexión a la base propia del sitio (Neon), SEPARADA del
// Postgres del ERP (ver PLAN_WEB_PUBLICA.md en Dinaseg-ERP: este sitio nunca
// tiene ni debe tener credenciales del Postgres del ERP).
//
// Mientras Carlos no haya creado la cuenta de Neon y pasado PUBLIC_DB_URL,
// el pool queda en null y las funciones que dependen de la base degradan
// solas (ver app/api/quotes/route.ts) en vez de tirar el sitio abajo.
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!process.env.PUBLIC_DB_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.PUBLIC_DB_URL });
  }
  return pool;
}

export function dbConfigurada(): boolean {
  return Boolean(process.env.PUBLIC_DB_URL);
}
