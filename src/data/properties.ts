export type LandSpecs = {
  imarDurumu?: string;
  metrekare?: string;
  metrekareFiyati?: string;
  adaNo?: string;
  parselNo?: string;
  paftaNo?: string;
  kaksEmsal?: string;
  gabari?: string;
  krediyeUygunluk?: "Evet" | "Hayır" | "Bilinmiyor";
  tapuDurumu?: string;
  takas?: "Evet" | "Hayır" | "Değerlendirilebilir";
  description?: string;
  url?: string;
};

export type HousingSpecs = {
  brutMetrekare?: number; // m² (Brüt)
  netMetrekare?: number; // m² (Net)
  binaYasi?: number;
  bulunduguKat?: number;
  katSayisi?: number;
  isitma?: string; // Örn: Doğalgaz, Klima, Yerden Isıtma
  mutfak?: "Açık" | "Kapalı" | "Diğer";
  banyoSayisi?: number;
  otopark?: boolean;
  balkon?: boolean;
  asansor?: boolean;
  esyali?: boolean;
  kullanimDurumu?: string; // Boş, Kiracılı, Mal Sahibi
  siteIcerisinde?: boolean;
  siteAdi?: string;
  aidat?: string; // Aylık aidat
  durum?: string; // Boş, Kiracılı, Mal Sahibi
  description?: string;
  url?: string;
};

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  type: "Satılık" | "Kiralık";
  category?: "Konut" | "Arsa"; // Opsiyonel kategori
  bedrooms: number;
  bathrooms: number;
  image: string; // Geriye uyumluluk için korundu
  images: string[]; // Yeni: Çoklu resim desteği (maksimum 10)
  mainImage: string; // Yeni: Ana resim (gallery'de ilk gösterilecek)
  featured: boolean;
  landSpecs?: LandSpecs;
  housingSpecs?: HousingSpecs;
};

export const allProperties: Property[] = [
  {
    id: 11,
    title: "Modern 3+1 Daire",
    location: "Kadıköy, İstanbul",
    price: "2.500.000 TL",
    type: "Satılık",
    category: "Konut",
    bedrooms: 3,
    bathrooms: 2,
    image: "", // Geriye uyumluluk
    images: [], // Henüz resim yok
    mainImage: "", // Ana resim yok
    featured: true,
    housingSpecs: {
      brutMetrekare: 130,
      netMetrekare: 110,
      binaYasi: 5,
      katSayisi: 10,
      isitma: "Doğalgaz (Kombi)",
      mutfak: "Açık",
      banyoSayisi: 2,
      otopark: true,
      balkon: true,
      asansor: true,
      esyali: false,
      kullanimDurumu: "Boş",
      siteIcerisinde: true,
      siteAdi: "Moda Park Evleri",
      aidat: "1.200 TL",
      description: "Modern 3+1 Daire",
      url: "https://www.google.com",
    },
  },
  {
    id: 1,
    title: "Modern 3+1 Daire",
    location: "Kadıköy, İstanbul",
    price: "2.500.000 TL",
    type: "Satılık",
    category: "Konut",
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/properties/modern-apartment.jpg", // Geriye uyumluluk
    images: [
      "/images/properties/modern-apartment.jpg",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ],
    mainImage: "/images/properties/modern-apartment.jpg", // Ana resim
    featured: true,
    housingSpecs: {
      brutMetrekare: 130,
      netMetrekare: 110,
      binaYasi: 5,
      katSayisi: 10,
      isitma: "Doğalgaz (Kombi)",
      mutfak: "Açık",
      banyoSayisi: 2,
      otopark: true,
      balkon: true,
      asansor: true,
      esyali: false,
      kullanimDurumu: "Boş",
      siteIcerisinde: true,
      siteAdi: "Moda Park Evleri",
      aidat: "1.200 TL",
      description: "Lüks Villa",
      url: "https://www.google.com",
    },
  },
  {
    id: 2,
    title: "Lüks Villa",
    location: "Çeşme, İzmir",
    price: "8.500.000 TL",
    type: "Satılık",
    category: "Konut",
    bedrooms: 5,
    bathrooms: 4,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop", // Geriye uyumluluk
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop", // Ana resim
    featured: true,
    housingSpecs: {
      brutMetrekare: 380,
      netMetrekare: 330,
      binaYasi: 2,
      bulunduguKat: 1,
      katSayisi: 2,
      isitma: "Yerden Isıtma",
      mutfak: "Kapalı",
      banyoSayisi: 4,
      otopark: true,
      balkon: true,
      asansor: false,
      esyali: true,
      kullanimDurumu: "Mal Sahibi",
      siteIcerisinde: false,
      aidat: "-",
      description: "Merkezi Konumda 2+1",
      url: "https://www.google.com",
    },
  },
  {
    id: 3,
    title: "Merkezi Konumda 2+1",
    location: "Ankara, Çankaya",
    price: "15.000 TL",
    type: "Kiralık",
    category: "Konut",
    bedrooms: 2,
    bathrooms: 1,
    image: "/images/properties/central-apartment.jpg", // Geriye uyumluluk
    images: [
      "/images/properties/central-apartment.jpg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ],
    mainImage: "/images/properties/central-apartment.jpg", // Ana resim
    featured: false,
    housingSpecs: {
      brutMetrekare: 95,
      netMetrekare: 80,
      binaYasi: 8,
      katSayisi: 12,
      isitma: "Merkezi Sistem",
      mutfak: "Açık",
      banyoSayisi: 1,
      otopark: false,
      balkon: true,
      asansor: true,
      esyali: false,
      kullanimDurumu: "Kiracılı",
      siteIcerisinde: true,
      siteAdi: "Atakule Rezidans",
      aidat: "900 TL",
      description: "Deniz Manzaralı Arsa",
      url: "https://www.google.com",
    },
  },
  {
    id: 4,
    title: "Deniz Manzaralı Arsa",
    location: "Bodrum, Muğla",
    price: "4.200.000 TL",
    type: "Satılık",
    category: "Arsa",
    bedrooms: 0,
    bathrooms: 0,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", // Geriye uyumluluk
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", // Ana resim
    featured: true,
    landSpecs: {
      imarDurumu: "Konut İmarlı",
      metrekare: "500m²",
      metrekareFiyati: "8.400 TL/m²",
      adaNo: "123",
      parselNo: "45",
      paftaNo: "A-12",
      kaksEmsal: "0.30",
      gabari: "6.50 m",
      krediyeUygunluk: "Evet",
      tapuDurumu: "Hisseli Değil",
      takas: "Değerlendirilebilir",
      description: "Ticari Ofis",
      url: "https://www.google.com",
    },
  },
  {
    id: 5,
    title: "Ticari Ofis",
    location: "İstanbul, Şişli",
    price: "25.000 TL",
    type: "Kiralık",
    category: "Konut",
    bedrooms: 0,
    bathrooms: 2,
    image: "/images/properties/office-space.jpg", // Geriye uyumluluk
    images: [
      "/images/properties/office-space.jpg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ],
    mainImage: "/images/properties/office-space.jpg", // Ana resim
    featured: false,
    housingSpecs: {
      brutMetrekare: 210,
      netMetrekare: 190,
      binaYasi: 12,
      katSayisi: 15,
      isitma: "VRF",
      mutfak: "Kapalı",
      banyoSayisi: 2,
      otopark: true,
      balkon: false,
      asansor: true,
      esyali: false,
      kullanimDurumu: "Kiracılı",
      siteIcerisinde: true,
      siteAdi: "Levent Plaza",
      aidat: "2.500 TL",
      description: "Bahçeli Müstakil Ev",
      url: "https://www.google.com",
    },
  },
  {
    id: 6,
    title: "Bahçeli Müstakil Ev",
    location: "Bursa, Nilüfer",
    price: "3.800.000 TL",
    type: "Satılık",
    category: "Konut",
    bedrooms: 3,
    bathrooms: 2,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", // Geriye uyumluluk
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    ],
    mainImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", // Ana resim
    featured: false,
    housingSpecs: {
      brutMetrekare: 170,
      netMetrekare: 145,
      binaYasi: 7,
      katSayisi: 2,
      isitma: "Doğalgaz (Kombi)",
      mutfak: "Kapalı",
      banyoSayisi: 2,
      otopark: true,
      balkon: true,
      asansor: false,
      esyali: false,
      kullanimDurumu: "Boş",
      siteIcerisinde: false,
      aidat: "-",
      description: "Modern 3+1 Daire",
      url: "https://www.google.com",
    },
  },
];
