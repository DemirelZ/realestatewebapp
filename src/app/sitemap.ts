import type { MetadataRoute } from "next";
// removed unused getPropertyByIdFromDb import
import { readdir } from "fs/promises";
import path from "path";

// Fallback static routes
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  // Attempt to discover some property IDs by reading a simple cache folder if exists (optional)
  try {
    const cacheDir = path.join(process.cwd(), ".next-cache", "properties");
    const files = await readdir(cacheDir);
    for (const f of files) {
      const id = Number(path.parse(f).name);
      if (Number.isFinite(id)) {
        // Keep current /ilan/[id] structure for now; will switch to slug later in task
        entries.push({
          url: `${baseUrl}/ilan/${id}`,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    }
  } catch {
    // ignore
  }

  return entries;
}
