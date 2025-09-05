"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createTeamMember } from "@/lib/team";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function NewTeamMemberPage() {
  const { auth, storage } = getFirebaseClients();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
  const isEmailValid = email.trim() === "" || emailRegex.test(email.trim());
  const isPhoneValid = phone.trim() === "" || phoneRegex.test(phone.trim());
  const isValid =
    name.trim().length > 0 && isEmailValid && isPhoneValid && (order ?? 0) >= 0;
  const canSave = allowed && !saving && isValid;

  function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
    return Promise.race<T>([
      promise,
      new Promise<T>((_resolve, reject) =>
        setTimeout(() => reject(new Error(label + " zaman aşımı")), ms)
      ),
    ]);
  }

  async function uploadImageWithProgress(file: File): Promise<string> {
    // validate type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Desteklenmeyen dosya türü. Lütfen JPG/PNG/WEBP seçin.");
    }
    const maxSizeBytes = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSizeBytes) {
      throw new Error("Dosya çok büyük (maks 8MB)");
    }

    const safeName = file.name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const fileRef = ref(storage, `team/${Date.now()}-${safeName || "upload"}`);

    return await new Promise<string>((resolve, reject) => {
      const task = uploadBytesResumable(fileRef, file, {
        contentType: file.type,
      });
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setUploadProgress(pct);
        },
        (err) => {
          reject(err);
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAllowed(Boolean(u));
    });
    return () => unsub();
  }, [auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allowed) return;
    if (!isValid) {
      setError("Lütfen formu kontrol edin");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      console.log("[TEAM] Submit started");
      let imageUrl = "";
      if (imageFile) {
        console.log("[TEAM] Upload starting", imageFile.name, imageFile.size);
        setUploadProgress(0);
        setUploadMessage(null);
        try {
          imageUrl = await withTimeout(
            uploadImageWithProgress(imageFile),
            60000,
            "Yükleme"
          );
          console.log("[TEAM] Upload success");
        } catch (uploadErr) {
          const msg =
            uploadErr instanceof Error
              ? uploadErr.message
              : "Fotoğraf yükleme başarısız";
          console.warn(
            "[TEAM] Upload failed, saving without image:",
            uploadErr
          );
          setUploadMessage(msg + ". Görsel olmadan kaydedilecek.");
        } finally {
          setUploadProgress(null);
        }
      }
      await withTimeout(
        createTeamMember({
          name,
          title: title || undefined,
          phone: phone || undefined,
          email: email || undefined,
          description: description || undefined,
          image: imageUrl || undefined,
          order,
          visible,
        }),
        15000,
        "Kayıt"
      );
      console.log("[TEAM] Create success");
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kayıt başarısız";
      console.error("[TEAM] Submit error:", err);
      setError(message);
    } finally {
      console.log("[TEAM] Submit finished");
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Kişi</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Ad Soyad
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ahmet Neşeli"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Unvan
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Satış Müdürü"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Sıra
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Telefon
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: +90 5xx xxx xx xx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                E-posta
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Örn: ahmet@orneksirket.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Açıklama
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Kısa biyografi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fotoğraf
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadProgress !== null && (
              <div className="mt-2 text-sm text-gray-700">
                Yükleme: {uploadProgress}%
              </div>
            )}
            {uploadMessage && (
              <div className="mt-1 text-xs text-yellow-700">
                {uploadMessage}
              </div>
            )}
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
              disabled={!canSave}
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
