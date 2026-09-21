"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import SearchBox from "./SearchBox";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [familiasAbierto, setFamiliasAbierto] = useState(false);
  const { total } = useCart();

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
        {/* El PNG ya trae el nombre "DINASEG" integrado bajo el ícono (mismo
            archivo que el sitio institucional en dinaseg.cl) — antes se
            mostraba el ícono solo + un "DINASEG" tipeado aparte, que no
            calzaba con la marca real (pedido de Carlos, 20-sep-2026). */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/images/logo.png" alt="Dinaseg" width={56} height={56} className="h-14 w-14" priority />
        </Link>

        {/* Buscador — a pedido de Carlos, 21-sep-2026: el catálogo tiene
            miles de productos y cada categoría solo muestra los primeros 24,
            así que un producto real (ej. Panama Jack) podía no verse en su
            categoría. El buscador consulta TODO el catálogo por nombre/SKU. */}
        <div className="hidden lg:block w-64">
          <SearchBox compact />
        </div>

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
          <Link href="/carrito" className="relative hover:text-dinaseg-red" aria-label="Carrito">
            🛒
            {total > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-dinaseg-red text-[10px] font-bold text-white">
                {total}
              </span>
            )}
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
          <div className="mb-3">
            <SearchBox compact initialQuery="" />
          </div>
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
              href="/carrito"
              className="text-sm font-medium text-dinaseg-gray"
              onClick={() => setMenuAbierto(false)}
            >
              🛒 Carrito {total > 0 ? `(${total})` : ""}
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
