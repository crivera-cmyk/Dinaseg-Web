"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [estado, setEstado] = useState<"listo" | "enviando" | "ok" | "error">("listo");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    const email = new FormData(e.currentTarget).get("email");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error();
      setEstado("ok");
      e.currentTarget.reset();
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return <p className="text-sm text-green-700">¡Gracias por suscribirte!</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="tu@correo.cl"
        className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-dinaseg-red focus:outline-none"
      />
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="shrink-0 rounded-md bg-dinaseg-red px-4 py-2 text-sm font-semibold text-white hover:bg-dinaseg-red-dark disabled:opacity-60"
      >
        {estado === "enviando" ? "..." : "Suscribirme"}
      </button>
      {estado === "error" && <p className="text-xs text-red-600">No se pudo suscribir, probá de nuevo.</p>}
    </form>
  );
}
