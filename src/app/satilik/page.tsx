"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import type { Property } from "@/data/properties";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function SatilikPage() {
  const [selectedLocation] = useState("");
  const [selectedRoomType] = useState("");
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/properties");
        const json = (await res.json()) as { data: Property[] };
        setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const satiliklar = items.filter((p) => p.type === "Satılık");

  const filteredEmlaklar = satiliklar.filter((emlak) => {
    if (selectedLocation && !emlak.location.includes(selectedLocation))
      return false;
    if (
      selectedRoomType &&
      !String(emlak.housingSpecs?.odaSayisi ?? "").includes(selectedRoomType)
    )
      return false;
    // Fiyat aralığı basit örnek (string fiyatlardan sayıya çevirmeden simge olarak kontrol edilmiyor)
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
            Hayalinizdeki eve sahip olun! Neşeli Gayrimenkul&#39;den özel seçim
            satılık emlaklar
          </p>
        </div>
      </section>

      {/* Emlak Listesi */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Spinner label="İlanlar yükleniyor" />
          ) : (
            <>
              {filteredEmlaklar.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-xl border border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Şu anda satılık ilan bulunmuyor
                  </h2>
                  <p className="mt-4 text-gray-600">
                    Yeni ilanlar eklendiğinde burada görünecek. Bizimle
                    iletişime geçebilir veya ana sayfaya dönebilirsiniz.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Link
                      href="/iletisim"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition-colors"
                    >
                      İletişime Geç
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Ana Sayfa
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEmlaklar.map((emlak) => (
                    <ListingCard key={emlak.id} property={emlak} />
                  ))}
                </div>
              )}
            </>
          )}
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
            <Link
              href="/iletisim"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İletişime Geçin
            </Link>
            <Link
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
