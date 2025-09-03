"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getPropertyByIdFromDb, updateProperty } from "@/lib/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { Property } from "@/data/properties";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { auth, storage } = getFirebaseClients();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  // Images
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserLoggedIn(false);
        setLoading(false);
        return;
      }
      setUserLoggedIn(true);

      try {
        const { id } = await params;
        const numId = Number(id);
        if (isNaN(numId)) {
          setError("Geçersiz ID");
          setLoading(false);
          return;
        }

        const propertyData = await getPropertyByIdFromDb(numId);
        if (!propertyData) {
          setError("İlan bulunamadı");
          setLoading(false);
          return;
        }

        setProperty(propertyData);

        // Form'u property verisi ile doldur
        setTitle(propertyData.title);
        setLocation(propertyData.location);
        setPrice(propertyData.price);
        setType(propertyData.type);
        setCategory(propertyData.category || "Konut");
        setBedrooms(propertyData.bedrooms);
        setBathrooms(propertyData.bathrooms);
        setFeatured(propertyData.featured);
        setMainImage(propertyData.mainImage || "");
        setImages(propertyData.images || []);

        // Housing specs
        if (propertyData.housingSpecs) {
          setBrutMetrekare(propertyData.housingSpecs.brutMetrekare);
          setNetMetrekare(propertyData.housingSpecs.netMetrekare);
          setBinaYasi(propertyData.housingSpecs.binaYasi);
          setBulunduguKat(propertyData.housingSpecs.bulunduguKat);
          setKatSayisi(propertyData.housingSpecs.katSayisi);
          setIsitma(propertyData.housingSpecs.isitma || "");
          setMutfak(propertyData.housingSpecs.mutfak || "Açık");
          setBanyoSayisi(propertyData.housingSpecs.banyoSayisi || 1);
          setOtopark(propertyData.housingSpecs.otopark || false);
          setBalkon(propertyData.housingSpecs.balkon || false);
          setAsansor(propertyData.housingSpecs.asansor || false);
          setEsyali(propertyData.housingSpecs.esyali || false);
          setKullanimDurumu(propertyData.housingSpecs.kullanimDurumu || "");
          setSiteIcerisinde(propertyData.housingSpecs.siteIcerisinde || false);
          setSiteAdi(propertyData.housingSpecs.siteAdi || "");
          setAidat(propertyData.housingSpecs.aidat || "");
          setDescription(propertyData.housingSpecs.description || "");
        }

        setLoading(false);
      } catch (err: any) {
        setError(
          "İlan yüklenirken hata: " + (err?.message ?? "Bilinmeyen hata")
        );
        setLoading(false);
      }
    });

    return () => unsub();
  }, [auth, params]);

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
      setNewImages((prev) => [...prev, ...fileArray]);
      setError(null);
    } catch (err: any) {
      setError(
        "Resim yüklenirken hata: " + (err?.message ?? "Bilinmeyen hata")
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsMainImage = (index: number) => {
    setMainImage(images[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSaving(true);
    try {
      const updateData: Partial<Property> = {
        title,
        location,
        price,
        type,
        category,
        bedrooms,
        bathrooms,
        featured,
        mainImage,
        images,
        housingSpecs: {
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
        },
      };

      await updateProperty(property.id, updateData);
      setSuccess("İlan başarıyla güncellendi!");

      // 2 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(
        "İlan güncellenirken hata: " + (err?.message ?? "Bilinmeyen hata")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2 text-gray-900">Yükleniyor...</div>
          <div className="text-sm text-gray-600">İlan bilgileri alınıyor</div>
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

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="mb-4 text-gray-900">İlan bulunamadı</p>
          <Link
            href="/admin/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard'a Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">İlan Düzenle</h1>
          <Link
            href="/admin/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Dashboard'a Dön
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Oda Sayısı
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1.200 TL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İlan açıklaması"
                  />
                </div>
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
              {saving ? "Güncelleniyor..." : "İlanı Güncelle"}
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
