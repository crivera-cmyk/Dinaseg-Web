import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleTag from "@/components/GoogleTag";
import WhatsAppButton from "@/components/WhatsAppButton";
import CompareBar, { CompareBarSpacer } from "@/components/CompareBar";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.urlBase),
  title: {
    // Pedido de Carlos, 21-sep-2026: en la pestaña del navegador se veía
    // "Dinaseg —" cortado (título largo) y con el ícono genérico de Next.js
    // en vez del logo real (favicon.ico quedó desactualizado del logo
    // viejo cuando se cambió public/images/logo.png el 20-sep — son
    // archivos separados, ver app/favicon.ico regenerado desde app/icon.png).
    default: `${SITE.nombre} - Seguridad Industrial`,
    template: `%s — ${SITE.nombre}`,
  },
  description: SITE.mision,
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITE.nombre,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GoogleTag />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareBarSpacer />
        <WhatsAppButton />
        <CompareBar />
      </body>
    </html>
  );
}
