import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FAMILIES, getFamily } from "@/lib/families";
import { searchProducts } from "@/lib/products";
import ProductActions from "@/components/ProductActions";
import SearchBox from "@/components/SearchBox";

// Sin ISR/generateStaticParams a propósito: la búsqueda depende de ?q= en
// cada visita, no tiene sentido pre-generarla (ver app/[family]/page.tsx
// para el patrón de catálogo por categoría, que sí es estático).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar productos",
  robots: { index: false }, // resultados de búsqueda no aportan a SEO
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const productos = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-dinaseg-gray">Buscar productos</h1>
      <div className="mt-4 max-w-lg">
        <SearchBox initialQuery={query} />
      </div>

      {!query ? (
        <p className="mt-8 text-sm text-zinc-500">Escribe un nombre, marca o SKU para buscar en todo el catálogo.</p>
      ) : productos.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dinaseg-red/20 bg-red-50 p-6 text-sm text-dinaseg-gray">
          No encontramos productos para &quot;{query}&quot;. Escríbenos con lo que necesitas y te cotizamos el mismo
          día.
          <div className="mt-4">
            <Link href="/cotizar" className="rounded-md bg-dinaseg-red px-5 py-2.5 font-semibold text-white hover:bg-dinaseg-red-dark">
              Cotiza en 24 horas
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 mb-4 text-sm text-zinc-500">
            {productos.length} resultado{productos.length === 1 ? "" : "s"} para &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {productos.map((p) => {
              const f = getFamily(p.familia);
              return (
                <div key={p.sku} className="rounded-lg border border-zinc-200 p-4">
                  <div className="mb-3 flex h-32 items-center justify-center rounded bg-zinc-50 text-xs text-zinc-400">
                    {p.imagenUrl ? (
                      <Image src={p.imagenUrl} alt={p.nombre} width={200} height={128} className="h-32 w-full object-contain" />
                    ) : (
                      "Foto próximamente"
                    )}
                  </div>
                  {f && (
                    <Link href={`/${f.slug}`} className="text-xs uppercase text-zinc-400 hover:text-dinaseg-red">
                      {f.nombre}
                    </Link>
                  )}
                  <h3 className="text-sm font-semibold text-dinaseg-gray">{p.nombre}</h3>
                  {p.fichaTecnicaUrl && (
                    <a href={p.fichaTecnicaUrl} className="mt-1 inline-flex items-center gap-1 text-xs text-dinaseg-red hover:underline">
                      📄 Ficha técnica
                    </a>
                  )}
                  <ProductActions sku={p.sku} nombre={p.nombre} familia={p.familia} />
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-12 border-t border-zinc-200 pt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-400">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((f) => (
            <Link
              key={f.slug}
              href={`/${f.slug}`}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-dinaseg-gray hover:border-dinaseg-red hover:text-dinaseg-red"
            >
              {f.nombre}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
