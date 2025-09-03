"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createProperty } from "@/lib/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function NewPropertyPage() {
  const { auth, storage } = getFirebaseClients();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"Satılık" | "Kiralık">("Satılık");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAllowed(Boolean(u));
    });
    return () => unsub();
  }, [auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allowed) return;
    setSaving(true);
    setError(null);
    try {
      let image = "";
      if (imageFile) {
        const fileRef = ref(
          storage,
          `properties/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(fileRef, imageFile);
        image = await getDownloadURL(fileRef);
      }
      const created = await createProperty({
        title,
        location,
        price,
        type,
        category: "Konut",
        bedrooms,
        bathrooms,
        image,
        featured,
      });
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Kayıt başarısız");
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni İlan</h1>
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
              placeholder="Örn: Modern 3+1 Daire"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Konum
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Örn: Kadıköy, İstanbul"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fiyat
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 2.500.000 TL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Tür
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="Satılık">Satılık</option>
                <option value="Kiralık">Kiralık</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Oda Sayısı
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Banyo
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900 font-medium">Öne Çıkan</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Görsel
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
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
