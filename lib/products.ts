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
// Mientras esa tabla no exista o DB_URL no esté configurada, esta
// función devuelve [] y las páginas de familia muestran el contenido
// institucional (intro + destacados) en vez de una grilla vacía o rota.
import { getPool } from "./db";

export type PublicProduct = {
  sku: string;
  nombre: string;
  familia: string;
  descripcion: string | null;
  imagenUrl: string | null;
};

function mapRow(r: {
  sku: string;
  nombre: string;
  familia: string;
  descripcion: string | null;
  imagen_url: string | null;
}): PublicProduct {
  return {
    sku: r.sku,
    nombre: r.nombre,
    familia: r.familia,
    descripcion: r.descripcion,
    imagenUrl: r.imagen_url,
  };
}

export async function getProductsByFamily(slug: string): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool) return [];

  try {
    const { rows } = await pool.query(
      `SELECT sku, nombre, familia, descripcion, imagen_url FROM public_products WHERE familia = $1 ORDER BY nombre LIMIT 24`,
      [slug]
    );
    return rows.map(mapRow);
  } catch (e) {
    // La tabla puede no existir todavía (public-sync.js sin implementar) —
    // no tirar la página abajo por eso, solo avisar en el log del servidor.
    console.warn("[products] No se pudo leer public_products:", (e as Error).message);
    return [];
  }
}

/** Para el comparador (app/comparar) — trae hasta 4 productos por SKU exacto. */
export async function getProductsBySkus(skus: string[]): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool || skus.length === 0) return [];

  try {
    const { rows } = await pool.query(
      `SELECT sku, nombre, familia, descripcion, imagen_url FROM public_products WHERE sku = ANY($1) LIMIT 4`,
      [skus]
    );
    return rows.map(mapRow);
  } catch (e) {
    console.warn("[products] No se pudo leer public_products por sku:", (e as Error).message);
    return [];
  }
}

/**
 * Para la sección "Productos destacados" del home: un puñado de productos
 * de las familias de mayor volumen (ver PLAN_WEB_PUBLICA.md, hallazgo
 * 15-sep-2026 — Vestuario/Calzado/Manos son las de más catálogo real).
 * No hay flag de "destacado" en la base — es una selección representativa,
 * no curada a mano, hasta que exista ese campo.
 */
export async function getFeaturedProducts(): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool) return [];

  try {
    const { rows } = await pool.query(`
      SELECT sku, nombre, familia, descripcion, imagen_url FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY familia ORDER BY nombre) AS rn
        FROM public_products
        WHERE familia IN ('vestuario', 'calzado-seguridad', 'proteccion-manos', 'cascos-seguridad')
      ) t
      WHERE rn <= 2
      ORDER BY familia, nombre
    `);
    return rows.map(mapRow);
  } catch (e) {
    console.warn("[products] No se pudo leer destacados:", (e as Error).message);
    return [];
  }
}
