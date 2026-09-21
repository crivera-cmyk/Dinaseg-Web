import type { Metadata } from "next";
import CompanyRegisterForm from "@/components/CompanyRegisterForm";

export const metadata: Metadata = {
  title: "Registra tu empresa",
  description: "Registra tu empresa y obtén descuentos exclusivos por volumen.",
};

export default function RegistroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-dinaseg-gray">Registra tu empresa</h1>
      <p className="mt-2 text-zinc-600">
        Completa tus datos y te contactamos con descuentos exclusivos por volumen para tu empresa.
      </p>
      <div className="mt-8">
        <CompanyRegisterForm />
      </div>
    </div>
  );
}
