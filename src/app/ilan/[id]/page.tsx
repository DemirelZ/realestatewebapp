import { allProperties } from "@/data/properties";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allProperties.map((p) => ({ id: String(p.id) }));
}

export default async function IlanDetay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = Number(id);
  const property = allProperties.find((p) => p.id === num);

  if (!Number.isFinite(num) || !property) {
    notFound();
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          property.mainImage && property.mainImage.trim() !== ""
            ? property.mainImage
            : property.image && property.image.trim() !== ""
            ? property.image
            : "/images/no-images.png",
        ];

  return (
    <main className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageCarousel images={images} alt={property.title} />

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {property.title}
              </h1>
              <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                {property.type}
              </span>
            </div>
            <p className="text-gray-600 mb-4 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {property.location}
            </p>

            <div className="text-3xl font-bold text-blue-600 mb-6">
              {property.price}
            </div>

            {property.category === "Arsa" ? (
              <div className="space-y-2">
                <DetailRow label="Alan" value={property.landSpecs?.metrekare} />
                <DetailRow
                  label="Metrekare Fiyatı"
                  value={property.landSpecs?.metrekareFiyati}
                />
                <DetailRow
                  label="İmar Durumu"
                  value={property.landSpecs?.imarDurumu}
                />
                <DetailRow label="Ada No" value={property.landSpecs?.adaNo} />
                <DetailRow
                  label="Parsel No"
                  value={property.landSpecs?.parselNo}
                />
                <DetailRow
                  label="Pafta No"
                  value={property.landSpecs?.paftaNo}
                />
                <DetailRow
                  label="KAKS (Emsal)"
                  value={property.landSpecs?.kaksEmsal}
                />
                <DetailRow label="Gabari" value={property.landSpecs?.gabari} />
                <DetailRow
                  label="Krediye Uygunluk"
                  value={property.landSpecs?.krediyeUygunluk}
                />
                <DetailRow
                  label="Tapu Durumu"
                  value={property.landSpecs?.tapuDurumu}
                />
                <DetailRow label="Takas" value={property.landSpecs?.takas} />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>Oda: {property.bedrooms}</div>
                  <div>Banyo: {property.bathrooms}</div>
                  <div>
                    Alan:{" "}
                    {property.housingSpecs?.netMetrekare ??
                      property.housingSpecs?.brutMetrekare}
                    {property.housingSpecs?.netMetrekare ||
                    property.housingSpecs?.brutMetrekare
                      ? " m²"
                      : ""}
                  </div>
                </div>
                <DetailRow
                  label="m² (Brüt)"
                  value={property.housingSpecs?.brutMetrekare?.toString()}
                />
                <DetailRow
                  label="m² (Net)"
                  value={property.housingSpecs?.netMetrekare?.toString()}
                />
                <DetailRow
                  label="Bina Yaşı"
                  value={property.housingSpecs?.binaYasi?.toString()}
                />
                <DetailRow
                  label="Kat Sayısı"
                  value={property.housingSpecs?.katSayisi?.toString()}
                />
                <DetailRow
                  label="Isıtma"
                  value={property.housingSpecs?.isitma}
                />
                <DetailRow
                  label="Mutfak"
                  value={property.housingSpecs?.mutfak}
                />
                <DetailRow
                  label="Banyo Sayısı"
                  value={property.housingSpecs?.banyoSayisi?.toString()}
                />
                <DetailRow
                  label="Otopark"
                  value={property.housingSpecs?.otopark ? "Var" : "Yok"}
                />
                <DetailRow
                  label="Balkon"
                  value={property.housingSpecs?.balkon ? "Var" : "Yok"}
                />
                <DetailRow
                  label="Asansör"
                  value={property.housingSpecs?.asansor ? "Var" : "Yok"}
                />
                <DetailRow
                  label="Eşyalı"
                  value={property.housingSpecs?.esyali ? "Evet" : "Hayır"}
                />
                <DetailRow
                  label="Kullanım Durumu"
                  value={property.housingSpecs?.kullanimDurumu}
                />
                <DetailRow
                  label="Site İçerisinde"
                  value={
                    property.housingSpecs?.siteIcerisinde ? "Evet" : "Hayır"
                  }
                />
                {property.housingSpecs?.siteAdi && (
                  <DetailRow
                    label="Site Adı"
                    value={property.housingSpecs.siteAdi}
                  />
                )}
                {property.housingSpecs?.aidat && (
                  <DetailRow
                    label="Aidat"
                    value={property.housingSpecs.aidat}
                  />
                )}
              </div>
            )}

            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/ilanlar"
                  className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  İlanlara Dön
                </Link>
                {(property.landSpecs?.url || property.housingSpecs?.url) && (
                  <a
                    href={
                      (property.landSpecs?.url ||
                        property.housingSpecs?.url) as string
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    İlan detayına git
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h4m0 0v4m0-4L10 14m-1-7H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
