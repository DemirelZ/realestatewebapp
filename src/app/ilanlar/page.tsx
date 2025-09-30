import { getAllPropertiesFromDb } from "@/lib/firestore";
import { unstable_noStore as noStore } from "next/cache";
import PropertyCard from "@/components/PropertyCard";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const title = "İlanlar | Neşeli Gayrimenkul";
  const description = "Satılık ve kiralık güncel ilanlar. Neşeli Gayrimenkul";
  const url = `${baseUrl}/ilanlar`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Neşeli Gayrimenkul",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function IlanlarPage() {
  noStore();
  const allProperties = await getAllPropertiesFromDb();
  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tüm İlanlar
          </h1>
          <p className="text-gray-600 mt-2">
            Toplam {allProperties.length} ilan bulundu
          </p>
        </div>

        {allProperties.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Şu anda görüntülenecek ilan bulunmuyor
            </h2>
            <p className="mt-4 text-gray-600">
              Yeni ilanlar eklendiğinde burada görünecek. Bu arada bizimle
              iletişime geçebilir veya ana sayfaya dönebilirsiniz.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition-colors"
              >
                İletişime Geç
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
