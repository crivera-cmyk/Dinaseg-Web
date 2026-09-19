# Dinaseg-Web

Sitio público de Dinaseg (Next.js, App Router). Hermano de `Dinaseg-ERP`, repo
separado a propósito — ver `PLAN_WEB_PUBLICA.md` en `Dinaseg-ERP` para el plan
completo de arquitectura, fases y por qué la base de datos está aislada de la
del ERP.

## Estado (Fase 0 + Fase 1 del plan)

**🎉 Fase 1 completa, en producción en el dominio real:**
[www.dinaseg.cl](https://www.dinaseg.cl) (18-sep-2026 — antes en
`dinaseg-web.vercel.app`, que sigue funcionando como alias). Las 14 páginas
de familia que necesita la campaña de Google Ads
(`marketing/google-ads/` en Dinaseg-ERP) ya funcionan con **catálogo real**
(99,3% del catálogo del ERP, sincronizado por `server/public-sync.js` en
Dinaseg-ERP), contenido institucional real (teléfonos, misión, dirección), y
el formulario de cotización **guarda en Neon y manda correo a
contacto@dinaseg.cl** (SMTP confirmado en vivo, mismo Gmail que ya usa el
ERP). Falta solo fotos de producto (Fase 2, depende de la migración a
Cloudflare R2 del ERP) y `NEXT_PUBLIC_GTAG_ID` cuando Carlos tenga el ID de
conversión de Google Ads.

**DNS de `www.dinaseg.cl`:** CNAME a `e099770b43b852af.vercel-dns-017.com`
(específico de este proyecto — no el genérico `cname.vercel-dns.com`, ver
más abajo por qué), "DNS only" en Cloudflare (nube gris, sin proxy). El
dominio raíz `dinaseg.cl` (sin `www`) y el correo (MX/SPF) no se tocaron —
siguen exactamente igual que antes.

**Nota sobre el repo:** es **público** en GitHub (no privado) — necesario
porque el plan Hobby de Vercel bloquea el auto-deploy de commits con más de
un autor (los `Co-Authored-By:` de Claude cuentan como "colaborador") en
repos privados. El código no tiene secretos (Neon/SMTP viven solo en
variables de entorno de Vercel), así que hacerlo público no expone nada
sensible.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example`. Ninguna es obligatoria para levantar el sitio — sin
`DB_URL` se muestra contenido institucional en vez de catálogo real, y
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
  poblada por `server/public-sync.js` en Dinaseg-ERP (ya implementado y
  sincronizando — 99,3% del catálogo real). Si esa tabla estuviera vacía,
  esta función devuelve `[]` y las páginas muestran contenido institucional
  en su lugar (degradación, no debería pasar en producción normalmente).
- `lib/db.ts` / `lib/mailer.ts` — conexión a Neon y envío de correo, ambos
  con degradación segura si las variables de entorno no están configuradas.

## Pendiente para Fase 1 completa (ver PLAN_WEB_PUBLICA.md)

1. ~~Crear repo en GitHub y pushear esto.~~ ✅ 15-sep-2026:
   [github.com/crivera-cmyk/Dinaseg-Web](https://github.com/crivera-cmyk/Dinaseg-Web)
   (público, ver nota arriba).
2. ~~Crear cuenta de Vercel, importar el repo, deploy.~~ ✅ 15-sep-2026:
   [dinaseg-web.vercel.app](https://dinaseg-web.vercel.app).
3. ~~Crear cuenta de Neon, pasar `DB_URL` a Vercel.~~ ✅ 15-sep-2026 — confirmado
   funcionando de punta a punta (formulario → Neon).
4. ~~Mover DNS de `www.dinaseg.cl` a Cloudflare apuntando a Vercel.~~ ✅
   18-sep-2026 — ver detalle de DNS más arriba y en `PLAN_WEB_PUBLICA.md`.
5. ~~Implementar `server/public-sync.js` en Dinaseg-ERP.~~ ✅ 15-sep-2026 —
   99,3% del catálogo (6402/6449 productos) sincronizado.
6. ~~Configurar `SMTP_*`.~~ ✅ 15-sep-2026 — correo de cotización confirmado
   en vivo.

**Fase 1 queda completa.** Solo falta `NEXT_PUBLIC_GTAG_ID` (cuando Carlos
tenga el ID de conversión de Google Ads a mano) y fotos de producto reales
(Fase 2, depende de la migración a R2 del ERP).
