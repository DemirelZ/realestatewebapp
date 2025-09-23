import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/contactMessages";
import {
  getClientIP,
  getUserAgent,
  isSuspiciousIP,
  isSuspiciousUserAgent,
  checkRateLimit,
  validateAndSanitizeFormData,
} from "@/lib/security";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Güvenlik kontrolleri
    const clientIP = getClientIP();
    const userAgent = getUserAgent();

    // Şüpheli IP kontrolü
    if (isSuspiciousIP(clientIP)) {
      console.log("Suspicious IP blocked:", clientIP);
      return NextResponse.json({ ok: true }); // Spam'a sessizce başarı dön
    }

    // Şüpheli User-Agent kontrolü
    if (isSuspiciousUserAgent(userAgent)) {
      console.log("Suspicious User-Agent blocked:", userAgent);
      return NextResponse.json({ ok: true });
    }

    // Rate limiting kontrolü
    const rateLimit = checkRateLimit(clientIP, 3, 15 * 60 * 1000); // 15 dakikada max 3 mesaj
    if (!rateLimit.allowed) {
      console.log("Rate limit exceeded for IP:", clientIP);
      return NextResponse.json(
        {
          error:
            "Çok fazla mesaj gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.",
          resetTime: rateLimit.resetTime,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Form validasyonu ve temizleme
    const validation = validateAndSanitizeFormData(body);
    if (!validation.isValid) {
      console.log("Form validation failed:", validation.errors);
      return NextResponse.json(
        { error: "Geçersiz form verisi", details: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.sanitizedData;

    // Firebase'e kaydet
    await createContactMessage({
      name: name!,
      email: email!,
      phone: phone || undefined,
      subject: subject!,
      message: message!,
    });

    // E-posta gönder
    await sendEmailNotification({
      name: name!,
      email: email!,
      phone: phone || undefined,
      subject: subject!,
      message: message!,
    });

    console.log(
      `Contact form submitted successfully from IP: ${clientIP}, Rate limit remaining: ${rateLimit.remaining}`
    );

    return NextResponse.json({
      ok: true,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime,
      },
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

async function sendEmailNotification({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    // SMTP transporter oluştur
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // E-posta içeriği
    const subjectOptions: { [key: string]: string } = {
      genel: "Genel Bilgi",
      satilik: "Satılık İlan",
      kiralik: "Kiralık İlan",
      danismanlik: "Emlak Danışmanlığı",
      degerleme: "Gayrimenkul Değerleme",
      sikayet: "Şikayet/Öneri",
      diger: "Diğer",
    };

    const subjectText = subjectOptions[subject] || subject;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1e40af; margin-bottom: 20px; text-align: center;">Yeni İletişim Formu Mesajı</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-top: 0;">Mesaj Detayları</h3>
            
            <p style="margin: 10px 0;"><strong>Ad Soyad:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>E-posta:</strong> <a href="mailto:${email}" style="color: #1e40af;">${email}</a></p>
            ${
              phone
                ? `<p style="margin: 10px 0;"><strong>Telefon:</strong> <a href="tel:${phone}" style="color: #1e40af;">${phone}</a></p>`
                : ""
            }
            <p style="margin: 10px 0;"><strong>Konu:</strong> ${subjectText}</p>
            <p style="margin: 10px 0;"><strong>Tarih:</strong> ${new Date().toLocaleString(
              "tr-TR"
            )}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">Mesaj İçeriği</h3>
            <p style="color: #92400e; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Bu mesaj Neşeli Gayrimenkul web sitesi iletişim formundan gönderilmiştir.
            </p>
            <a href="mailto:${email}" style="display: inline-block; background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Yanıtla
            </a>
          </div>
        </div>
      </div>
    `;

    const textContent = `
Yeni İletişim Formu Mesajı

Mesaj Detayları:
- Ad Soyad: ${name}
- E-posta: ${email}
- Telefon: ${phone || "Belirtilmemiş"}
- Konu: ${subjectText}
- Tarih: ${new Date().toLocaleString("tr-TR")}

Mesaj İçeriği:
${message}

---
Bu mesaj Neşeli Gayrimenkul web sitesi iletişim formundan gönderilmiştir.
    `;

    // E-posta gönder
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Neşeli Gayrimenkul] ${subjectText} - ${name}`,
      text: textContent,
      html: htmlContent,
    });

    console.log("E-posta başarıyla gönderildi:", email);
  } catch (error) {
    console.error("E-posta gönderim hatası:", error);
    // E-posta gönderim hatası Firebase kaydını etkilemesin
    throw error;
  }
}
