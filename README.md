# Dinaseg-Web

Sitio público de Dinaseg (Next.js, App Router). Hermano de `Dinaseg-ERP`, repo
separado a propósito — ver `PLAN_WEB_PUBLICA.md` en `Dinaseg-ERP` para el plan
completo de arquitectura, fases y por qué la base de datos está aislada de la
del ERP.

## Estado (Fase 0 + Fase 1 del plan)

Scaffold funcionando con las 14 páginas de familia que necesita la campaña de
Google Ads (`marketing/google-ads/` en Dinaseg-ERP), contenido institucional
real (teléfonos, misión, dirección — sacados del sitio actual, sin relleno de
plantilla), y formulario de cotización. **Todavía sin desplegar** (sin cuenta
de Vercel ni de Neon creada) — funciona con datos de ejemplo/degradado hasta
que esas cuentas existan.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example`. Ninguna es obligatoria para levantar el sitio — sin
`PUBLIC_DB_URL` se muestra contenido institucional en vez de catálogo real, y
sin `SMTP_*` las cotizaciones quedan solo en el log del servidor (ver
`app/api/quotes/route.ts`).

## Estructura

- `app/[family]/page.tsx` — las 14 páginas de familia (slugs fijos, no
  renombrar sin actualizar también la campaña de Ads).
- `app/cotizar`, `app/contacto` — páginas de las sitelinks de la campaña.
- `app/api/quotes/route.ts` — recibe el formulario de cotización.
- `lib/families.ts` — las 14 familias canónicas (mismos slugs/nombres que
  `marketing/google-ads/ads_rsa.csv` en Dinaseg-ERP).
- `lib/site.ts` — datos institucionales reales (teléfonos, misión, dirección).
- `lib/products.ts` — lee catálogo de la tabla `public_products` en Neon,
  poblada por `server/public-sync.js` en Dinaseg-ERP (**ese script todavía no
  existe** — es tarea pendiente en ese otro repo; mientras tanto esta función
  devuelve `[]` y las páginas muestran contenido institucional en su lugar).
- `lib/db.ts` / `lib/mailer.ts` — conexión a Neon y envío de correo, ambos
  con degradación segura si las variables de entorno no están configuradas.

## Pendiente para Fase 1 completa (ver PLAN_WEB_PUBLICA.md)

1. ~~Crear repo en GitHub y pushear esto.~~ ✅ 15-sep-2026:
   [github.com/crivera-cmyk/Dinaseg-Web](https://github.com/crivera-cmyk/Dinaseg-Web).
2. Crear cuenta de Vercel, importar el repo, deploy.
3. Crear cuenta de Neon, pasar `PUBLIC_DB_URL` a Vercel.
4. Mover DNS de `www.dinaseg.cl` a Cloudflare apuntando a Vercel.
5. Implementar `server/public-sync.js` en Dinaseg-ERP (llena `public_products`).
6. Configurar `SMTP_*` y `NEXT_PUBLIC_GTAG_ID` en Vercel.
