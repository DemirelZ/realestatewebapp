import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/properties";

type ListingCardProps = {
  property: Property;
};

export default function ListingCard({ property }: ListingCardProps) {
  const imageSrc =
    property.images &&
    property.images.length > 0 &&
    property.images[0].trim() !== ""
      ? property.images[0]
      : "/images/no-images.png";
  const isRental = property.type === "Kiralık";
  const badgeColor = isRental ? "bg-green-600" : "bg-blue-600";
  const badgeTextColor = "text-white";

  const areaValue =
    property.housingSpecs?.netMetrekare ?? property.housingSpecs?.brutMetrekare;

  const odaSalonText = (() => {
    const oda = property.housingSpecs?.odaSayisi;
    const salon = property.housingSpecs?.salonSayisi;
    if (typeof oda === "number" && typeof salon === "number")
      return `${oda}+${salon}`;
    if (typeof oda === "number") return `${oda}+${salon ?? 0}`;
    return "-";
  })();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-64">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div
          className={`absolute top-4 right-4 ${badgeColor} ${badgeTextColor} px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {property.price}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {property.location}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                isRental ? "text-green-600" : "text-blue-600"
              }`}
            >
              {areaValue ? `${areaValue}m²` : "-"}
            </div>
            <div className="text-sm text-gray-600">Metrekare</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                isRental ? "text-teal-600" : "text-green-600"
              }`}
            >
              {odaSalonText}
            </div>
            <div className="text-sm text-gray-600">Oda</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            href={`/ilan/${property.id}`}
            className={`${
              isRental
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
