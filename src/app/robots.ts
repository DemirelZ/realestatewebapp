import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://neseligayrimenkul.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"], // Tüm siteye izin
        // JS/CSS klasörlerini BLOKLAMA: /_next ve /static'i disallow etme!
        disallow: ["/admin/", "/api/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // Host (opsiyonel ama güzel)
    host: baseUrl.replace(/^https?:\/\//, ""),
  };
}
