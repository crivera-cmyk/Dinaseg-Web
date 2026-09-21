import Link from "next/link";
import Image from "next/image";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";
import { getFeaturedProducts } from "@/lib/products";
import HeroCarousel from "@/components/HeroCarousel";
import ProductActions from "@/components/ProductActions";

// Mismo criterio de refresco que las páginas de familia (ver
// app/[family]/page.tsx) — los destacados salen del catálogo real.
export const revalidate = 3600;

export default async function Home() {
  const destacados = await getFeaturedProducts();

  return (
    <div>
      {/* Hero / carrusel de categorías — la imagen va de punta a punta (como
          los banners del sitio anterior), el CTA/dots quedan centrados adentro. */}
      <section className="bg-dinaseg-gray py-6 sm:py-10">
        <HeroCarousel />
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

      {/* Productos destacados — selección representativa del catálogo real
          (no hay flag de "destacado" en la base todavía, ver lib/products.ts) */}
      {destacados.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-6 text-2xl font-bold text-dinaseg-gray">Productos destacados</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {destacados.map((p) => (
                <div key={p.sku} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="mb-3 flex h-28 items-center justify-center rounded bg-zinc-50 text-xs text-zinc-400">
                    {p.imagenUrl ? (
                      <Image src={p.imagenUrl} alt={p.nombre} width={160} height={112} className="h-28 w-full object-contain" />
                    ) : (
                      "Foto próximamente"
                    )}
                  </div>
                  <p className="text-xs uppercase text-zinc-400">
                    {FAMILIES.find((f) => f.slug === p.familia)?.nombre}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-dinaseg-gray">{p.nombre}</h3>
                  {p.fichaTecnicaUrl && (
                    <a
                      href={p.fichaTecnicaUrl}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-dinaseg-red hover:underline"
                    >
                      📄 Ficha técnica
                    </a>
                  )}
                  <ProductActions sku={p.sku} nombre={p.nombre} familia={p.familia} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-white border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-dinaseg-gray">¿No encuentras lo que buscas?</h2>
          <p className="mt-2 text-zinc-600">Cuéntanos qué necesitas y te cotizamos sin compromiso.</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-500">{SITE.mision}</p>
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
