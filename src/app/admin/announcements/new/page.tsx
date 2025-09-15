"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClients } from "@/lib/firebase";
import { createAnnouncement } from "@/lib/announcements";

export default function NewAnnouncementPage() {
  const { auth } = getFirebaseClients();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAllowed(Boolean(u)));
    return () => unsub();
  }, [auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allowed) return;
    if (title.trim() === "") {
      setError("Başlık gerekli");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createAnnouncement({
        title,
        content: content || undefined,
        visible,
      });
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kayıt başarısız";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 text-lg">Giriş gerekli</p>
          <p className="text-gray-600 mt-2">Lütfen admin girişi yapın</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Duyuru</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Başlık
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Yeni kampanya"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              İçerik
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Duyuru detayları"
            />
          </div>
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900 font-medium">Yayında</span>
            </label>
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <div className="flex justify-end">
            <button
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
