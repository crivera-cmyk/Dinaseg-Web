// lib/products.ts — Lee productos de la base propia (Neon), sincronizados
// desde Dinaseg-ERP por `server/public-sync.js` (ver PLAN_WEB_PUBLICA.md,
// Dinaseg-ERP — ese script todavía no existe, es tarea separada en ese repo).
//
// Contrato esperado de la tabla `public_products` que ese script debe
// llenar (columnas mínimas que esta función necesita):
//   sku          TEXT PRIMARY KEY
//   nombre       TEXT NOT NULL
//   familia      TEXT NOT NULL   -- uno de los 14 slugs de lib/families.ts
//   descripcion  TEXT
//   imagen_url   TEXT            -- NULL si no hay foto todavía (se usa placeholder)
//
// Mientras esa tabla no exista o PUBLIC_DB_URL no esté configurada, esta
// función devuelve [] y las páginas de familia muestran el contenido
// institucional (intro + destacados) en vez de una grilla vacía o rota.
import { getPool } from "./db";

export type PublicProduct = {
  sku: string;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
};

export async function getProductsByFamily(slug: string): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool) return [];

  try {
    const { rows } = await pool.query(
      `SELECT sku, nombre, descripcion, imagen_url FROM public_products WHERE familia = $1 ORDER BY nombre LIMIT 24`,
      [slug]
    );
    return rows.map((r) => ({
      sku: r.sku,
      nombre: r.nombre,
      descripcion: r.descripcion,
      imagenUrl: r.imagen_url,
    }));
  } catch (e) {
    // La tabla puede no existir todavía (public-sync.js sin implementar) —
    // no tirar la página abajo por eso, solo avisar en el log del servidor.
    console.warn("[products] No se pudo leer public_products:", (e as Error).message);
    return [];
  }
}
