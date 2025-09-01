import Image from "next/image";
import Link from "next/link";

const featuredProperties = [
  {
    id: 1,
    title: "Modern 3+1 Daire",
    location: "Kadıköy, İstanbul",
    price: "2.500.000 TL",
    type: "Satılık",
    bedrooms: 3,
    bathrooms: 2,
    area: "120m²",
    image: "/images/properties/modern-apartment.jpg", // Yerel image
    featured: true,
  },
  {
    id: 2,
    title: "Lüks Villa",
    location: "Çeşme, İzmir",
    price: "8.500.000 TL",
    type: "Satılık",
    bedrooms: 5,
    bathrooms: 4,
    area: "350m²",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: 3,
    title: "Merkezi Konumda 2+1",
    location: "Ankara, Çankaya",
    price: "15.000 TL",
    type: "Kiralık",
    bedrooms: 2,
    bathrooms: 1,
    area: "85m²",
    image: "/images/properties/central-apartment.jpg", // Yerel image
    featured: false,
  },
  {
    id: 4,
    title: "Deniz Manzaralı Dubleks",
    location: "Bodrum, Muğla",
    price: "4.200.000 TL",
    type: "Satılık",
    bedrooms: 4,
    bathrooms: 3,
    area: "180m²",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "Ticari Ofis",
    location: "İstanbul, Şişli",
    price: "25.000 TL",
    type: "Kiralık",
    bedrooms: 0,
    bathrooms: 2,
    area: "200m²",
    image: "/images/properties/office-space.jpg", // Yerel image
    featured: false,
  },
  {
    id: 6,
    title: "Bahçeli Müstakil Ev",
    location: "Bursa, Nilüfer",
    price: "3.800.000 TL",
    type: "Satılık",
    bedrooms: 3,
    bathrooms: 2,
    area: "150m²",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    featured: false,
  },
];

export default function FeaturedProperties() {
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
          {featuredProperties?.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative h-64">
                <Image
                  src={property?.image}
                  alt={property?.title}
                  fill
                  className="object-cover"
                />
                {property?.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Öne Çıkan
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property?.type}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {property?.title}
                </h3>
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
                  {property?.location}
                </p>

                {/* Property Features */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {property?.bedrooms} Yatak
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property?.bathrooms} Banyo
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property?.area}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {property?.price}
                  </div>
                  <Link
                    href={`/ilan/${property?.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            </div>
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
