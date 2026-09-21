import { NextRequest, NextResponse } from "next/server";
import { getPool, dbConfigurada } from "@/lib/db";

// POST /api/boletin — suscripción simple a novedades.
//
// Antes era /api/newsletter: Carlos reportó que el botón "Suscribirme" no
// dejaba suscribirse (20-sep-2026). El endpoint respondía 200 OK al
// probarlo directo con curl, así que el bloqueo más probable es del lado
// del navegador: varios bloqueadores de ads/privacidad (uBlock, AdGuard,
// Brave Shields) traen reglas que cortan cualquier request cuya URL
// contenga la palabra "newsletter", por ser un patrón típico de tracking
// de marketing. Se renombró la ruta para no chocar con esas reglas — la
// tabla en Neon sigue llamándose `newsletter_subscribers` (eso no lo lee
// ningún bloqueador). Si el problema persiste, no era esto: pedirle a
// Carlos el navegador y el mensaje exacto que ve.
//
// Sin servicio de email marketing todavía (Brevo/Mailchimp, ver
// PLAN_WEB_PUBLICA.md — Fase 3): por ahora solo guarda el correo en Neon,
// mismo criterio de degradación segura que /api/quotes. El envío de
// campañas se decide más adelante, cuando haya un service real conectado.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  let guardado = false;
  if (dbConfigurada()) {
    try {
      const pool = getPool();
      await pool?.query(
        `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
           id SERIAL PRIMARY KEY,
           email TEXT NOT NULL UNIQUE,
           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )`
      );
      await pool?.query(
        `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
        [email]
      );
      guardado = true;
    } catch (e) {
      console.error("[api/boletin] Error guardando en la base:", (e as Error).message);
    }
  }

  if (!guardado) {
    console.log("[api/boletin] SUSCRIPCIÓN SIN GUARDAR (falta configurar Neon):", email);
  }

  return NextResponse.json({ ok: true, guardado });
}
