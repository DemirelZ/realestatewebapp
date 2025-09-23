// Güvenlik yardımcı fonksiyonları
import { headers } from "next/headers";

// IP adresini al
export function getClientIP(): string {
  const headersList = headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

// User-Agent kontrolü
export function getUserAgent(): string {
  const headersList = headers();
  return headersList.get("user-agent") || "unknown";
}

// Şüpheli IP'leri kontrol et (basit blacklist)
const suspiciousIPs = new Set([
  // Bot IP'leri, VPN'ler vb. eklenebilir
]);

export function isSuspiciousIP(ip: string): boolean {
  return suspiciousIPs.has(ip);
}

// Şüpheli User-Agent'ları kontrol et
const suspiciousUserAgents = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
  /php/i,
  /java/i,
];

export function isSuspiciousUserAgent(userAgent: string): boolean {
  return suspiciousUserAgents.some((pattern) => pattern.test(userAgent));
}

// E-posta validasyonu
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Telefon numarası validasyonu
export function isValidPhone(phone: string): boolean {
  // Türkiye telefon numarası formatı
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Mesaj içeriği spam kontrolü
export function containsSpamKeywords(message: string): boolean {
  const spamKeywords = [
    /viagra/i,
    /casino/i,
    /loan/i,
    /debt/i,
    /free money/i,
    /click here/i,
    /make money/i,
    /work from home/i,
    /bitcoin/i,
    /crypto/i,
    /investment/i,
    /forex/i,
    /trading/i,
  ];

  return spamKeywords.some((pattern) => pattern.test(message));
}

// Rate limiting için basit memory cache (production'da Redis kullanılmalı)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 dakika
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = ip;
  const cached = rateLimitCache.get(key);

  if (!cached || now > cached.resetTime) {
    // Yeni window başlat
    rateLimitCache.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (cached.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: cached.resetTime,
    };
  }

  // Count'u artır
  cached.count++;
  rateLimitCache.set(key, cached);

  return {
    allowed: true,
    remaining: limit - cached.count,
    resetTime: cached.resetTime,
  };
}

// Form verilerini temizle ve validate et
export function validateAndSanitizeFormData(data: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  website?: string;
}) {
  const errors: string[] = [];

  // Name kontrolü
  if (!data.name || typeof data.name !== "string") {
    errors.push("Ad soyad gereklidir");
  } else if (data.name.trim().length < 2) {
    errors.push("Ad soyad en az 2 karakter olmalıdır");
  } else if (data.name.trim().length > 100) {
    errors.push("Ad soyad en fazla 100 karakter olabilir");
  }

  // Email kontrolü
  if (!data.email || typeof data.email !== "string") {
    errors.push("E-posta gereklidir");
  } else if (!isValidEmail(data.email.trim())) {
    errors.push("Geçerli bir e-posta adresi giriniz");
  } else if (data.email.length > 254) {
    errors.push("E-posta adresi çok uzun");
  }

  // Phone kontrolü (opsiyonel)
  if (data.phone && typeof data.phone === "string" && data.phone.trim()) {
    if (!isValidPhone(data.phone.trim())) {
      errors.push("Geçerli bir telefon numarası giriniz");
    }
  }

  // Subject kontrolü
  if (!data.subject || typeof data.subject !== "string") {
    errors.push("Konu gereklidir");
  } else if (data.subject.trim().length < 3) {
    errors.push("Konu en az 3 karakter olmalıdır");
  } else if (data.subject.trim().length > 100) {
    errors.push("Konu en fazla 100 karakter olabilir");
  }

  // Message kontrolü
  if (!data.message || typeof data.message !== "string") {
    errors.push("Mesaj gereklidir");
  } else if (data.message.trim().length < 10) {
    errors.push("Mesaj en az 10 karakter olmalıdır");
  } else if (data.message.trim().length > 2000) {
    errors.push("Mesaj en fazla 2000 karakter olabilir");
  } else if (containsSpamKeywords(data.message)) {
    errors.push("Mesaj içeriği uygun değil");
  }

  // Website honeypot kontrolü
  if (data.website && typeof data.website === "string" && data.website.trim()) {
    errors.push("Spam tespit edildi");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim(),
      subject: data.subject?.trim(),
      message: data.message?.trim(),
    },
  };
}
