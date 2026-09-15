import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Cotizar",
  description: "Solicita tu cotización de equipos de protección personal. Respuesta en 24 horas hábiles, sin compromiso.",
};

export default function CotizarPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-dinaseg-gray">Cotiza tu pedido</h1>
      <p className="mt-2 mb-8 text-zinc-600">
        Cuéntanos qué necesitas y te respondemos con precios y disponibilidad dentro de 24 horas hábiles.
      </p>
      <QuoteForm />
    </div>
  );
}
