// lib/site.ts — Datos institucionales reales de Dinaseg (NO placeholder).
// Teléfonos, misión y dirección tomados del sitio actual www.dinaseg.cl y de
// server/dispatches.js:5 (Dinaseg-ERP) — no inventar otros ni "completar" con
// datos de plantilla.
export const SITE = {
  nombre: "Dinaseg",
  tagline: "30 años a tu servicio",
  mision:
    "Ofrecemos implementos de seguridad industrial para cubrir las necesidades de protección personal de clientes en diferentes rubros y mercados, como el sector minero, construcción, faenas pesqueras, explotaciones forestales, manufactureras, entre otros, cumpliendo siempre con los estándares de calidad exigidos por nuestros clientes.",
  telefonos: ["+56 2 2698 1129", "+56 2 3323 5560", "+56 9 9829 7065"],
  direccion: "Av. El Ventisquero 1111, Renca, Santiago, Chile",
  email: "contacto@dinaseg.cl",
  urlBase: "https://www.dinaseg.cl",
  // Instagram real confirmado (@dinaseg_, cuenta activa). Facebook: por ahora
  // no se usa (decisión de Carlos, 18-sep-2026) — no agregar sin confirmar.
  instagram: "https://www.instagram.com/dinaseg_/",
  // Mismo celular que ya aparece como tercer teléfono — elegido por Carlos
  // para el botón de WhatsApp (chat directo, no "compartir").
  whatsapp: "56998297065",
};
