import Link from "next/link";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dinaseg-gray">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-dinaseg-red">
            {SITE.tagline}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">
            Equipos de Protección Personal para tu empresa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">{SITE.mision}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cotizar"
              className="rounded-md bg-dinaseg-red px-6 py-3 font-semibold text-white hover:bg-dinaseg-red-dark"
            >
              Cotiza en 24 horas
            </Link>
            <a
              href={`tel:${SITE.telefonos[0].replace(/\s/g, "")}`}
              className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              📞 {SITE.telefonos[0]}
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios (mismos que la campaña de Ads, para consistencia de mensaje) */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center sm:grid-cols-4">
        {[
          ["🚚", "Despacho a empresas RM"],
          ["📦", "Stock permanente"],
          ["💰", "Precios por volumen"],
          ["🛠️", "Asesoría técnica gratis"],
        ].map(([icono, texto]) => (
          <div key={texto}>
            <div className="text-3xl">{icono}</div>
            <p className="mt-2 text-sm font-medium text-dinaseg-gray">{texto}</p>
          </div>
        ))}
      </section>

      {/* Familias */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-dinaseg-gray">Nuestras categorías</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {FAMILIES.map((f) => (
            <Link
              key={f.slug}
              href={`/${f.slug}`}
              className="group rounded-lg border border-zinc-200 p-5 transition hover:border-dinaseg-red hover:shadow-md"
            >
              <h3 className="font-semibold text-dinaseg-gray group-hover:text-dinaseg-red">{f.nombre}</h3>
              <p className="mt-1 text-xs text-zinc-500">{f.destacados[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-zinc-50 border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-dinaseg-gray">¿No encuentras lo que buscas?</h2>
          <p className="mt-2 text-zinc-600">Cuéntanos qué necesitas y te cotizamos sin compromiso.</p>
          <Link
            href="/cotizar"
            className="mt-6 inline-block rounded-md bg-dinaseg-red px-6 py-3 font-semibold text-white hover:bg-dinaseg-red-dark"
          >
            Solicitar cotización
          </Link>
        </div>
      </section>
    </div>
  );
}
