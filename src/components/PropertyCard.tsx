"use client";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/slug";
import type { Property } from "@/data/properties";
import { MapPin, Bed, Bath, Ruler, Tag } from "lucide-react";
import { useState } from "react";

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imgLoading, setImgLoading] = useState(true);
  const imageSrc =
    property.images &&
    property.images.length > 0 &&
    property.images[0].trim() !== ""
      ? property.images[0]
      : "/images/no-images.png";
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
        {property.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            Öne Çıkan
          </div>
        )}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.type}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {property.location}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          {property.category === "Arsa" ? (
            <>
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-1" />
                {property.landSpecs?.metrekare ?? "-"} m²
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Metrekare Fiyatı: {property.landSpecs?.metrekareFiyati ??
                  "-"}{" "}
                TL
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {(() => {
                  const oda = property.housingSpecs?.odaSayisi;
                  const salon = property.housingSpecs?.salonSayisi;
                  if (typeof oda === "number" && typeof salon === "number")
                    return `${oda}+${salon}`;
                  if (typeof oda === "number") return `${oda}+${salon ?? 0}`;
                  return "-";
                })()}
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                Banyo:{property.housingSpecs?.banyoSayisi ?? "-"}
              </div>
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-1" />
                {property.housingSpecs?.netMetrekare ??
                property.housingSpecs?.brutMetrekare
                  ? `${
                      property.housingSpecs?.netMetrekare ??
                      property.housingSpecs?.brutMetrekare
                    } m²`
                  : "-"}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {property.price}{" "}
            <span className="text-blue-600/90 text-xl">TL</span>
          </div>
          <Link
            href={`/${property.id}-${toSlug(property.title)}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );
}
