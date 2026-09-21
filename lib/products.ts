// lib/products.ts — Lee productos de la base propia (Neon), sincronizados
// desde Dinaseg-ERP por `server/public-sync.js` (ver PLAN_WEB_PUBLICA.md,
// Dinaseg-ERP — ese script todavía no existe, es tarea separada en ese repo).
//
// Contrato esperado de la tabla `public_products` que ese script debe
// llenar (columnas mínimas que esta función necesita):
//   sku                TEXT PRIMARY KEY
//   nombre             TEXT NOT NULL
//   familia            TEXT NOT NULL   -- uno de los 14 slugs de lib/families.ts
//   descripcion        TEXT
//   imagen_url         TEXT            -- NULL si no hay foto todavía (se usa placeholder)
//   ficha_tecnica_url  TEXT            -- NULL si no hay PDF de ficha técnica cargado
//
// Mientras esa tabla no exista o DB_URL no esté configurada, esta
// función devuelve [] y las páginas de familia muestran el contenido
// institucional (intro + destacados) en vez de una grilla vacía o rota.
import { getPool, ensurePublicProductsSchema } from "./db";

export type PublicProduct = {
  sku: string;
  nombre: string;
  familia: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fichaTecnicaUrl: string | null;
};

function mapRow(r: {
  sku: string;
  nombre: string;
  familia: string;
  descripcion: string | null;
  imagen_url: string | null;
  ficha_tecnica_url: string | null;
}): PublicProduct {
  return {
    sku: r.sku,
    nombre: r.nombre,
    familia: r.familia,
    descripcion: r.descripcion,
    imagenUrl: r.imagen_url,
    fichaTecnicaUrl: r.ficha_tecnica_url,
  };
}

export async function getProductsByFamily(slug: string): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool) return [];

  try {
    await ensurePublicProductsSchema();
    // Con foto real primero: hoy (19-sep-2026) solo 4 de ~6400 productos
    // tienen foto cargada (ver server/public-sync.js en Dinaseg-ERP) —
    // ordenar solo por nombre los dejaba enterrados pasado el LIMIT 24 en
    // categorías con muchos productos (ej. cascos: 111 en total).
    const { rows } = await pool.query(
      `SELECT sku, nombre, familia, descripcion, imagen_url, ficha_tecnica_url FROM public_products
        WHERE familia = $1
        ORDER BY (imagen_url IS NOT NULL) DESC, nombre
        LIMIT 24`,
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

/**
 * Buscador del sitio (app/buscar) — a pedido de Carlos, 21-sep-2026: sin
 * esto un producto real (ej. Panama Jack) podía existir en el catálogo pero
 * no aparecer en su categoría si no tenía foto y quedaba fuera del LIMIT 24
 * de getProductsByFamily. Busca por nombre O sku en TODO el catálogo, sin
 * límite de familia ni de foto.
 */
export async function searchProducts(query: string): Promise<PublicProduct[]> {
  const pool = getPool();
  const q = query.trim();
  if (!pool || !q) return [];

  try {
    await ensurePublicProductsSchema();
    const { rows } = await pool.query(
      `SELECT sku, nombre, familia, descripcion, imagen_url, ficha_tecnica_url FROM public_products
        WHERE nombre ILIKE $1 OR sku ILIKE $1
        ORDER BY (imagen_url IS NOT NULL) DESC, nombre
        LIMIT 60`,
      [`%${q}%`]
    );
    return rows.map(mapRow);
  } catch (e) {
    console.warn("[products] No se pudo buscar en public_products:", (e as Error).message);
    return [];
  }
}

/** Para el comparador (app/comparar) — trae hasta 4 productos por SKU exacto. */
export async function getProductsBySkus(skus: string[]): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool || skus.length === 0) return [];

  try {
    await ensurePublicProductsSchema();
    const { rows } = await pool.query(
      `SELECT sku, nombre, familia, descripcion, imagen_url, ficha_tecnica_url FROM public_products WHERE sku = ANY($1) LIMIT 4`,
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
 *
 * `random()` en vez de `nombre` (21-sep-2026, pedido de Carlos): con
 * `ORDER BY nombre` el "top 2 con foto" de cada familia era siempre el
 * mismo par en cada carga — hoy son casi siempre productos Aquiles porque
 * son de los pocos con foto real cargada todavía, así que el home mostraba
 * siempre lo mismo. Con `random()` se recambia (la página se revalida cada
 * 1h vía ISR — ver `revalidate` en app/page.tsx), pero se sigue priorizando
 * tener foto sobre no tenerla.
 */
export async function getFeaturedProducts(): Promise<PublicProduct[]> {
  const pool = getPool();
  if (!pool) return [];

  try {
    await ensurePublicProductsSchema();
    const { rows } = await pool.query(`
      SELECT sku, nombre, familia, descripcion, imagen_url, ficha_tecnica_url FROM (
        SELECT *, ROW_NUMBER() OVER (
          PARTITION BY familia ORDER BY (imagen_url IS NOT NULL) DESC, random()
        ) AS rn
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
