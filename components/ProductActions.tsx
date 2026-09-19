"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCompare } from "@/lib/compare";

export default function ProductActions({
  sku,
  nombre,
  familia,
}: {
  sku: string;
  nombre: string;
  familia: string;
}) {
  const { add, items } = useCart();
  const { toggle, isSelected, skus } = useCompare();
  const [agregado, setAgregado] = useState(false);

  const enCarrito = items.some((i) => i.sku === sku);
  const comparando = isSelected(sku);
  const compareLleno = !comparando && skus.length >= 4;

  function onAgregar() {
    add({ sku, nombre, familia });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onAgregar}
        className="flex-1 rounded-md bg-dinaseg-red px-2 py-1.5 text-xs font-semibold text-white hover:bg-dinaseg-red-dark"
      >
        {agregado ? "✓ Agregado" : enCarrito ? "+ Agregar otra vez" : "Agregar"}
      </button>
      <label
        className={`flex items-center gap-1 text-xs text-zinc-500 ${compareLleno ? "opacity-40" : "cursor-pointer"}`}
        title={compareLleno ? "Ya elegiste 4 productos para comparar" : "Comparar"}
      >
        <input
          type="checkbox"
          checked={comparando}
          disabled={compareLleno}
          onChange={() => toggle(sku)}
          className="h-3.5 w-3.5 accent-dinaseg-red"
        />
        Comparar
      </label>
    </div>
  );
}
