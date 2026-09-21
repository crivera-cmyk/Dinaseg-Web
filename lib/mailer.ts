// lib/mailer.ts — Mismos nombres de variable de entorno que Dinaseg-ERP
// (server/dispatches.js), pero configuradas de forma independiente en este
// proyecto (Vercel) — el sitio nunca le pide al ERP que envíe el correo.
import nodemailer from "nodemailer";

export function mailConfigurado(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

type QuoteItem = { sku: string; nombre: string; cantidad: number };

export async function enviarCorreoCotizacion(datos: {
  nombre: string;
  empresa?: string;
  email: string;
  telefono?: string;
  familia?: string;
  mensaje: string;
  items?: QuoteItem[];
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

  const hayItems = Boolean(datos.items?.length);
  const asunto = hayItems
    ? `Nueva cotización web — Carrito (${datos.items!.length} producto${datos.items!.length > 1 ? "s" : ""}) — ${datos.nombre}`
    : `Nueva cotización web — ${datos.familia || "General"} — ${datos.nombre}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_FROM || process.env.SMTP_USER,
    replyTo: datos.email,
    subject: asunto,
    text: [
      `Nombre: ${datos.nombre}`,
      datos.empresa ? `Empresa: ${datos.empresa}` : null,
      `Correo: ${datos.email}`,
      datos.telefono ? `Teléfono: ${datos.telefono}` : null,
      datos.familia ? `Familia: ${datos.familia}` : null,
      hayItems ? "" : null,
      hayItems ? "Productos del carrito:" : null,
      hayItems ? datos.items!.map((it) => `  - (${it.cantidad}x) [${it.sku}] ${it.nombre}`).join("\n") : null,
      "",
      datos.mensaje ? "Mensaje:" : null,
      datos.mensaje || null,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });

  return { enviado: true };
}

/**
 * "Registra tu empresa y obtén más descuentos" — mismo CTA que tenía el
 * sitio viejo (WooCommerce, apuntaba a /mi-cuenta/), pero acá sin sistema
 * de cuentas propio: es un formulario de datos de la empresa que le llega a
 * Carlos por correo (y queda guardado en `company_registrations`, ver
 * app/api/company-register/route.ts) para que ofrezca el descuento a mano
 * — no hay generación automática de códigos de descuento todavía.
 */
export async function enviarCorreoRegistroEmpresa(datos: {
  empresa: string;
  rut?: string;
  contacto: string;
  email: string;
  telefono?: string;
  rubro?: string;
}) {
  if (!mailConfigurado()) {
    console.warn("[mailer] SMTP no configurado todavía — registro de empresa solo queda guardado, no se envía correo.");
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
    subject: `Nueva empresa registrada (descuentos) — ${datos.empresa}`,
    text: [
      `Empresa: ${datos.empresa}`,
      datos.rut ? `RUT: ${datos.rut}` : null,
      `Contacto: ${datos.contacto}`,
      `Correo: ${datos.email}`,
      datos.telefono ? `Teléfono: ${datos.telefono}` : null,
      datos.rubro ? `Rubro: ${datos.rubro}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });

  return { enviado: true };
}
