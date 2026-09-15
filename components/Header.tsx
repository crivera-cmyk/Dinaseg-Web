"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [familiasAbierto, setFamiliasAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      {/* Barra superior con teléfono — visible siempre, es lo que un lead de Ads busca primero */}
      <div className="bg-dinaseg-gray text-white text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-1.5">
          <a href={`tel:${SITE.telefonos[0].replace(/\s/g, "")}`} className="hover:underline">
            📞 {SITE.telefonos[0]}
          </a>
          <a href={`mailto:${SITE.email}`} className="hidden sm:inline hover:underline">
            {SITE.email}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/logo.png" alt="Dinaseg" width={40} height={40} className="h-10 w-10" priority />
          <span className="text-lg font-extrabold tracking-tight text-dinaseg-gray">
            DINA<span className="text-dinaseg-red">SEG</span>
          </span>
        </Link>

        {/* Nav escritorio */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-dinaseg-gray">
          <div
            className="relative"
            onMouseEnter={() => setFamiliasAbierto(true)}
            onMouseLeave={() => setFamiliasAbierto(false)}
          >
            <button className="flex items-center gap-1 py-2 hover:text-dinaseg-red">
              Productos
              <span aria-hidden>▾</span>
            </button>
            {familiasAbierto && (
              <div className="absolute left-0 top-full grid w-[520px] grid-cols-2 gap-1 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
                {FAMILIES.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/${f.slug}`}
                    className="rounded px-3 py-2 text-sm hover:bg-zinc-50 hover:text-dinaseg-red"
                  >
                    {f.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/contacto" className="hover:text-dinaseg-red">
            Contacto
          </Link>
          <Link
            href="/cotizar"
            className="rounded-md bg-dinaseg-red px-4 py-2 font-semibold text-white hover:bg-dinaseg-red-dark"
          >
            Cotizar
          </Link>
        </nav>

        {/* Botón menú móvil */}
        <button
          className="md:hidden rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-dinaseg-gray"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* Nav móvil */}
      {menuAbierto && (
        <nav className="md:hidden border-t border-zinc-200 bg-white px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase text-zinc-400">Productos</p>
          <div className="mb-3 grid grid-cols-2 gap-1">
            {FAMILIES.map((f) => (
              <Link
                key={f.slug}
                href={`/${f.slug}`}
                className="rounded px-2 py-1.5 text-sm text-dinaseg-gray hover:bg-zinc-50"
                onClick={() => setMenuAbierto(false)}
              >
                {f.nombre}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3">
            <Link href="/contacto" className="text-sm font-medium text-dinaseg-gray" onClick={() => setMenuAbierto(false)}>
              Contacto
            </Link>
            <Link
              href="/cotizar"
              className="rounded-md bg-dinaseg-red px-4 py-2 text-center font-semibold text-white"
              onClick={() => setMenuAbierto(false)}
            >
              Cotizar
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
