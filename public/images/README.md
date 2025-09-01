# Images Klasörü

Bu klasör, Neşeli Gayrimenkul web sitesinde kullanılan tüm image'ları içerir.

## 📁 Klasör Yapısı

```
public/images/
├── about/           # Hakkımızda sayfası image'ları
├── hero/            # Ana sayfa hero section image'ları
├── logos/           # Logo ve marka image'ları
└── properties/      # Emlak ilan image'ları
```

## 🖼️ Image Kullanımı

### Yerel Image'lar

```jsx
import Image from "next/image";

<Image
  src="/images/properties/modern-apartment.jpg"
  alt="Modern Daire"
  width={600}
  height={400}
/>;
```

### External Image'lar (Unsplash)

```jsx
<Image
  src="https://images.unsplash.com/photo-1234567890?w=600&h=400&fit=crop"
  alt="External Image"
  width={600}
  height={400}
/>
```

## 📋 Önerilen Image Boyutları

- **Properties**: 600x400px (16:9 oranı)
- **Hero**: 1920x1080px (16:9 oranı)
- **About**: 800x600px (4:3 oranı)
- **Logos**: 200x200px (1:1 oranı)

## 🎯 Image Formatları

- **JPEG**: Fotoğraflar için (daha küçük dosya boyutu)
- **PNG**: Logo ve grafikler için (şeffaflık desteği)
- **WebP**: Modern tarayıcılar için (en iyi sıkıştırma)

## 📝 Notlar

- Tüm image'lar optimize edilmiş olmalı
- Alt text'ler SEO için önemli
- Responsive tasarım için uygun boyutlarda olmalı
- Dosya isimleri açıklayıcı olmalı (örn: `modern-3plus1-apartment.jpg`)
