"use client";

import { useState } from "react";

export default function Hero() {
  const [searchType, setSearchType] = useState("satilik");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hayalinizdeki Evi
            <span className="block text-yellow-300">Bulun</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Neşeli Gayrimenkul ile güvenilir, hızlı ve profesyonel emlak
            çözümleri
          </p>

          {/* Search Form */}
          <div className="bg-white/20 backdrop-blur-3xl rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Type */}
              <div className="md:col-span-1">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white bg-white/20 backdrop-blur-sm"
                >
                  <option value="satilik">Satılık</option>
                  <option value="kiralik">Kiralık</option>
                </select>
              </div>

              {/* Location */}
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Konum (İl, İlçe)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white bg-white/20 backdrop-blur-sm placeholder-white/70"
                />
              </div>

              {/* Property Type */}
              <div className="md:col-span-1">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white bg-white/20 backdrop-blur-sm"
                >
                  <option value="">Konut Tipi</option>
                  <option value="daire">Daire</option>
                  <option value="villa">Villa</option>
                  <option value="mustakil">Müstakil Ev</option>
                  <option value="duplex">Dubleks</option>
                  <option value="ticari">Ticari</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <button className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30">
                  Ara
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                20+
              </div>
              <div className="text-blue-100">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                500+
              </div>
              <div className="text-blue-100">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">7+</div>
              <div className="text-blue-100">Yıllık Deneyim</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
