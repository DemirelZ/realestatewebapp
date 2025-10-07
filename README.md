# 🏠 Neşeli Gayrimenkul - Modern Emlak Platformu

Neşeli Gayrimenkul için geliştirilmiş, modern ve kullanıcı dostu bir emlak web uygulaması. Bu platform, gayrimenkul alım-satım ve kiralama süreçlerini dijitalleştirerek müşterilere hızlı, güvenilir ve profesyonel hizmet sunmayı amaçlamaktadır.

## 🚀 Özellikler

### 🎯 Temel Özellikler

- **Kapsamlı İlan Sistemi**: Satılık ve kiralık emlak ilanlarının detaylı gösterimi
- **Gelişmiş Filtreleme**: İlan tipine göre (satılık/kiralık) hızlı arama ve filtreleme
- **Responsive Tasarım**: Mobil, tablet ve masaüstü cihazlarda mükemmel görünüm
- **SEO Optimizasyonu**: Arama motorlarında yüksek sıralama için optimize edilmiş yapı
- **Hızlı Performans**: Next.js 15 ve Turbopack ile optimize edilmiş yükleme süreleri

### 🎨 Kullanıcı Arayüzü

- **Modern Hero Bölümü**: Video arka plan ve glassmorphism efektleri ile çarpıcı ana sayfa
- **İnteraktif Galeri**: Emlak görselleri için akıcı carousel sistemi
- **Harita Entegrasyonu**: Leaflet ile interaktif konum gösterimi
- **Dinamik İlan Kartları**: Görsel açıdan zengin ve bilgilendirici ilan kartları
- **Google Yorumları**: 5/5 yıldız müşteri memnuniyeti gösterimi

### 👥 Kullanıcı Özellikleri

- **İletişim Formu**: Hızlı iletişim için e-posta entegrasyonu (Nodemailer)
- **Rate Limiting**: Spam koruması için Upstash Redis ile istek sınırlama
- **Çoklu Sayfa Yapısı**: Hakkımızda, İletişim, Duyurular ve daha fazlası
- **Yasal Sayfalar**: Gizlilik Politikası, Çerez Politikası, Kullanım Koşulları

### 🛠️ Admin Paneli

- **Kolay İlan Yönetimi**: Emlak ilanlarını ekleme, düzenleme ve silme
- **Duyuru Sistemi**: Özel duyuruları yayınlama ve yönetme
- **Mesaj Yönetimi**: Gelen müşteri mesajlarını takip etme
- **Ekip Yönetimi**: Takım üyelerini ekleme ve güncelleme
- **Güvenli Giriş**: Firebase Authentication ile korumalı admin erişimi
- **Modern Dashboard**: Kullanımı kolay yönetim arayüzü

### 🔒 Güvenlik

- **Firebase Authentication**: Güvenli kullanıcı doğrulama
- **Firestore Database**: Güvenilir ve ölçeklenebilir veritabanı
- **Rate Limiting**: DDoS ve spam koruması
- **Güvenli API Routes**: Next.js API routes ile korumalı backend

### 🌐 SEO & Performans

- **Sitemap**: Otomatik sitemap oluşturma
- **Robots.txt**: Arama motoru botları için optimize edilmiş yönlendirme
- **Meta Tags**: Her sayfa için optimize edilmiş meta etiketler
- **Lazy Loading**: Görseller ve video için akıllı yükleme
- **Optimized Images**: WebP formatı ve responsive görseller

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15**: React tabanlı modern web framework
- **React 19**: En güncel React sürümü
- **TypeScript**: Tip güvenli kod yazımı
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Modern icon kütüphanesi

### Backend & Database

- **Firebase**: Authentication ve Firestore veritabanı
- **Upstash Redis**: Rate limiting ve caching
- **Nodemailer**: E-posta gönderimi

### Harita & Lokasyon

- **Leaflet**: Açık kaynak harita kütüphanesi
- **React Leaflet**: React için Leaflet entegrasyonu

### Geliştirme Araçları

- **ESLint**: Kod kalitesi ve standartları
- **PostCSS**: CSS işleme
- **Turbopack**: Hızlı geliştirme ve build süreci

## 📱 Proje Yapısı

```
realestate/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── admin/             # Admin paneli sayfaları
│   │   ├── api/               # API routes
│   │   ├── ilan/              # İlan detay sayfaları
│   │   ├── ilanlar/           # Tüm ilanlar listesi
│   │   ├── satilik/           # Satılık ilanlar
│   │   ├── kiralik/           # Kiralık ilanlar
│   │   └── ...                # Diğer sayfalar
│   ├── components/            # Reusable React bileşenleri
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                   # Utility fonksiyonlar
│   │   ├── firebase.ts
│   │   ├── firestore.ts
│   │   └── ...
│   └── data/                  # Statik veri dosyaları
├── public/                    # Statik dosyalar
│   └── images/               # Görseller
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

## 🎯 Kullanım

### Müşteriler için

1. Ana sayfadan "Tüm İlanlar", "Satılık" veya "Kiralık" butonlarına tıklayın
2. İlanlara göz atın ve detayları inceleyin
3. Beğendiğiniz bir ilan için "İletişim" sayfasından ulaşın
4. Harita üzerinden konumları görüntüleyin

### Adminler için

1. `/admin/login` sayfasından giriş yapın
2. Dashboard'dan istatistikleri görüntüleyin
3. İlan ekleyin, düzenleyin veya silin
4. Gelen mesajları kontrol edin
5. Duyuruları yönetin

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel kullanım içindir. Ticari kullanım için lütfen iletişime geçin.

## 🙏 Teşekkürler

Bu proje aşağıdaki harika açık kaynak projeleri kullanmaktadır:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Leaflet](https://leafletjs.com/)
- [Lucide Icons](https://lucide.dev/)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

### Short screens gif here

![](/allcat2.gif)

![](/allcat3.gif)
