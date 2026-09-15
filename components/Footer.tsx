import Image from "next/image";
import Link from "next/link";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";

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

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Dinaseg. Todos los derechos reservados.
      </div>
    </footer>
  );
}
