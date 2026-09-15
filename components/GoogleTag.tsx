import Script from "next/script";

// Google Tag para medir conversiones de la campaña de Ads (ver
// marketing/google-ads/README.txt en Dinaseg-ERP, sección "Seguimiento de
// conversiones"). No hace nada mientras Carlos no configure
// NEXT_PUBLIC_GTAG_ID en las variables de entorno de Vercel — no bloquea el
// resto del sitio.
export default function GoogleTag() {
  const id = process.env.NEXT_PUBLIC_GTAG_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
