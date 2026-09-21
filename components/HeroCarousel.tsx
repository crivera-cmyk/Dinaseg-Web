"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Slides reales del sitio viejo (www.dinaseg.cl en v2nets) — el carrusel de
// "dummy images" del slider (RevSlider) era placeholder, pero estos son los
// assets reales que sí se publicaban ahí (fondos/logos/productos), bajados
// y reusados acá con destinos reales del catálogo (18-sep-2026, a pedido de
// Carlos, después de que confirmó con capturas que había contenido real).
type Slide = {
  key: string;
  href: string;
  cta: string;
  bg: { src: string; alt: string } | { gradient: string };
};

const SLIDES: Slide[] = [
  { key: "aquiles", href: "/proteccion-manos", cta: "Ver Guantes Aquiles", bg: { src: "/images/carousel/aquiles-fondo.webp", alt: "Guantes Aquiles" } },
  { key: "dinaseg", href: "/proteccion-caida", cta: "Ver Protección Caída", bg: { src: "/images/carousel/dinaseg-fondo.png", alt: "Protección contra caídas Dinaseg" } },
  { key: "calzado", href: "/calzado-seguridad", cta: "Ver Calzado de Seguridad", bg: { gradient: "linear-gradient(90deg, #c8102e, #ff5a00, #ffd400)" } },
  { key: "panamajack", href: "/calzado-seguridad", cta: "Ver Panama Jack", bg: { src: "/images/carousel/panama-jack-fondo.png", alt: "Botas Panama Jack" } },
];

function SlideContent({ slideKey }: { slideKey: string }) {
  switch (slideKey) {
    case "aquiles":
      return (
        <>
          <Image
            src="/images/carousel/aquiles-logo.png"
            alt="Aquiles"
            width={400}
            height={300}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-90"
          />
          <Image
            src="/images/carousel/aquiles-guante.png"
            alt="Guantes Aquiles"
            width={500}
            height={500}
            className="pointer-events-none absolute right-[4%] top-1/2 h-[85%] w-auto -translate-y-1/2 object-contain drop-shadow-xl sm:right-[10%]"
          />
        </>
      );
    case "dinaseg":
      return (
        <Image
          src="/images/logo.png"
          alt="Dinaseg"
          width={300}
          height={300}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      );
    case "calzado":
      return (
        <div className="absolute inset-0 flex items-center justify-around px-2">
          {[
            { logo: "/images/carousel/logo-climber.png", bota: "/images/carousel/bota-climber.png" },
            { logo: "/images/carousel/logo-proflex.png", bota: "/images/carousel/bota-proflex.png" },
            { logo: "/images/carousel/logo-tempest.png", bota: "/images/carousel/bota-tempest.png" },
          ].map((m) => (
            <div key={m.logo} className="flex flex-1 flex-col items-center gap-1 sm:gap-2">
              <Image src={m.logo} alt="" width={160} height={40} className="h-4 w-auto sm:h-8" />
              <Image src={m.bota} alt="Calzado de seguridad" width={260} height={260} className="h-16 w-auto object-contain sm:h-32" />
            </div>
          ))}
        </div>
      );
    case "panamajack":
      return (
        <Image
          src="/images/carousel/panama-jack-logo.png"
          alt="Panama Jack — Made in Spain"
          width={300}
          height={300}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      );
    default:
      return null;
  }
}

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[i];

  return (
    // Banner limpio, sin botones ni velo encima — Carlos pidió sacarlos
    // (21-sep-2026): el banner entero es un link a la categoría del slide,
    // y solo quedan los puntitos de abajo para cambiar de slide a mano.
    <Link
      href={slide.href}
      aria-label={slide.cta}
      className="relative block aspect-[1903/540] w-full overflow-hidden bg-dinaseg-gray"
    >
      {"src" in slide.bg ? (
        <Image src={slide.bg.src} alt={slide.bg.alt} fill className="object-cover" priority={i === 0} />
      ) : (
        <div className="absolute inset-0" style={{ background: slide.bg.gradient }} />
      )}
      <SlideContent slideKey={slide.key} />

      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 sm:bottom-4">
        {SLIDES.map((s, idx) => (
          <button
            key={s.key}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setI(idx);
            }}
            aria-label={`Ver slide ${idx + 1}`}
            className={`h-1.5 rounded-full shadow transition-all ${idx === i ? "w-6 bg-dinaseg-red" : "w-1.5 bg-white/70"}`}
          />
        ))}
      </div>
    </Link>
  );
}
