import Link from "next/link";

// Banners reales del home del sitio viejo (dinaseg.cl, sección "Registra tu
// empresa") — bajados y reusados acá a pedido de Carlos, 21-sep-2026. Son
// GIF animados originales (no next/image: Next los "desanima" al optimizar,
// y acá se quiere igual al sitio viejo). El sitio nuevo no tiene páginas de
// producto individual ni filtros de catálogo por marca/color todavía, así
// que los 4 apuntan a la categoría más cercana (Calzado de Seguridad) en
// vez de a la URL exacta del producto del sitio viejo.
const BANNERS = [
  { key: "edelbrock-cg", src: "/images/banners/edelbrock-carbon-grey.gif", alt: "Botín Edelbrock ED106K Carbon Grey" },
  { key: "edelbrock-edbk", src: "/images/banners/edelbrock-edbk501.gif", alt: "Botín Edelbrock EDBK-501 antideslizante" },
  { key: "nazca-sport", src: "/images/banners/nazca-sport-one-plus.gif", alt: "Zapatilla Nazca Sport One Plus" },
  { key: "nazca-xr", src: "/images/banners/nazca-xr22.gif", alt: "Botín Nazca XR22 cuero Pull Up" },
];

export default function PromoBanners() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-4 sm:grid-cols-2">
        {BANNERS.map((b) => (
          <Link
            key={b.key}
            href="/calzado-seguridad"
            className="block aspect-[1903/540] overflow-hidden rounded-lg bg-dinaseg-gray"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- GIF animado, next/image lo desanimaría */}
            <img src={b.src} alt={b.alt} className="h-full w-full object-cover" loading="lazy" />
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
        <div>
          <h2 className="text-xl font-bold text-dinaseg-gray sm:text-2xl">
            Registra tu empresa <span className="font-normal">y obtén</span> más descuentos
          </h2>
        </div>
        <Link
          href="/registro"
          className="shrink-0 rounded-md bg-dinaseg-gray px-6 py-3 font-semibold text-white hover:bg-black"
        >
          Regístrate aquí
        </Link>
      </div>
    </section>
  );
}
