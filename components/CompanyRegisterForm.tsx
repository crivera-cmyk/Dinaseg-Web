"use client";

import { useState } from "react";

export default function CompanyRegisterForm() {
  const [estado, setEstado] = useState<"listo" | "enviando" | "ok" | "error">("listo");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setError(null);

    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());

    try {
      const r = await fetch("/api/company-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "No se pudo enviar el registro");
      setEstado("ok");
      form.reset();
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-semibold">¡Listo! Registramos tu empresa.</p>
        <p className="mt-1 text-sm">Te contactamos con tus descuentos exclusivos dentro de las próximas 24 horas hábiles.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Nombre de la empresa *</label>
          <input
            name="empresa"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dinaseg-gray">RUT de la empresa</label>
          <input
            name="rut"
            placeholder="76.123.456-7"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Nombre de contacto *</label>
          <input
            name="contacto"
            required
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
        <div>
          <label className="mb-1 block text-sm font-medium text-dinaseg-gray">Rubro</label>
          <input
            name="rubro"
            placeholder="Ej: Construcción, minería, faenas pesqueras..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full rounded-md bg-dinaseg-red px-4 py-3 font-semibold text-white hover:bg-dinaseg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {estado === "enviando" ? "Enviando..." : "Registrar empresa"}
      </button>
      <p className="text-xs text-zinc-500">Sin costo ni compromiso. Te contactamos con tus descuentos por volumen.</p>
    </form>
  );
}
