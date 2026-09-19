"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare";

/** Reserva el espacio de la barra fija para que no tape el footer al hacer scroll hasta el final. */
export function CompareBarSpacer() {
  const { skus } = useCompare();
  if (skus.length === 0) return null;
  return <div className="h-16" aria-hidden="true" />;
}

// Barra fija abajo que aparece apenas hay 1+ productos marcados para
// comparar — mismo criterio del plan original (comparador 100%
// client-side, reflejado en la URL de /comparar).
export default function CompareBar() {
  const { skus, clear } = useCompare();

  if (skus.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="text-sm text-dinaseg-gray">
          <strong>{skus.length}</strong> producto{skus.length > 1 ? "s" : ""} para comparar
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clear}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Vaciar
          </button>
          <Link
            href={`/comparar?sku=${skus.join(",")}`}
            className="rounded-md bg-dinaseg-red px-4 py-1.5 text-xs font-semibold text-white hover:bg-dinaseg-red-dark"
          >
            Comparar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
