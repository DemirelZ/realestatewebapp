import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getAllPropertiesFromDb } from "@/lib/firestore";
import PropertyCard from "@/components/PropertyCard";

export default async function FeaturedProperties() {
  noStore();
  const allProperties = await getAllPropertiesFromDb();
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan İlanlar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En popüler ve değerli gayrimenkul fırsatlarını keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProperties
            ?.filter((p) => p.featured)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/ilanlar"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Tüm İlanları Görüntüle
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
