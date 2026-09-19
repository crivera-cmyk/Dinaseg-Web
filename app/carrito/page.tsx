"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

// Carrito → cotización (no hay pago online todavía, ver PLAN_WEB_PUBLICA.md
// en Dinaseg-ERP para el plan de fases). Envía todos los items del carrito
// como UNA sola cotización a /api/quotes.
export default function CarritoPage() {
  const { items, remove, setCantidad, clear, total } = useCart();
  const [estado, setEstado] = useState<"listo" | "enviando" | "ok" | "error">("listo");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setError(null);

    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());

    try {
      const r = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datos,
          items: items.map((i) => ({ sku: i.sku, nombre: i.nombre, cantidad: i.cantidad })),
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "No se pudo enviar la cotización");
      setEstado("ok");
      clear();
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (estado === "ok") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-green-800">
          <p className="text-lg font-semibold">¡Listo! Recibimos tu solicitud.</p>
          <p className="mt-1 text-sm">Te contactamos dentro de las próximas 24 horas hábiles.</p>
        </div>
        <Link href="/" className="mt-6 inline-block text-sm text-dinaseg-red hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-dinaseg-gray">Tu carrito está vacío</h1>
        <p className="mt-2 text-zinc-600">Agregá productos desde cualquier categoría para cotizarlos juntos.</p>
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-dinaseg-gray">Tu carrito</h1>
      <p className="mt-1 text-sm text-zinc-600">
        {total} producto{total !== 1 ? "s" : ""} — revisá las cantidades y mandanos tus datos para cotizarlos juntos.
      </p>

      <div className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {items.map((item) => (
          <div key={item.sku} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-dinaseg-gray">{item.nombre}</p>
              <p className="text-xs text-zinc-400">SKU {item.sku}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.cantidad}
              onChange={(e) => setCantidad(item.sku, Number(e.target.value) || 1)}
              className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-center text-sm"
            />
            <button
              type="button"
              onClick={() => remove(item.sku)}
              className="text-xs text-zinc-400 hover:text-dinaseg-red"
              aria-label={`Quitar ${item.nombre}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={clear} className="mt-3 text-xs text-zinc-400 hover:text-dinaseg-red">
        Vaciar carrito
      </button>

      <form onSubmit={onSubmit} className="mt-10 space-y-4 border-t border-zinc-200 pt-8">
        <h2 className="text-lg font-bold text-dinaseg-gray">Tus datos para cotizar</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Nombre *</label>
            <input
              name="nombre"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Empresa</label>
            <input
              name="empresa"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Correo *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Teléfono</label>
            <input
              name="telefono"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Comentario (opcional)</label>
          <textarea
            name="mensaje"
            rows={3}
            placeholder="Ej: para faena en Antofagasta, necesitamos entrega antes de fin de mes"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="w-full rounded-md bg-dinaseg-red px-4 py-3 font-semibold text-white hover:bg-dinaseg-red-dark disabled:opacity-60 sm:w-auto"
        >
          {estado === "enviando" ? "Enviando..." : `Cotizar ${total} producto${total !== 1 ? "s" : ""}`}
        </button>
        <p className="text-xs text-zinc-500">Sin compromiso de compra. Respuesta en 24 horas hábiles.</p>
      </form>
    </div>
  );
}
