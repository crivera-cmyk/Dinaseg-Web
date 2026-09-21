import { NextRequest, NextResponse } from "next/server";
import { getPool, dbConfigurada } from "@/lib/db";
import { enviarCorreoRegistroEmpresa, mailConfigurado } from "@/lib/mailer";

// POST /api/company-register — "Registra tu empresa y obtén más
// descuentos" (ver components/PromoBanners.tsx / app/registro). Mismo
// criterio de degradación segura que /api/quotes: nunca falla al visitante
// solo porque Neon o el SMTP no estén configurados, siempre que al menos
// uno de los dos funcione (o quede en el log del servidor).
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const empresa = String(body.empresa || "").trim();
  const contacto = String(body.contacto || "").trim();
  const email = String(body.email || "").trim();
  const rut = body.rut ? String(body.rut).trim() : undefined;
  const telefono = body.telefono ? String(body.telefono).trim() : undefined;
  const rubro = body.rubro ? String(body.rubro).trim() : undefined;

  if (!empresa || !contacto || !email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios (empresa, contacto y correo válido)" },
      { status: 400 }
    );
  }

  let guardadoEnBase = false;
  if (dbConfigurada()) {
    try {
      const pool = getPool();
      await pool?.query(
        `CREATE TABLE IF NOT EXISTS company_registrations (
           id SERIAL PRIMARY KEY,
           empresa TEXT NOT NULL,
           rut TEXT,
           contacto TEXT NOT NULL,
           email TEXT NOT NULL,
           telefono TEXT,
           rubro TEXT,
           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )`
      );
      await pool?.query(
        `INSERT INTO company_registrations (empresa, rut, contacto, email, telefono, rubro) VALUES ($1,$2,$3,$4,$5,$6)`,
        [empresa, rut || null, contacto, email, telefono || null, rubro || null]
      );
      guardadoEnBase = true;
    } catch (e) {
      console.error("[api/company-register] Error guardando en la base:", (e as Error).message);
    }
  }

  let correoEnviado = false;
  try {
    const r = await enviarCorreoRegistroEmpresa({ empresa, rut, contacto, email, telefono, rubro });
    correoEnviado = r.enviado;
  } catch (e) {
    console.error("[api/company-register] Error enviando correo:", (e as Error).message);
  }

  if (!guardadoEnBase && !correoEnviado) {
    console.log("[api/company-register] REGISTRO SIN GUARDAR (falta configurar Neon/SMTP):", {
      empresa,
      rut,
      contacto,
      email,
      telefono,
      rubro,
    });
  }

  return NextResponse.json({ ok: true, guardadoEnBase, correoEnviado, mailConfigurado: mailConfigurado() });
}
