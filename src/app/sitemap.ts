import type { MetadataRoute } from "next";
import { readdir } from "fs/promises";
import path from "path";

const staticRoutes = [
  "/",
  "/ilanlar",
  "/satilik",
  "/kiralik",
  "/hakkimizda",
  "/iletisim",
  "/gizlilik-politikasi",
  "/kullanim-kosullari",
  "/cerez-politikasi",
  "/duyurular",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://neseligayrimenkul.vercel.app";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
    lastModified: now,
  }));

  // İlanları keşfetme (mevcut yaklaşımın kalsın, ama prod'da fs her zaman yok olabilir)
  try {
    const cacheDir = path.join(process.cwd(), ".next-cache", "properties");
    const files = await readdir(cacheDir);
    for (const f of files) {
      const id = Number(path.parse(f).name);
      if (Number.isFinite(id)) {
        entries.push({
          url: `${baseUrl}/ilan/${id}`,
          changeFrequency: "daily",
          priority: 0.8,
          lastModified: now, // elinde varsa gerçek updatedAt değerini koy
        });
      }
    }
  } catch {
    // Vercel serverless'ta bu klasör olmayabilir; önemli değil
  }

  return entries;
}
