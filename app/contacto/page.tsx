import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacta a ${SITE.nombre}: ${SITE.telefonos.join(", ")} — ${SITE.direccion}.`,
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-dinaseg-gray">Contacto</h1>
      <p className="mt-2 text-zinc-600">Atención directa a empresas y asesoría técnica gratuita.</p>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">Teléfonos</h2>
          <ul className="mt-2 space-y-1">
            {SITE.telefonos.map((t) => (
              <li key={t}>
                <a href={`tel:${t.replace(/\s/g, "")}`} className="text-lg font-medium text-dinaseg-gray hover:text-dinaseg-red">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">Correo</h2>
          <a href={`mailto:${SITE.email}`} className="text-lg font-medium text-dinaseg-gray hover:text-dinaseg-red">
            {SITE.email}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">Dirección</h2>
          <p className="text-lg font-medium text-dinaseg-gray">{SITE.direccion}</p>
        </div>
      </div>
    </div>
  );
}
