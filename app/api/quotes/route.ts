import { NextRequest, NextResponse } from "next/server";
import { getPool, dbConfigurada } from "@/lib/db";
import { enviarCorreoCotizacion, mailConfigurado } from "@/lib/mailer";

// POST /api/quotes — recibe una cotización del formulario público.
//
// Degradación intencional (ver PLAN_WEB_PUBLICA.md): mientras Carlos no haya
// creado la cuenta de Neon (DB_URL) y/o configurado el SMTP en Vercel,
// esto NO debe devolver error al usuario del sitio — igual se manda el
// correo si el SMTP está listo, y/o se guarda en la base si está lista. Si
// NINGUNO de los dos está configurado todavía, igual se responde éxito (ya
// quedó en el log del servidor) para no mostrarle un formulario roto a un
// lead real de Google Ads mientras se termina de configurar la infra.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nombre = String(body.nombre || "").trim();
  const email = String(body.email || "").trim();
  const mensaje = String(body.mensaje || "").trim();
  const empresa = body.empresa ? String(body.empresa).trim() : undefined;
  const telefono = body.telefono ? String(body.telefono).trim() : undefined;
  const familia = body.familia ? String(body.familia).trim() : undefined;

  // Items del carrito (app/carrito) — opcional, una cotización "clásica" por
  // categoría (sin carrito) sigue funcionando igual, solo con mensaje libre.
  const items = Array.isArray(body.items)
    ? body.items
        .map((it) => ({
          sku: String((it as Record<string, unknown>)?.sku || "").trim(),
          nombre: String((it as Record<string, unknown>)?.nombre || "").trim(),
          cantidad: Number((it as Record<string, unknown>)?.cantidad) || 1,
        }))
        .filter((it) => it.sku && it.nombre)
        .slice(0, 50)
    : [];

  // Con items del carrito, el mensaje pasa a ser opcional (puede venir solo
  // un comentario corto o nada) — sin items, sigue siendo obligatorio como
  // siempre (formulario de "Cotizar" clásico).
  if (!nombre || !email || (!mensaje && items.length === 0)) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios (nombre, correo, y mensaje o al menos un producto)" },
      { status: 400 }
    );
  }

  let guardadoEnBase = false;
  if (dbConfigurada()) {
    try {
      const pool = getPool();
      await pool?.query(
        `CREATE TABLE IF NOT EXISTS quote_requests (
           id SERIAL PRIMARY KEY,
           nombre TEXT NOT NULL,
           empresa TEXT,
           email TEXT NOT NULL,
           telefono TEXT,
           familia TEXT,
           mensaje TEXT NOT NULL DEFAULT '',
           items JSONB,
           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )`
      );
      // Por si la tabla ya existía de antes de agregar carrito (sin `items`,
      // y con `mensaje` NOT NULL sin default) — idempotente.
      await pool?.query(`ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS items JSONB`);
      await pool?.query(`ALTER TABLE quote_requests ALTER COLUMN mensaje SET DEFAULT ''`);
      await pool?.query(
        `INSERT INTO quote_requests (nombre, empresa, email, telefono, familia, mensaje, items) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [nombre, empresa || null, email, telefono || null, familia || null, mensaje, items.length ? JSON.stringify(items) : null]
      );
      guardadoEnBase = true;
    } catch (e) {
      console.error("[api/quotes] Error guardando en la base:", (e as Error).message);
    }
  }

  let correoEnviado = false;
  try {
    const r = await enviarCorreoCotizacion({ nombre, empresa, email, telefono, familia, mensaje, items });
    correoEnviado = r.enviado;
  } catch (e) {
    console.error("[api/quotes] Error enviando correo:", (e as Error).message);
  }

  if (!guardadoEnBase && !correoEnviado) {
    // Nada de infra configurada todavía: lo dejamos igual en el log del
    // servidor (Vercel) para no perder el lead mientras Carlos termina de
    // configurar Neon/SMTP.
    console.log("[api/quotes] SOLICITUD SIN GUARDAR (falta configurar Neon/SMTP):", {
      nombre,
      empresa,
      email,
      telefono,
      familia,
      mensaje,
      items,
    });
  }

  return NextResponse.json({ ok: true, guardadoEnBase, correoEnviado, mailConfigurado: mailConfigurado() });
}
