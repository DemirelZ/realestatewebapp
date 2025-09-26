"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getVisibleAnnouncementsFromDb,
  type Announcement,
} from "@/lib/announcements";

export default function DuyurularPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getVisibleAnnouncementsFromDb();
        setAnnouncements(data);
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err && "message" in err
            ? String(
                (err as { message?: unknown }).message ?? "Duyurular alınamadı"
              )
            : "Duyurular alınamadı";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Duyurular</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Önemli güncellemeler, haberler ve duyurularımız
          </p>
        </div>
      </section>
      <main className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-4 text-gray-600">Duyurular yükleniyor...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <span className="text-red-600 text-4xl">⚠️</span>
                <p className="mt-2 text-red-800 font-medium">Hata</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && announcements.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl">📢</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Henüz duyuru bulunmuyor
              </h3>
              <p className="mt-2 text-gray-600">
                Yakında önemli duyurularımızı burada paylaşacağız.
              </p>
            </div>
          )}

          {/* Announcements List */}
          {!loading && !error && announcements.length > 0 && (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-amber-950 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 text-xl">📢</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {announcement.title}
                      </h2>
                      {announcement.content && (
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {announcement.content}
                          </p>
                        </div>
                      )}
                      {announcement.createdAt && (
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <span className="mr-2">📅</span>
                          <time>
                            {new Date(
                              announcement.createdAt?.toMillis?.() ?? Date.now()
                            ).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
