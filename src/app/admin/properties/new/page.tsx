"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createProperty } from "@/lib/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { Property } from "@/data/properties";

export default function NewPropertyPage() {
  const { auth, storage } = getFirebaseClients();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"Satılık" | "Kiralık">("Satılık");
  const [category, setCategory] = useState<"Konut" | "Arsa">("Konut");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");

  // Housing specs
  const [brutMetrekare, setBrutMetrekare] = useState<number | undefined>();
  const [netMetrekare, setNetMetrekare] = useState<number | undefined>();
  const [binaYasi, setBinaYasi] = useState<number | undefined>();
  const [bulunduguKat, setBulunduguKat] = useState<number | undefined>();
  const [katSayisi, setKatSayisi] = useState<number | undefined>();
  const [isitma, setIsitma] = useState("");
  const [mutfak, setMutfak] = useState<"Açık" | "Kapalı" | "Diğer">("Açık");
  const [banyoSayisi, setBanyoSayisi] = useState(1);
  const [otopark, setOtopark] = useState(false);
  const [balkon, setBalkon] = useState(false);
  const [asansor, setAsansor] = useState(false);
  const [esyali, setEsyali] = useState(false);
  const [kullanimDurumu, setKullanimDurumu] = useState("");
  const [siteIcerisinde, setSiteIcerisinde] = useState(false);
  const [siteAdi, setSiteAdi] = useState("");
  const [aidat, setAidat] = useState("");

  // Land specs (for Arsa category)
  const [imarDurumu, setImarDurumu] = useState("");
  const [metrekare, setMetrekare] = useState("");
  const [metrekareFiyati, setMetrekareFiyati] = useState("");
  const [adaNo, setAdaNo] = useState("");
  const [parselNo, setParselNo] = useState("");
  const [paftaNo, setPaftaNo] = useState("");
  const [kaksEmsal, setKaksEmsal] = useState("");
  const [gabari, setGabari] = useState("");
  const [krediyeUygunluk, setKrediyeUygunluk] = useState<
    "Evet" | "Hayır" | "Bilinmiyor"
  >("Bilinmiyor");
  const [tapuDurumu, setTapuDurumu] = useState("");
  const [takas, setTakas] = useState<"Evet" | "Hayır" | "Değerlendirilebilir">(
    "Hayır"
  );

  // Images
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAllowed(Boolean(u));
    });
    return () => unsub();
  }, [auth]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (images.length + fileArray.length > 10) {
      setError("Maksimum 10 resim yükleyebilirsiniz");
      return;
    }

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const storageRef = ref(
          storage,
          `properties/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      setError(null);
    } catch (err: unknown) {
      setError(
        "Resim yüklenirken hata: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsMainImage = (index: number) => {
    setMainImage(images[index]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allowed) return;
    setSaving(true);
    setError(null);
    try {
      const allImages = [...images];
      const mainImageUrl = allImages.length > 0 ? allImages[0] : "";

      const propertyData: any = {
        title,
        location,
        price,
        type,
        category,
        bedrooms,
        bathrooms,
        images: allImages,
        mainImage: mainImageUrl,
        featured,
      };

      // Konut özellikleri
      if (category === "Konut") {
        propertyData.housingSpecs = {
          brutMetrekare,
          netMetrekare,
          binaYasi,
          bulunduguKat,
          katSayisi,
          isitma,
          mutfak,
          banyoSayisi,
          otopark,
          balkon,
          asansor,
          esyali,
          kullanimDurumu,
          siteIcerisinde,
          siteAdi,
          aidat,
          description,
        };
      }

      // Arsa özellikleri
      if (category === "Arsa") {
        propertyData.landSpecs = {
          imarDurumu,
          metrekare,
          metrekareFiyati,
          adaNo,
          parselNo,
          paftaNo,
          kaksEmsal,
          gabari,
          krediyeUygunluk,
          tapuDurumu,
          takas,
          description,
        };
      }

      await createProperty(propertyData);
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Ekle</h1>
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

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-6"
        >
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="İlan başlığı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Konum
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Şehir, ilçe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fiyat
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.500.000 TL"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Tür
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "Satılık" | "Kiralık")
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Satılık">Satılık</option>
                <option value="Kiralık">Kiralık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "Konut" | "Arsa")
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Konut">Konut</option>
                <option value="Arsa">Arsa</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-900">
                Öne Çıkan İlan
              </label>
            </div>
          </div>

          {/* Konut Özellikleri */}
          {category === "Konut" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Konut Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Oda Sayısı
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Banyo Sayısı
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Brüt Metrekare
                  </label>
                  <input
                    type="number"
                    value={brutMetrekare || ""}
                    onChange={(e) =>
                      setBrutMetrekare(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="130"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Net Metrekare
                  </label>
                  <input
                    type="number"
                    value={netMetrekare || ""}
                    onChange={(e) =>
                      setNetMetrekare(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="110"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Bina Yaşı
                  </label>
                  <input
                    type="number"
                    value={binaYasi || ""}
                    onChange={(e) =>
                      setBinaYasi(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Bulunduğu Kat
                  </label>
                  <input
                    type="number"
                    value={bulunduguKat || ""}
                    onChange={(e) =>
                      setBulunduguKat(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Kat Sayısı
                  </label>
                  <input
                    type="number"
                    value={katSayisi || ""}
                    onChange={(e) =>
                      setKatSayisi(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Isıtma
                  </label>
                  <input
                    type="text"
                    value={isitma}
                    onChange={(e) => setIsitma(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doğalgaz (Kombi)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Mutfak
                  </label>
                  <select
                    value={mutfak}
                    onChange={(e) =>
                      setMutfak(e.target.value as "Açık" | "Kapalı" | "Diğer")
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Açık">Açık</option>
                    <option value="Kapalı">Kapalı</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Banyo Sayısı
                  </label>
                  <input
                    type="number"
                    value={banyoSayisi}
                    onChange={(e) => setBanyoSayisi(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Kullanım Durumu
                  </label>
                  <input
                    type="text"
                    value={kullanimDurumu}
                    onChange={(e) => setKullanimDurumu(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Boş, Kiracılı, Mal Sahibi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Site Adı
                  </label>
                  <input
                    type="text"
                    value={siteAdi}
                    onChange={(e) => setSiteAdi(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Site adı (varsa)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Aylık Aidat
                  </label>
                  <input
                    type="text"
                    value={aidat}
                    onChange={(e) => setAidat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1.200 TL"
                  />
                </div>
              </div>

              {/* Açıklama - Tam genişlik */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="İlan açıklaması"
                />
              </div>

              {/* Checkbox'lar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="otopark"
                    checked={otopark}
                    onChange={(e) => setOtopark(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="otopark"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Otopark
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="balkon"
                    checked={balkon}
                    onChange={(e) => setBalkon(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="balkon"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Balkon
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="asansor"
                    checked={asansor}
                    onChange={(e) => setAsansor(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="asansor"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Asansör
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="esyali"
                    checked={esyali}
                    onChange={(e) => setEsyali(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="esyali"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Eşyalı
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="siteIcerisinde"
                    checked={siteIcerisinde}
                    onChange={(e) => setSiteIcerisinde(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="siteIcerisinde"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Site İçerisinde
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Arsa Özellikleri */}
          {category === "Arsa" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Arsa Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    İmar Durumu
                  </label>
                  <input
                    type="text"
                    value={imarDurumu}
                    onChange={(e) => setImarDurumu(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Konut İmarlı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Metrekare
                  </label>
                  <input
                    type="text"
                    value={metrekare}
                    onChange={(e) => setMetrekare(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500m²"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Metrekare Fiyatı
                  </label>
                  <input
                    type="text"
                    value={metrekareFiyati}
                    onChange={(e) => setMetrekareFiyati(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8.400 TL/m²"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Ada No
                  </label>
                  <input
                    type="text"
                    value={adaNo}
                    onChange={(e) => setAdaNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Parsel No
                  </label>
                  <input
                    type="text"
                    value={parselNo}
                    onChange={(e) => setParselNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Pafta No
                  </label>
                  <input
                    type="text"
                    value={paftaNo}
                    onChange={(e) => setPaftaNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    KAKS/Emsal
                  </label>
                  <input
                    type="text"
                    value={kaksEmsal}
                    onChange={(e) => setKaksEmsal(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Gabari
                  </label>
                  <input
                    type="text"
                    value={gabari}
                    onChange={(e) => setGabari(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="6.50 m"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Krediye Uygunluk
                  </label>
                  <select
                    value={krediyeUygunluk}
                    onChange={(e) =>
                      setKrediyeUygunluk(
                        e.target.value as "Evet" | "Hayır" | "Bilinmiyor"
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bilinmiyor">Bilinmiyor</option>
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Tapu Durumu
                  </label>
                  <input
                    type="text"
                    value={tapuDurumu}
                    onChange={(e) => setTapuDurumu(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hisseli Değil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Takas
                  </label>
                  <select
                    value={takas}
                    onChange={(e) =>
                      setTakas(
                        e.target.value as
                          | "Evet"
                          | "Hayır"
                          | "Değerlendirilebilir"
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Hayır">Hayır</option>
                    <option value="Evet">Evet</option>
                    <option value="Değerlendirilebilir">
                      Değerlendirilebilir
                    </option>
                  </select>
                </div>
              </div>

              {/* Açıklama - Tam genişlik */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Arsa açıklaması"
                />
              </div>
            </div>
          )}

          {/* Resim Yönetimi */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resim Yönetimi
            </h3>

            {/* Mevcut Resimler */}
            {images.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mevcut Resimler ({images.length}/10)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Resim ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className={`px-2 py-1 text-xs rounded ${
                              image === mainImage
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {image === mainImage ? "Ana Resim" : "Ana Yap"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Resim Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Yeni Resim Ekle
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={uploadingImages || images.length >= 10}
              />
              <p className="text-sm text-gray-600 mt-1">
                Maksimum 10 resim. {images.length}/10 kullanıldı.
              </p>
            </div>

            {/* Ana Resim Seçimi */}
            {images.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ana Resim
                </label>
                <div className="flex gap-2 flex-wrap">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAsMainImage(index)}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        image === mainImage
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Resim ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Kaydediliyor..." : "İlanı Kaydet"}
            </button>

            <Link
              href="/admin/dashboard"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
