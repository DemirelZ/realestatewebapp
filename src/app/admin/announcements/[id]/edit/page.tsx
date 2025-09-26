"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClients } from "@/lib/firebase";
import {
  getAllAnnouncementsFromDbAdmin,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/announcements";

export default function EditAnnouncementPage({
  params,
}: {
  params: { id: string };
}) {
  const { auth } = getFirebaseClients();
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAllowed(Boolean(u));
      if (!u) {
        setLoading(false);
        return;
      }
      try {
        const { id } = params;
        const list = await getAllAnnouncementsFromDbAdmin();
        const a = list.find((x) => x.id === id);
        if (!a) {
          setError("Duyuru bulunamadı");
        } else {
          setTitle(a.title);
          setContent(a.content ?? "");
          setVisible(a.visible !== false);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Yükleme hatası");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [auth, params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { id } = params;
      const payload: Partial<Announcement> = {
        title,
        content,
        visible,
      };
      await updateAnnouncement(id, payload);
      setSuccess("Duyuru güncellendi");
      setTimeout(() => router.push("/admin/dashboard"), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Güncelleme hatası");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu duyuruyu silmek istediğinizden emin misiniz?")) return;
    try {
      const { id } = params;
      await deleteAnnouncement(id);
      router.push("/admin/dashboard");
    } catch {
      setError("Silme hatası");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2 text-gray-900">Yükleniyor...</div>
          <div className="text-sm text-gray-600">Duyuru yükleniyor</div>
        </div>
      </div>
    );
  }

  if (!allowed) {
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Duyuru Düzenle</h1>
          <Link
            href="/admin/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Dashboard&apos;a Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Duyuru başlığı"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              İçerik
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Duyuru içeriği (opsiyonel)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="visible" className="ml-2 text-sm text-gray-900">
              Yayında
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Sil
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
