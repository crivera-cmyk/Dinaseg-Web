// lib/mailer.ts — Mismos nombres de variable de entorno que Dinaseg-ERP
// (server/dispatches.js), pero configuradas de forma independiente en este
// proyecto (Vercel) — el sitio nunca le pide al ERP que envíe el correo.
import nodemailer from "nodemailer";

export function mailConfigurado(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function enviarCorreoCotizacion(datos: {
  nombre: string;
  empresa?: string;
  email: string;
  telefono?: string;
  familia?: string;
  mensaje: string;
}) {
  if (!mailConfigurado()) {
    console.warn("[mailer] SMTP no configurado todavía — cotización solo queda registrada, no se envía correo.");
    return { enviado: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_FROM || process.env.SMTP_USER,
    replyTo: datos.email,
    subject: `Nueva cotización web — ${datos.familia || "General"} — ${datos.nombre}`,
    text: [
      `Nombre: ${datos.nombre}`,
      datos.empresa ? `Empresa: ${datos.empresa}` : null,
      `Correo: ${datos.email}`,
      datos.telefono ? `Teléfono: ${datos.telefono}` : null,
      datos.familia ? `Familia: ${datos.familia}` : null,
      "",
      "Mensaje:",
      datos.mensaje,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { enviado: true };
}
