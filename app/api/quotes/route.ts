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

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: "Faltan campos obligatorios (nombre, correo, mensaje)" }, { status: 400 });
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
           mensaje TEXT NOT NULL,
           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )`
      );
      await pool?.query(
        `INSERT INTO quote_requests (nombre, empresa, email, telefono, familia, mensaje) VALUES ($1,$2,$3,$4,$5,$6)`,
        [nombre, empresa || null, email, telefono || null, familia || null, mensaje]
      );
      guardadoEnBase = true;
    } catch (e) {
      console.error("[api/quotes] Error guardando en la base:", (e as Error).message);
    }
  }

  let correoEnviado = false;
  try {
    const r = await enviarCorreoCotizacion({ nombre, empresa, email, telefono, familia, mensaje });
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
    });
  }

  return NextResponse.json({ ok: true, guardadoEnBase, correoEnviado, mailConfigurado: mailConfigurado() });
}
