"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFirebaseClients } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getPropertyByIdFromDb, updateProperty } from "@/lib/firestore";
import { getAllTeamMembersFromDbAdmin, type TeamMember } from "@/lib/team";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

  // Helpers
  const formatTrThousands = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("tr-TR");
  };

  const pruneUndefined = <T extends Record<string, unknown>>(
    obj: T
  ): Partial<T> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as Partial<T>;
  };

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
  const [konutType, setKonutType] = useState("");
  const [brutMetrekare, setBrutMetrekare] = useState<number | undefined>();
  const [netMetrekare, setNetMetrekare] = useState<number | undefined>();
  const [binaYasi, setBinaYasi] = useState<number | undefined>();
  const [bulunduguKat, setBulunduguKat] = useState<number | undefined>();
  const [katSayisi, setKatSayisi] = useState<number | undefined>();
  const [salonSayisi, setSalonSayisi] = useState<number | undefined>();
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
  // Responsible person (team)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedResponsibleId, setSelectedResponsibleId] =
    useState<string>("");
  const [tapuDurumuHousing, setTapuDurumuHousing] = useState("");
  const [takasHousing, setTakasHousing] = useState<
    "Evet" | "Hayır" | "Değerlendirilebilir"
  >("Hayır");
  const [krediyeUygunlukHousing, setKrediyeUygunlukHousing] = useState<
    "Evet" | "Hayır" | "Bilinmiyor"
  >("Bilinmiyor");
  const [housingUrl, setHousingUrl] = useState("");

  // Land specs (controlled for edit)
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
  const [landUrl, setLandUrl] = useState("");

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingUploadCount, setPendingUploadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setBedrooms(propertyData.housingSpecs?.odaSayisi || 1);
        setBathrooms(propertyData.housingSpecs?.banyoSayisi || 1);
        setFeatured(propertyData.featured);
        setImages(propertyData.images || []);

        // Responsible person
        if (propertyData.responsiblePerson) {
          // doesn't have id, we match by name later in UI as fallback
        }

        // Housing specs
        if (propertyData.housingSpecs) {
          setKonutType(propertyData.housingSpecs.konutType || "");
          setBrutMetrekare(propertyData.housingSpecs.brutMetrekare);
          setNetMetrekare(propertyData.housingSpecs.netMetrekare);
          setSalonSayisi(propertyData.housingSpecs.salonSayisi);
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
          setTapuDurumuHousing(propertyData.housingSpecs.tapuDurumu || "");
          setTakasHousing(propertyData.housingSpecs.takas || "Hayır");
          setKrediyeUygunlukHousing(
            propertyData.housingSpecs.krediyeUygunluk || "Bilinmiyor"
          );
          setHousingUrl(propertyData.housingSpecs.url || "");
        }

        if (propertyData.landSpecs) {
          setImarDurumu(propertyData.landSpecs.imarDurumu || "");
          setMetrekare(propertyData.landSpecs.metrekare || "");
          setMetrekareFiyati(propertyData.landSpecs.metrekareFiyati || "");
          setAdaNo(propertyData.landSpecs.adaNo || "");
          setParselNo(propertyData.landSpecs.parselNo || "");
          setPaftaNo(propertyData.landSpecs.paftaNo || "");
          setKaksEmsal(propertyData.landSpecs.kaksEmsal || "");
          setGabari(propertyData.landSpecs.gabari || "");
          setKrediyeUygunluk(
            propertyData.landSpecs.krediyeUygunluk || "Bilinmiyor"
          );
          setTapuDurumu(propertyData.landSpecs.tapuDurumu || "");
          setTakas(propertyData.landSpecs.takas || "Hayır");
          setLandUrl(propertyData.landSpecs.url || "");
        }

        setLoading(false);
      } catch (err: unknown) {
        setError(
          "İlan yüklenirken hata: " +
            (err instanceof Error ? err.message : "Bilinmeyen hata")
        );
        setLoading(false);
      }
    });

    return () => unsub();
  }, [auth, params]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllTeamMembersFromDbAdmin();
        setTeamMembers(list);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (images.length + fileArray.length > 10) {
      setError("Maksimum 10 resim yükleyebilirsiniz");
      return;
    }

    setUploadingImages(true);
    setPendingUploadCount((prev) => prev + fileArray.length);
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
        setPendingUploadCount((prev) => Math.max(0, prev - 1));
      }

      setImages((prev: string[]) => [...prev, ...uploadedUrls]);
      setError(null);
    } catch (err: unknown) {
      setError(
        "Resim yüklenirken hata: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
    } finally {
      setUploadingImages(false);
      setPendingUploadCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsMainImage = (index: number) => {
    setImages((prev) => {
      if (!prev || index < 0 || index >= prev.length) return prev;
      const newOrder = [...prev];
      const [selected] = newOrder.splice(index, 1);
      newOrder.unshift(selected);
      return newOrder;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSaving(true);
    try {
      const housing = pruneUndefined({
        konutType,
        odaSayisi: bedrooms,
        salonSayisi,
        banyoSayisi: bathrooms,
        brutMetrekare,
        netMetrekare,
        binaYasi,
        bulunduguKat,
        katSayisi,
        isitma,
        mutfak,
        otopark,
        balkon,
        asansor,
        esyali,
        kullanimDurumu,
        siteIcerisinde,
        siteAdi,
        aidat,
        description,
        tapuDurumu: tapuDurumuHousing,
        takas: takasHousing,
        krediyeUygunluk: krediyeUygunlukHousing,
        url: housingUrl,
      });

      const land = pruneUndefined({
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
        url: landUrl,
      });

      const updateData: Partial<Property> = {
        title,
        location,
        price,
        type,
        category,
        featured,
        images,
        housingSpecs: housing,
        ...(category === "Arsa" ? { landSpecs: land } : {}),
      };

      if (selectedResponsibleId) {
        const person = teamMembers.find((m) => m.id === selectedResponsibleId);
        if (person) {
          updateData.responsiblePerson = Object.fromEntries(
            Object.entries({
              name: person.name,
              title: person.title,
              phone: person.phone ?? "",
              email: person.email,
              description: person.description,
              image: person.image,
              url: person.url,
            }).filter(([, v]) => v !== undefined)
          ) as unknown as typeof updateData.responsiblePerson;
        }
      }

      await updateProperty(property.id, updateData);
      setSuccess("İlan başarıyla güncellendi!");

      // 1 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (err: unknown) {
      setError(
        "İlan güncellenirken hata: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
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
            Dashboard&apos;a Dön
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
                Danışman
              </label>
              <select
                value={selectedResponsibleId}
                onChange={(e) => setSelectedResponsibleId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seçiniz</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
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
                placeholder="Semt, İlçe, Şehir"
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
                onChange={(e) => setPrice(formatTrThousands(e.target.value))}
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6.500.000 TL"
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

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Tapu Durumu
                  </label>
                  <input
                    type="text"
                    value={tapuDurumuHousing}
                    onChange={(e) => setTapuDurumuHousing(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kat Mülkiyetli, Kat İrtifaklı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Krediye Uygunluk
                  </label>
                  <select
                    value={krediyeUygunlukHousing}
                    onChange={(e) =>
                      setKrediyeUygunlukHousing(
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
                    Takas
                  </label>
                  <select
                    value={takasHousing}
                    onChange={(e) =>
                      setTakasHousing(
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

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    İlan URL (Sahibinden veya hepsemlak gibi sitelerden alınan
                    ilanın URL&apos;si)
                  </label>
                  <input
                    type="url"
                    value={housingUrl}
                    onChange={(e) => setHousingUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
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
                    placeholder="Tarla, Konut İmarlı, Ticari İmarlı, Arsa İmarlı..."
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
                    placeholder="Hisseli Tapu, Müstakil Tapu, Kooperatif Hisseli Tapu..."
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
                  placeholder="İlan açıklaması"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  İlan URL
                </label>
                <input
                  type="url"
                  value={landUrl}
                  onChange={(e) => setLandUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {/* Resim Yönetimi */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resim Yönetimi
            </h3>

            {/* Yeni Resim Ekleme */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Yeni Resim Ekle
              </label>
              <input
                id="property-images-edit"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="sr-only"
                disabled={uploadingImages || images.length >= 10}
              />
              <label
                htmlFor="property-images-edit"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  uploadingImages || images.length >= 10
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                aria-disabled={uploadingImages || images.length >= 10}
              >
                📷 Resim Seç
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Maksimum 10 resim. {images.length}/10 kullanıldı.
              </p>
            </div>

            {/* Mevcut Resimler */}
            {images.length > 0 && (
              <div className="mb-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <img
                        src={image}
                        alt={`Resim ${index + 1}`}
                        className="w-full h-24 object-contain"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-black/50 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setAsMainImage(index)}
                          className={`px-2 py-1 text-[10px] rounded ${
                            index === 0
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {index === 0 ? "Ana Resim" : "Ana Resim Yap"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="px-2 py-1 text-[10px] bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingUploadCount > 0 &&
                    Array.from({ length: pendingUploadCount }).map((_, i) => (
                      <div
                        key={`pending-${i}`}
                        className="relative rounded-lg overflow-hidden bg-white shadow-sm"
                      >
                        <div className="w-full h-24 bg-gray-200 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </div>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {saving && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
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
