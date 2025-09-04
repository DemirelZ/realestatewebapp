"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getAllPropertiesFromDb, deleteProperty } from "@/lib/firestore";

export default function AdminDashboardPage() {
  const { auth } = getFirebaseClients();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  type DashboardProperty = {
    id: number;
    title: string;
    type: string;
    price: string;
  };
  const [items, setItems] = useState<DashboardProperty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    console.log("Dashboard useEffect running, auth:", auth);
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      console.log("Auth state changed:", u);
      if (!u) {
        console.log("No user, setting logged out");
        setUserLoggedIn(false);
        setLoading(false);
        return;
      }
      console.log("User logged in:", u.email);
      setUserLoggedIn(true);
      try {
        console.log("Fetching properties...");
        const data = await getAllPropertiesFromDb();
        console.log("Properties fetched:", data);
        setItems(data);
      } catch (err: unknown) {
        console.error("Error fetching properties:", err);
        const message =
          typeof err === "object" && err && "message" in err
            ? String(
                (err as { message?: unknown }).message ?? "Veriler alınamadı"
              )
            : "Veriler alınamadı";
        setError(message);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    });
    return () => unsub();
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProperty(id);
      // Silinen property'yi listeden kaldır
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: unknown }).message ?? "Bilinmeyen hata")
          : "Bilinmeyen hata";
      setError("İlan silinirken hata oluştu: " + msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2 text-gray-900">Yükleniyor...</div>
          <div className="text-sm text-gray-600">
            Auth durumu kontrol ediliyor
          </div>
        </div>
      </div>
    );
  }

  if (!userLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="mb-4 text-gray-900">Lütfen giriş yapın.</p>
          <Link
            href="/admin/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Sayfası
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/properties/new"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Yeni İlan
            </Link>
            <Link
              href="/admin/team/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kişi Ekle
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="bg-white rounded-xl shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-gray-900 font-semibold">ID</th>
                <th className="p-3 text-gray-900 font-semibold">Başlık</th>
                <th className="p-3 text-gray-900 font-semibold">Tür</th>
                <th className="p-3 text-gray-900 font-semibold">Fiyat</th>
                <th className="p-3 text-gray-900 font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-600">
                    Henüz ilan bulunmuyor
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-900 font-medium">{p.id}</td>
                    <td className="p-3 text-gray-900">{p.title}</td>
                    <td className="p-3 text-gray-900">{p.type}</td>
                    <td className="p-3 text-gray-900 font-medium">{p.price}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Düzenle
                      </Link>
                      <Link
                        href={`/ilan/${p.id}`}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        Görüntüle
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        disabled={deletingId === p.id}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === p.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
