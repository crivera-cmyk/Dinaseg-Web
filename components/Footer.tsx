import Image from "next/image";
import Link from "next/link";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";
import NewsletterForm from "./NewsletterForm";

// Sin ciudades de plantilla ("Our Stores: New York, London...") ni crédito de
// la agencia anterior — contenido real de Dinaseg únicamente (ver
// PLAN_WEB_PUBLICA.md, sección "Contexto").
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Image src="/images/logo.png" alt="Dinaseg" width={48} height={48} className="h-12 w-12 mb-3" />
          <p className="text-sm text-zinc-600">{SITE.tagline}</p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-dinaseg-red"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            @dinaseg_
          </a>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-dinaseg-gray">Productos</h3>
          <ul className="space-y-1.5 text-sm text-zinc-600">
            {FAMILIES.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <Link href={`/${f.slug}`} className="hover:text-dinaseg-red">
                  {f.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-dinaseg-gray">Empresa</h3>
          <ul className="space-y-1.5 text-sm text-zinc-600">
            <li>
              <Link href="/contacto" className="hover:text-dinaseg-red">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/cotizar" className="hover:text-dinaseg-red">
                Cotizar
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-zinc-600">
          <h3 className="mb-3 text-sm font-semibold text-dinaseg-gray">Contacto</h3>
          <p>{SITE.direccion}</p>
          <ul className="mt-2 space-y-1">
            {SITE.telefonos.map((t) => (
              <li key={t}>
                <a href={`tel:${t.replace(/\s/g, "")}`} className="hover:text-dinaseg-red">
                  {t}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${SITE.email}`} className="mt-2 block hover:text-dinaseg-red">
            {SITE.email}
          </a>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-dinaseg-gray">Novedades y ofertas</h3>
            <p className="text-xs text-zinc-500">Suscribite para enterarte de nuevos productos y promociones.</p>
          </div>
          <div className="w-full sm:w-80">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Dinaseg. Todos los derechos reservados.
      </div>
    </footer>
  );
}
