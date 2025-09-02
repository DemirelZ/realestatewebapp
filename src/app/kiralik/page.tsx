"use client";

import { useState } from "react";
import Image from "next/image";

// Örnek kiralık emlak verileri
const kiralikEmlaklar = [
  {
    id: 1,
    title: "Şehir Merkezi 2+1 Daire",
    location: "Beşiktaş, İstanbul",
    price: "8.500 TL",
    period: "Aylık",
    area: "95m²",
    rooms: "2+1",
    floor: "3/7",
    age: "5 yıl",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
    features: ["Asansör", "Otopark", "Güvenlik", "Merkezi Isıtma"],
    description:
      "Beşiktaş'ın kalbinde, metro ve otobüs duraklarına yürüme mesafesinde. Market ve restoranlara yakın.",
  },
  {
    id: 2,
    title: "Bahçeli Müstakil Ev",
    location: "Çankaya, Ankara",
    price: "12.000 TL",
    period: "Aylık",
    area: "160m²",
    rooms: "3+1",
    floor: "Bahçe Katı",
    age: "8 yıl",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
    features: ["Bahçe", "Otopark", "Güvenlik", "Şömine"],
    description:
      "Çankaya'nın en güzel semtlerinden birinde, geniş bahçeli ev. Okul ve hastane yakınında.",
  },
  {
    id: 3,
    title: "Deniz Manzaralı Lüks Daire",
    location: "Karşıyaka, İzmir",
    price: "15.000 TL",
    period: "Aylık",
    area: "120m²",
    rooms: "2+1",
    floor: "10/12",
    age: "3 yıl",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
    features: ["Deniz Manzarası", "Havuz", "Spor Salonu", "Güvenlik"],
    description:
      "İzmir Körfezi manzaralı, lüks donanımlı daire. Sahil şeridinde, yürüyüş yollarına yakın.",
  },
  {
    id: 4,
    title: "Tarihi Konak",
    location: "Osmangazi, Bursa",
    price: "18.000 TL",
    period: "Aylık",
    area: "200m²",
    rooms: "4+1",
    floor: "2 Katlı",
    age: "Tarihi",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    features: ["Tarihi Dokunun Korunması", "Bahçe", "Otopark", "Şömine"],
    description:
      "Bursa'nın tarihi dokusunda, modern konforla birleştirilmiş konak. Tarihi merkeze yakın.",
  },
  {
    id: 5,
    title: "Villa Kiralık",
    location: "Beykoz, İstanbul",
    price: "25.000 TL",
    period: "Aylık",
    area: "250m²",
    rooms: "4+2",
    floor: "2 Katlı",
    age: "7 yıl",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop",
    features: ["Havuz", "Bahçe", "Otopark", "Güvenlik", "Akıllı Ev"],
    description:
      "Beykoz'un en güzel noktalarından birinde, lüks villa. Orman ve deniz manzarası.",
  },
  {
    id: 6,
    title: "Ofis Katı",
    location: "Şişli, İstanbul",
    price: "20.000 TL",
    period: "Aylık",
    area: "180m²",
    rooms: "Açık Ofis",
    floor: "6/15",
    age: "4 yıl",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
    features: ["Asansör", "Otopark", "Güvenlik", "Merkezi Konum"],
    description:
      "Şişli'nin iş merkezinde, modern ofis katı. Metro ve otobüs duraklarına yakın.",
  },
];

export default function KiralikPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const filteredEmlaklar = kiralikEmlaklar.filter((emlak) => {
    if (selectedLocation && !emlak.location.includes(selectedLocation))
      return false;
    if (selectedRoomType && !emlak.rooms.includes(selectedRoomType))
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
            Gayrimenkul'den güvenilir kiralık seçenekler
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
              <div
                key={emlak.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={emlak.image}
                    alt={emlak.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {emlak.price} {emlak.period}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {emlak.title}
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
                    {emlak.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {emlak.area}
                      </div>
                      <div className="text-sm text-gray-600">Metrekare</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">
                        {emlak.rooms}
                      </div>
                      <div className="text-sm text-gray-600">Oda</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {emlak.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {emlak.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                      Detayları Gör
                    </button>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Favorilere Ekle
                    </button>
                  </div>
                </div>
              </div>
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
            <a
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
