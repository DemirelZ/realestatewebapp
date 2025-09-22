import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/contactMessages";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, website } = body || {};

    // Honeypot: eğer doluysa sessizce başarı dön (spam'i kayıt etme)
    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Eksik alanlar var." },
        { status: 400 }
      );
    }

    await createContactMessage({ name, email, phone, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
