"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getAllPropertiesFromDb, deleteProperty } from "@/lib/firestore";
import {
  getAllTeamMembersFromDbAdmin,
  deleteTeamMember,
  updateTeamMember,
  type TeamMember,
} from "@/lib/team";
import {
  getAllAnnouncementsFromDbAdmin,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/announcements";

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
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [ann, setAnn] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "team" | "ann">(
    "properties"
  );

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
        const [props, teamMembers, announcements] = await Promise.all([
          getAllPropertiesFromDb(),
          getAllTeamMembersFromDbAdmin(),
          getAllAnnouncementsFromDbAdmin(),
        ]);
        console.log("Properties fetched:", props);
        console.log("Team fetched:", teamMembers);
        console.log("Announcements fetched:", announcements);
        setItems(props);
        setTeam(teamMembers);
        setAnn(announcements);
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

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Bu kişiyi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTeamVisible = async (m: TeamMember) => {
    try {
      const newVisible = !(m.visible === false ? false : true);
      await updateTeamMember(m.id, { visible: newVisible });
      setTeam((prev) =>
        prev.map((t) => (t.id === m.id ? { ...t, visible: newVisible } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Bu duyuruyu silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteAnnouncement(id);
      setAnn((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
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
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={handleSignOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              Çıkış
            </button>
          </div>
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition-colors"
              >
                <span className="font-bold">➕</span>
                <span>Yeni İlan Ekle</span>
              </Link>
              <Link
                href="/admin/team/new"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>👤</span>
                <span>Kişi Ekle</span>
              </Link>
              <Link
                href="/admin/announcements/new"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>📣</span>
                <span>Duyuru Ekle</span>
              </Link>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-4 py-2 rounded-lg border ${
              activeTab === "properties"
                ? "bg-green-600 text-white border-green-600"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            İlanlar
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 rounded-lg border ${
              activeTab === "team"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            Ekip
          </button>
          <button
            onClick={() => setActiveTab("ann")}
            className={`px-4 py-2 rounded-lg border ${
              activeTab === "ann"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            }`}
          >
            Duyurular
          </button>
        </div>

        {activeTab === "properties" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>🏠</span>
                <span>İlanlar ({items.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">🏠</span>
                          <p className="text-gray-500 text-lg">
                            Henüz ilan bulunmuyor
                          </p>
                          <Link
                            href="/admin/properties/new"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            İlk ilanınızı ekleyin →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((p, index) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{p.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {p.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              p.type === "Satılık"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <Link
                              href={`/admin/properties/${p.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 transition-colors button"
                            >
                              Düzenle
                            </Link>
                            <Link
                              href={`/ilan/${p.id}`}
                              className="text-gray-600 hover:text-gray-800 transition-colors button"
                            >
                              Görüntüle
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              disabled={deletingId === p.id}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed button"
                            >
                              {deletingId === p.id ? "⏳ Siliniyor..." : "Sil"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>👥</span>
                <span>Ekip Üyeleri ({team.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unvan
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">👥</span>
                          <p className="text-gray-500 text-lg">
                            Henüz ekip üyesi yok
                          </p>
                          <Link
                            href="/admin/team/new"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            İlk ekip üyenizi ekleyin →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    team.map((m, index) => (
                      <tr
                        key={m.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {m.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {m.title ?? <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {m.order ?? <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              m.visible === false
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {m.visible === false ? "🔒 Gizli" : "✅ Yayında"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleToggleTeamVisible(m)}
                              className="text-blue-600 hover:text-blue-800 transition-colors margin-left-2"
                            >
                              {m.visible === false ? " Yayınla" : "🔒 Gizle"}
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(m.id)}
                              className="text-red-600 hover:text-red-800 transition-colors margin-left-2"
                            >
                              🗑️ Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ann" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>📣</span>
                <span>Duyurular ({ann.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ann.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">📣</span>
                          <p className="text-gray-500 text-lg">
                            Henüz duyuru yok
                          </p>
                          <Link
                            href="/admin/announcements/new"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            İlk duyurunuzu ekleyin →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    ann.map((a, index) => (
                      <tr
                        key={a.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                          {a.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              a.visible === false
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {a.visible === false ? "🔒 Gizli" : "✅ Yayında"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <Link
                              href={`/admin/announcements/${a.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              ✏️ Düzenle
                            </Link>
                            <button
                              onClick={() => handleDeleteAnnouncement(a.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              🗑️ Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
