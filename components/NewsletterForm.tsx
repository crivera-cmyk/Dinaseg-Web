"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [estado, setEstado] = useState<"listo" | "enviando" | "ok" | "error">("listo");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // React vacía los campos del SyntheticEvent (incluido currentTarget)
    // apenas termina este handler — como acá hay un `await` de por medio,
    // para cuando la respuesta vuelve `e.currentTarget` ya es `null`. Por
    // eso el envío SÍ llegaba a guardarse pero el formulario igual mostraba
    // "no se pudo suscribir": el error real era `Cannot read properties of
    // null (reading 'reset')` al llamar `e.currentTarget.reset()` después
    // del await (bug real visto en producción el 20-sep-2026, confirmado
    // por el mensaje de error en pantalla). Se guarda la referencia al form
    // ANTES del await para evitar esto.
    const form = e.currentTarget;
    setEstado("enviando");
    const email = new FormData(form).get("email");
    try {
      const r = await fetch("/api/boletin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${r.status}`);
      }
      setEstado("ok");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
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
      {estado === "error" && <p className="text-xs text-red-600">No se pudo suscribir ({errorMsg}). Inténtalo de nuevo.</p>}
    </form>
  );
}
