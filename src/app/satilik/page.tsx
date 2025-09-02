"use client";

import { useState } from "react";
import Image from "next/image";

// Örnek satılık emlak verileri
const satilikEmlaklar = [
  {
    id: 1,
    title: "Modern 3+1 Daire",
    location: "Kadıköy, İstanbul",
    price: "2.450.000 TL",
    area: "125m²",
    rooms: "3+1",
    floor: "5/8",
    age: "2 yıl",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
    features: ["Asansör", "Otopark", "Güvenlik", "Merkezi Isıtma"],
    description:
      "Kadıköy'ün en merkezi lokasyonunda, yeni yapılmış modern daire. Metro ve otobüs duraklarına yürüme mesafesinde.",
  },
  {
    id: 2,
    title: "Bahçeli Müstakil Ev",
    location: "Çankaya, Ankara",
    price: "3.800.000 TL",
    area: "180m²",
    rooms: "4+1",
    floor: "Bahçe Katı",
    age: "5 yıl",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop",
    features: ["Bahçe", "Otopark", "Güvenlik", "Şömine"],
    description:
      "Çankaya'nın en prestijli semtinde, geniş bahçeli müstakil ev. Okul ve hastane yakınında.",
  },
  {
    id: 3,
    title: "Deniz Manzaralı Lüks Daire",
    location: "Karşıyaka, İzmir",
    price: "4.200.000 TL",
    area: "140m²",
    rooms: "3+1",
    floor: "12/15",
    age: "1 yıl",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
    features: ["Deniz Manzarası", "Havuz", "Spor Salonu", "Güvenlik"],
    description:
      "İzmir Körfezi manzaralı, lüks donanımlı yeni daire. Sahil şeridinde, yürüyüş yollarına yakın.",
  },
  {
    id: 4,
    title: "Tarihi Konak Restorasyonlu",
    location: "Osmangazi, Bursa",
    price: "5.500.000 TL",
    area: "220m²",
    rooms: "5+2",
    floor: "2 Katlı",
    age: "Restorasyonlu",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    features: ["Tarihi Dokunun Korunması", "Bahçe", "Otopark", "Şömine"],
    description:
      "Bursa'nın tarihi dokusunda, modern konforla birleştirilmiş restorasyonlu konak. Tarihi merkeze yakın.",
  },
  {
    id: 5,
    title: "Villa Projesi",
    location: "Beykoz, İstanbul",
    price: "8.900.000 TL",
    area: "280m²",
    rooms: "5+2",
    floor: "3 Katlı",
    age: "Yeni Proje",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop",
    features: ["Havuz", "Bahçe", "Otopark", "Güvenlik", "Akıllı Ev"],
    description:
      "Beykoz'un en güzel noktalarından birinde, lüks villa projesi. Orman ve deniz manzarası.",
  },
  {
    id: 6,
    title: "Ofis Katı",
    location: "Şişli, İstanbul",
    price: "6.750.000 TL",
    area: "200m²",
    rooms: "Açık Ofis",
    floor: "8/15",
    age: "3 yıl",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
    features: ["Asansör", "Otopark", "Güvenlik", "Merkezi Konum"],
    description:
      "Şişli'nin iş merkezinde, modern ofis katı. Metro ve otobüs duraklarına yakın, iş merkezlerine kolay erişim.",
  },
];

export default function SatilikPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const filteredEmlaklar = satilikEmlaklar.filter((emlak) => {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Satılık Emlak</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Hayalinizdeki eve sahip olun! Neşeli Gayrimenkul'den özel seçim
            satılık emlaklar
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Fiyatlar</option>
                <option value="0-2000000">0 - 2.000.000 TL</option>
                <option value="2000000-5000000">
                  2.000.000 - 5.000.000 TL
                </option>
                <option value="5000000+">5.000.000+ TL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oda Tipi
              </label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Satılık Emlaklar
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
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {emlak.price}
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
                      <div className="text-2xl font-bold text-blue-600">
                        {emlak.area}
                      </div>
                      <div className="text-sm text-gray-600">Metrekare</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {emlak.rooms}
                      </div>
                      <div className="text-sm text-gray-600">Oda</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {emlak.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {emlak.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                      Detayları Gör
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Emlak Satmak mı İstiyorsunuz?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Neşeli Gayrimenkul olarak emlakınızı en iyi fiyata satmanıza
            yardımcı oluyoruz. Hemen iletişime geçin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İletişime Geçin
            </a>
            <a
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
