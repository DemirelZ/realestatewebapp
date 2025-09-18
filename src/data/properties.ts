export type LandSpecs = {
  imarDurumu?: string; // Örn: Tarla, Konut İmarlı, Ticari İmarlı, Arsa İmarlı
  metrekare?: string; // Örn: 500m²
  metrekareFiyati?: string;
  adaNo?: string;
  parselNo?: string;
  paftaNo?: string;
  kaksEmsal?: string; // Örn: 0.30
  gabari?: string; // Örn: 6.50 m
  krediyeUygunluk?: "Evet" | "Hayır" | "Bilinmiyor";
  tapuDurumu?: string; // Örn: Hisseli Tapu, Müstakil Tapu, Kooperatif Hisseli Tapu
  takas?: "Evet" | "Hayır" | "Değerlendirilebilir";
  description?: string;
  url?: string;
};

export type HousingSpecs = {
  konutType?: string; // "Daire" | "Rezidans" | "Villa" | "Müstakil Ev" | "Apartman";
  brutMetrekare?: number; // m² (Brüt)
  netMetrekare?: number; // m² (Net)
  odaSayisi?: number;
  salonSayisi?: number;
  banyoSayisi?: number;
  binaYasi?: number;
  bulunduguKat?: number;
  katSayisi?: number;
  isitma?: string; // Örn: Doğalgaz, Klima, Yerden Isıtma
  mutfak?: "Açık" | "Kapalı" | "Diğer";
  otopark?: boolean;
  balkon?: boolean;
  asansor?: boolean;
  esyali?: boolean;
  kullanimDurumu?: string; // Boş, Kiracılı, Mal Sahibi
  siteIcerisinde?: boolean;
  siteAdi?: string;
  tapuDurumu?: string; // Kat Mülkiyetli, Kat İrtifaklı, Hisseli Tapu
  takas?: "Evet" | "Hayır" | "Değerlendirilebilir";
  krediyeUygunluk?: "Evet" | "Hayır" | "Bilinmiyor";
  aidat?: string; // Aylık aidat
  description?: string;
  url?: string; // sahibinden.com'daki ilanın URL'si
};

export type ResponsiblePerson = {
  name: string;
  title?: string;
  phone: string;
  email?: string;
  description?: string;
  image?: string;
  url?: string;
};

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  type: "Satılık" | "Kiralık";
  category?: "Konut" | "Arsa"; // Opsiyonel kategori
  responsiblePerson?: ResponsiblePerson;
  /** Çoklu resim desteği; images[0] ana görsel olarak kabul edilir */
  images?: string[];
  featured: boolean;
  landSpecs?: LandSpecs;
  housingSpecs?: HousingSpecs;
};
