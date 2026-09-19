import { SITE } from "@/lib/site";

// Botón flotante de chat directo por WhatsApp (no "compartir" — un link a
// wa.me abre una conversación nueva con el número de la empresa). Número
// elegido por Carlos, 18-sep-2026 (ver lib/site.ts).
export default function WhatsAppButton() {
  const mensaje = encodeURIComponent("Hola, quiero cotizar equipos de protección personal.");
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white" aria-hidden="true">
        <path d="M16.004 2.667c-7.36 0-13.333 5.973-13.333 13.333 0 2.353.615 4.56 1.692 6.475L2.667 29.333l7.03-1.845a13.26 13.26 0 0 0 6.307 1.605h.005c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667zm0 24.4a11 11 0 0 1-5.61-1.537l-.403-.24-4.172 1.095 1.114-4.067-.263-.417a10.98 10.98 0 0 1-1.684-5.9c0-6.075 4.943-11.018 11.02-11.018 6.075 0 11.018 4.943 11.018 11.02s-4.943 11.064-11.02 11.064zm6.05-8.257c-.332-.166-1.96-.967-2.264-1.078-.304-.11-.525-.166-.746.166-.22.333-.856 1.078-1.05 1.3-.194.22-.387.25-.72.083-.332-.166-1.4-.516-2.667-1.646-.986-.879-1.652-1.965-1.845-2.297-.194-.333-.021-.512.145-.678.15-.148.332-.387.499-.58.166-.194.22-.333.332-.555.11-.22.055-.416-.028-.582-.083-.166-.746-1.798-1.023-2.462-.27-.648-.544-.56-.746-.57l-.635-.012c-.22 0-.582.083-.887.416s-1.162 1.135-1.162 2.767 1.19 3.21 1.355 3.43c.166.22 2.34 3.573 5.668 5.01.792.342 1.41.546 1.892.699.795.253 1.518.217 2.09.132.638-.095 1.96-.802 2.235-1.577.276-.774.276-1.438.194-1.577-.083-.138-.304-.22-.636-.386z" />
      </svg>
    </a>
  );
}
