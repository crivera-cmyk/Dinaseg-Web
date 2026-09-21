"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCompare } from "@/lib/compare";
import { useCart } from "@/lib/cart";
import type { PublicProduct } from "@/lib/products";

// Comparador 100% client-side (ver PLAN_WEB_PUBLICA.md, Dinaseg-ERP):
// la lista de SKUs vive en localStorage y se refleja en la URL (?sku=a,b)
// para poder compartir el link. /api/products trae los datos reales.
function ComparadorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { skus, toggle, setAll, clear } = useCompare();
  const { add } = useCart();
  const [productos, setProductos] = useState<PublicProduct[]>([]);
  const [cargando, setCargando] = useState(true);

  // `skus` es un array nuevo en cada render (useCompare lo arma con
  // JSON.parse) — usarlo tal cual como dependencia de un efecto reinicia el
  // efecto en cada render (misma lista, referencia distinta) y termina en
  // loop infinito. La clave en string sí es estable entre renders iguales.
  const skusKey = skus.join(",");

  // Si la URL trae ?sku=..., esa es la fuente de verdad al entrar (permite
  // compartir el link) — si no, se usa lo que ya había en localStorage.
  useEffect(() => {
    const enUrl = searchParams.get("sku");
    if (enUrl) setAll(enUrl.split(",").filter(Boolean));
    // Solo al montar: no se quiere pisar cambios posteriores del usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantiene la URL sincronizada con la lista actual, para que se pueda
  // compartir/recargar sin perder la selección.
  useEffect(() => {
    const url = skusKey ? `/comparar?sku=${skusKey}` : "/comparar";
    router.replace(url, { scroll: false });
  }, [skusKey, router]);

  useEffect(() => {
    // Si no hay SKUs, el render de más abajo ya muestra el estado "vacío"
    // sin necesitar productos/cargando — no hace falta setState acá.
    if (!skusKey) return;
    // Patrón estándar de "fetch al cambiar una dependencia" (documentado
    // por React mismo) — acá no hay forma de derivar "cargando" sin esto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    fetch(`/api/products?skus=${skusKey}`)
      .then((r) => r.json())
      .then((data) => setProductos(data.productos || []))
      .finally(() => setCargando(false));
  }, [skusKey]);

  if (skus.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-dinaseg-gray">No hay productos para comparar</h1>
        <p className="mt-2 text-zinc-600">
          Marcá la casilla &quot;Comparar&quot; en las tarjetas de producto de cualquier categoría (hasta 4 a la vez).
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-dinaseg-red px-6 py-3 font-semibold text-white hover:bg-dinaseg-red-dark"
        >
          Ver categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-dinaseg-gray">Comparar productos</h1>
        <button type="button" onClick={clear} className="text-sm text-zinc-500 hover:text-dinaseg-red">
          Vaciar
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-32"></th>
                {productos.map((p) => (
                  <th key={p.sku} className="border-b border-zinc-200 p-3 align-bottom">
                    <button
                      type="button"
                      onClick={() => toggle(p.sku)}
                      className="mb-2 text-xs text-zinc-400 hover:text-dinaseg-red"
                    >
                      ✕ quitar
                    </button>
                    <p className="font-semibold text-dinaseg-gray">{p.nombre}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-zinc-100 p-3 font-medium text-zinc-500">SKU</td>
                {productos.map((p) => (
                  <td key={p.sku} className="border-b border-zinc-100 p-3">
                    {p.sku}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-zinc-100 p-3 font-medium text-zinc-500">Categoría</td>
                {productos.map((p) => (
                  <td key={p.sku} className="border-b border-zinc-100 p-3">
                    <Link href={`/${p.familia}`} className="text-dinaseg-red hover:underline">
                      {p.familia}
                    </Link>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-zinc-100 p-3 font-medium text-zinc-500">Marca</td>
                {productos.map((p) => (
                  <td key={p.sku} className="border-b border-zinc-100 p-3">
                    {p.descripcion || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-zinc-100 p-3 font-medium text-zinc-500">Ficha técnica</td>
                {productos.map((p) => (
                  <td key={p.sku} className="border-b border-zinc-100 p-3">
                    {p.fichaTecnicaUrl ? (
                      <a href={p.fichaTecnicaUrl} className="text-dinaseg-red hover:underline">
                        📄 Descargar
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3"></td>
                {productos.map((p) => (
                  <td key={p.sku} className="p-3">
                    <button
                      type="button"
                      onClick={() => add({ sku: p.sku, nombre: p.nombre, familia: p.familia })}
                      className="rounded-md bg-dinaseg-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-dinaseg-red-dark"
                    >
                      Agregar al carrito
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-xs text-zinc-400">
        Nota: todavía no tenemos fotos cargadas para todo el catálogo — por ahora muestra los datos básicos
        disponibles. Para el detalle completo, cotizá el producto y te asesoramos directo.
      </p>
    </div>
  );
}

export default function ComparadorPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-zinc-500">Cargando...</div>}>
      <ComparadorInner />
    </Suspense>
  );
}
