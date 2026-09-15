// lib/families.ts
// Las 14 familias canónicas — mismos slugs que marketing/google-ads/ads_rsa.csv
// en Dinaseg-ERP (las URLs ya están cargadas en la campaña de Google Ads, no
// se pueden cambiar sin editar la campaña también).
export type Family = {
  slug: string;
  nombre: string;
  /** Palabras clave/producto destacadas del grupo de anuncios (para chips y SEO) */
  destacados: string[];
  /** Descripción corta única por página (evita contenido duplicado entre las 14) */
  intro: string;
};

export const FAMILIES: Family[] = [
  {
    slug: "accesorios",
    nombre: "Accesorios",
    destacados: ["Accesorios de seguridad", "Accesorios EPP para empresa", "Accesorios industriales"],
    intro:
      "Accesorios complementarios de protección personal para equipar a tu equipo de trabajo: desde elementos de sujeción hasta complementos para el resto de tu EPP.",
  },
  {
    slug: "calzado-seguridad",
    nombre: "Calzado de Seguridad",
    destacados: ["Zapatos de seguridad", "Calzado con puntera de acero", "Botas de seguridad", "Steelpro y Hardwork"],
    intro:
      "Zapatos y botas de seguridad con puntera de acero, certificados para minería, construcción y faenas industriales. Marcas Steelpro y Hardwork con stock permanente.",
  },
  {
    slug: "cascos-seguridad",
    nombre: "Cascos de Seguridad",
    destacados: ["Cascos industriales", "Cascos certificados", "Cascos con barbiquejo"],
    intro:
      "Cascos de seguridad industriales certificados, con y sin barbiquejo, para protección de cabeza en faenas de riesgo.",
  },
  {
    slug: "duchas-lavaojos",
    nombre: "Duchas y Lavaojos",
    destacados: ["Duchas de emergencia", "Estaciones lavaojos", "Cumple norma de seguridad"],
    intro:
      "Duchas de emergencia y estaciones lavaojos para instalaciones industriales, fabricadas para cumplir la normativa de seguridad vigente.",
  },
  {
    slug: "emergencia-vialidad",
    nombre: "Emergencia y Vialidad",
    destacados: ["Señalética vial", "Conos de seguridad", "Kits de emergencia", "Elementos de vialidad"],
    intro:
      "Señalética vial, conos y kits de emergencia para faenas, obras y flotas de transporte que necesitan cumplir con protocolos de vialidad.",
  },
  {
    slug: "equipos-instrumentacion",
    nombre: "Equipos e Instrumentación",
    destacados: ["Detectores de gas", "Instrumentos de medición", "Equipos de medición"],
    intro:
      "Equipos de instrumentación y medición, incluyendo detectores de gas, para monitoreo de condiciones de riesgo en terreno.",
  },
  {
    slug: "proteccion-auditiva",
    nombre: "Protección Auditiva",
    destacados: ["Tapones auditivos", "Orejeras de seguridad", "Protección para oídos"],
    intro:
      "Tapones y orejeras de protección auditiva certificados, para ambientes de trabajo con exposición a ruido industrial.",
  },
  {
    slug: "proteccion-caida",
    nombre: "Protección Caída",
    destacados: ["Arneses de seguridad", "Líneas de vida", "Trabajo en altura"],
    intro:
      "Arneses, líneas de vida y sistemas de protección contra caídas para trabajo en altura, con la certificación que exige la norma chilena.",
  },
  {
    slug: "proteccion-dermica",
    nombre: "Protección Dérmica",
    destacados: ["Cremas de protección", "Cuidado de la piel", "Protección dérmica para empresa"],
    intro:
      "Cremas y productos de protección dérmica para cuidar la piel de tus trabajadores expuestos a agentes químicos, sol o frío industrial.",
  },
  {
    slug: "proteccion-manos",
    nombre: "Protección Manos",
    destacados: ["Guantes de seguridad", "Guantes industriales", "Guantes al por mayor"],
    intro:
      "Guantes de seguridad industrial para todo tipo de faena, con despacho al por mayor a empresas y contratistas de la Región Metropolitana.",
  },
  {
    slug: "proteccion-respiratoria",
    nombre: "Protección Respiratoria",
    destacados: ["Mascarillas de seguridad", "Respiradores industriales", "Filtros respiratorios"],
    intro:
      "Mascarillas, respiradores y filtros de protección respiratoria certificados para ambientes con polvo, gases o material particulado.",
  },
  {
    slug: "proteccion-visual",
    nombre: "Protección Visual",
    destacados: ["Lentes de seguridad", "Lentes certificados", "Lentes industriales"],
    intro:
      "Lentes de seguridad industrial certificados para protección visual frente a impacto, polvo y salpicaduras químicas.",
  },
  {
    slug: "sistemas-bloqueo",
    nombre: "Sistemas de Bloqueo",
    destacados: ["Sistemas de bloqueo LOTO", "Candados de bloqueo", "Bloqueo y etiquetado"],
    intro:
      "Sistemas de bloqueo y etiquetado (LOTO) y candados de seguridad industrial para control de energías peligrosas.",
  },
  {
    slug: "vestuario",
    nombre: "Vestuario",
    destacados: ["Ropa de trabajo", "Vestuario industrial", "Uniformes corporativos", "Impermeables industriales"],
    intro:
      "Ropa de trabajo, uniformes corporativos e impermeables industriales para equipar a tu empresa, con despacho a todo Santiago.",
  },
];

export function getFamily(slug: string): Family | undefined {
  return FAMILIES.find((f) => f.slug === slug);
}
