import { getAllPropertiesFromDb } from "@/lib/firestore";
import PropertyCard from "@/components/PropertyCard";

export const metadata = {
  title: "İlanlar",
};

export default async function IlanlarPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </main>
  );
}
