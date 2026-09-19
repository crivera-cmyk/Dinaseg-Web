"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = { titulo: string; subtitulo: string; cta: string; href: string };

// Mismo espíritu que los "4 banners principales" del sitio viejo (Calzado,
// Implementos, Protección Personal, Ropa) pero con links reales a
// categorías con catálogo de verdad, en vez de imágenes de relleno
// genéricas — el sitio viejo usaba "dummy images" según su propio código.
const SLIDES: Slide[] = [
  {
    titulo: "Ropa de trabajo y uniformes",
    subtitulo: "Vestuario industrial con despacho a todo Santiago",
    cta: "Ver Vestuario",
    href: "/vestuario",
  },
  {
    titulo: "Calzado con puntera de acero",
    subtitulo: "Steelpro y Hardwork, stock permanente",
    cta: "Ver Calzado de Seguridad",
    href: "/calzado-seguridad",
  },
  {
    titulo: "Guantes para cada faena",
    subtitulo: "Guantes de seguridad industrial al por mayor",
    cta: "Ver Protección Manos",
    href: "/proteccion-manos",
  },
  {
    titulo: "Cascos certificados",
    subtitulo: "Con y sin barbiquejo, para toda tu obra",
    cta: "Ver Cascos de Seguridad",
    href: "/cascos-seguridad",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[i];

  return (
    <div className="relative overflow-hidden">
      <div key={i} className="animate-[fadeIn_0.5s_ease-in-out]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-dinaseg-red">{slide.subtitulo}</p>
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">{slide.titulo}</h1>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={slide.href}
          className="rounded-md bg-dinaseg-red px-6 py-3 font-semibold text-white hover:bg-dinaseg-red-dark"
        >
          {slide.cta}
        </Link>
        <Link
          href="/cotizar"
          className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          Cotiza en 24 horas
        </Link>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.href}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Ver ${s.titulo}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-dinaseg-red" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
