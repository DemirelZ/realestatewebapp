"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import type { Property } from "@/data/properties";
import Link from "next/link";

// allProperties kullanılacak, yerel örnek veriler kaldırıldı

export default function KiralikPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [items, setItems] = useState<Property[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/properties");
      const json = (await res.json()) as { data: Property[] };
      setItems(json.data || []);
    })();
  }, []);

  const kiraliklar = items.filter((p) => p.type === "Kiralık");

  const filteredEmlaklar = kiraliklar.filter((emlak) => {
    if (selectedLocation && !emlak.location.includes(selectedLocation))
      return false;
    if (
      selectedRoomType &&
      !String(emlak.housingSpecs?.odaSayisi ?? "").includes(selectedRoomType)
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 overflow-hidden">
        {/* Modern Glassmorphism Background */}
        <div className="absolute inset-0">
          {/* Multiple Glassmorphism Layers */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl"></div>
          {/* Glassmorphism Shapes */}
          <div className="absolute inset-0">
            {/* Glassmorphism Circle */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
          </div>
          {/* Additional Glassmorphism Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Kiralık Emlak</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            İhtiyacınıza uygun kiralık emlakları keşfedin! Neşeli
            Gayrimenkul&#39;den güvenilir kiralık seçenekler
          </p>
        </div>
      </section>

      {/* Filtreler */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konum
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tüm Konumlar</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Bursa">Bursa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat Aralığı
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tüm Fiyatlar</option>
                <option value="0-5000">0 - 5.000 TL</option>
                <option value="5000-10000">5.000 - 10.000 TL</option>
                <option value="10000-20000">10.000 - 20.000 TL</option>
                <option value="20000+">20.000+ TL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oda Tipi
              </label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tüm Tipler</option>
                <option value="1+1">1+1</option>
                <option value="2+1">2+1</option>
                <option value="3+1">3+1</option>
                <option value="4+1">4+1</option>
                <option value="5+">5+ Oda</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Emlak Listesi */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kiralık Emlaklar
            </h2>
            <p className="text-lg text-gray-600">
              {filteredEmlaklar.length} adet emlak bulundu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEmlaklar.map((emlak) => (
              <ListingCard key={emlak.id} property={emlak} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Emlak Kiralamak mı İstiyorsunuz?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Neşeli Gayrimenkul olarak size en uygun kiralık emlakı bulmanıza
            yardımcı oluyoruz. Hemen iletişime geçin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İletişime Geçin
            </a>
            <Link
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
