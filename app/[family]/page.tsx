import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FAMILIES, getFamily } from "@/lib/families";
import { getProductsByFamily } from "@/lib/products";
import { SITE } from "@/lib/site";
import QuoteForm from "@/components/QuoteForm";
import ProductActions from "@/components/ProductActions";

// El catálogo se sincroniza desde el ERP una vez al día (cron 02:15) más
// corridas manuales tras cada import de precios — sin esto, Next.js sirve
// para siempre la página estática generada en el último deploy, aunque la
// base de Neon ya tenga catálogo nuevo. 3600 = revisa cada 1 hora como
// máximo (ISR), sin perder la velocidad de servir HTML estático el resto
// del tiempo.
export const revalidate = 3600;

// Fase 1 (ver PLAN_WEB_PUBLICA.md, Dinaseg-ERP): estas son las 14 URLs
// exactas que ya están cargadas en la campaña de Google Ads
// (marketing/google-ads/ads_rsa.csv) — no renombrar los slugs sin avisar,
// rompería los anuncios ya importados.
export async function generateStaticParams() {
  return FAMILIES.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}): Promise<Metadata> {
  const { family } = await params;
  const f = getFamily(family);
  if (!f) return {};
  return {
    title: f.nombre,
    description: f.intro,
    alternates: { canonical: `/${f.slug}` },
  };
}

export default async function FamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params;
  const f = getFamily(family);
  if (!f) notFound();

  const productos = await getProductsByFamily(f.slug);

  return (
    <div>
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <nav className="mb-3 text-xs text-zinc-500">
            <Link href="/" className="hover:text-dinaseg-red">
              Inicio
            </Link>{" "}
            / <span className="text-dinaseg-gray">{f.nombre}</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-dinaseg-gray sm:text-4xl">{f.nombre}</h1>
          <p className="mt-3 max-w-2xl text-zinc-600">{f.intro}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {f.destacados.map((d) => (
              <span key={d} className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs text-dinaseg-gray">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#cotizar"
              className="rounded-md bg-dinaseg-red px-5 py-2.5 font-semibold text-white hover:bg-dinaseg-red-dark"
            >
              Cotiza en 24 horas
            </a>
            <a
              href={`tel:${SITE.telefonos[0].replace(/\s/g, "")}`}
              className="rounded-md border border-zinc-300 px-5 py-2.5 font-semibold text-dinaseg-gray hover:bg-white"
            >
              📞 {SITE.telefonos[0]}
            </a>
          </div>
        </div>
      </section>

      {/* Productos: se muestran solo cuando la sincronización desde el ERP
          (server/public-sync.js, todavía no implementada) haya cargado
          catálogo real. Mientras tanto, contenido institucional + CTA. */}
      {productos.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-dinaseg-gray">Productos de {f.nombre}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {productos.map((p) => (
              <div key={p.sku} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex h-32 items-center justify-center rounded bg-zinc-50 text-xs text-zinc-400">
                  {p.imagenUrl ? (
                    <Image src={p.imagenUrl} alt={p.nombre} width={200} height={128} className="h-32 w-full object-contain" />
                  ) : (
                    "Foto próximamente"
                  )}
                </div>
                <h3 className="text-sm font-semibold text-dinaseg-gray">{p.nombre}</h3>
                <ProductActions sku={p.sku} nombre={p.nombre} familia={p.familia} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-lg border border-dinaseg-red/20 bg-red-50 p-6 text-center text-sm text-dinaseg-gray">
            Contamos con amplio stock de {f.nombre.toLowerCase()} de marcas reconocidas.
            Escríbenos con lo que necesitas y te enviamos alternativas y precios el mismo día.
          </div>
        </section>
      )}

      {/* Otras categorías, para que el buscador orgánico y Ads naveguen entre familias */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase text-zinc-400">Otras categorías</h2>
        <div className="flex flex-wrap gap-2">
          {FAMILIES.filter((o) => o.slug !== f.slug).map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-dinaseg-gray hover:border-dinaseg-red hover:text-dinaseg-red"
            >
              {o.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section id="cotizar" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="mb-1 text-2xl font-bold text-dinaseg-gray">Cotiza {f.nombre.toLowerCase()}</h2>
          <p className="mb-6 text-sm text-zinc-600">Respuesta en 24 horas hábiles, sin compromiso.</p>
          <QuoteForm familiaInicial={f.slug} />
        </div>
      </section>
    </div>
  );
}
