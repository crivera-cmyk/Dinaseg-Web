"use client";

import { useState } from "react";
import { FAMILIES } from "@/lib/families";

export default function QuoteForm({ familiaInicial }: { familiaInicial?: string }) {
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
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "No se pudo enviar la cotización");
      setEstado("ok");
      form.reset();
      // Evento de conversión para Google Ads (no hace nada si el Google Tag
      // no está cargado — ver components/GoogleTag.tsx).
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "generate_lead", { event_category: "cotizacion", event_label: datos.familia || "general" });
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-semibold">¡Listo! Recibimos tu solicitud.</p>
        <p className="mt-1 text-sm">Te contactamos dentro de las próximas 24 horas hábiles.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Categoría de interés</label>
        <select
          name="familia"
          defaultValue={familiaInicial || ""}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
        >
          <option value="">Selecciona una categoría (opcional)</option>
          {FAMILIES.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-dinaseg-gray">¿Qué necesitas? *</label>
        <textarea
          name="mensaje"
          required
          rows={4}
          placeholder="Ej: 50 pares de zapatos de seguridad talla 40-43 para faena minera"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full rounded-md bg-dinaseg-red px-4 py-3 font-semibold text-white hover:bg-dinaseg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {estado === "enviando" ? "Enviando..." : "Solicitar cotización"}
      </button>
      <p className="text-xs text-zinc-500">Sin compromiso de compra. Respuesta dentro de 24 horas hábiles.</p>
    </form>
  );
}
