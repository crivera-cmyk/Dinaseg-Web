import type { MetadataRoute } from "next";
import { FAMILIES } from "@/lib/families";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE.urlBase, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.urlBase}/cotizar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.urlBase}/contacto`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const familias: MetadataRoute.Sitemap = FAMILIES.map((f) => ({
    url: `${SITE.urlBase}/${f.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...estaticas, ...familias];
}
