"use client";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/slug";
import type { Property } from "@/data/properties";
import { MapPin, Bed, Bath, Ruler, Tag } from "lucide-react";
import { useState } from "react";

type ListingCardProps = {
  property: Property;
};

export default function ListingCard({ property }: ListingCardProps) {
  const [imgLoading, setImgLoading] = useState(true);
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
          className={`object-cover transition-opacity duration-200 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setImgLoading(false)}
        />
        {imgLoading && (
          <div className="absolute inset-0 grid place-items-center bg-gray-100">
            <div className="h-8 w-8 border-2 border-gray-700/40 border-t-gray-700 rounded-full animate-spin" />
          </div>
        )}
        <div
          className={`absolute top-4 right-4 ${badgeColor} ${badgeTextColor} px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {property.price} <span className="opacity-90">TL</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          {property.location}
        </div>

        {property.category === "Arsa" ? (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isRental ? "text-green-600" : "text-blue-600"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  {property.landSpecs?.metrekare ?? "-"}
                </span>
              </div>
              <div className="text-sm text-gray-600">Metrekare</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isRental ? "text-teal-600" : "text-green-600"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {property.landSpecs?.metrekareFiyati ?? "-"}
                </span>
              </div>
              <div className="text-sm text-gray-600">m² Fiyatı</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isRental ? "text-green-600" : "text-blue-600"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  {areaValue ? `${areaValue}m²` : "-"}
                </span>
              </div>
              <div className="text-sm text-gray-600">Metrekare</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isRental ? "text-teal-600" : "text-green-600"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {odaSalonText}
                </span>
              </div>
              <div className="text-sm text-gray-600">Oda</div>
            </div>
            {typeof property.housingSpecs?.banyoSayisi === "number" && (
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    isRental ? "text-emerald-600" : "text-indigo-600"
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.housingSpecs?.banyoSayisi}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Banyo</div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link
            href={`/${property.id}-${toSlug(property.title)}`}
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
