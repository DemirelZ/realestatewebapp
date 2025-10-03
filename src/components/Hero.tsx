"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const googleReviewsUrl =
    "https://www.google.com/maps/search/?api=1&query=Ne%C5%9Feli+Gayrimenkul";
  const googleReviewCount = 40; // İsteğe göre güncellenebilir

  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && el.dataset.srcLoaded !== "1") {
          el.querySelectorAll("source[data-src]").forEach((s) => {
            s.setAttribute("src", s.getAttribute("data-src")!);
            s.removeAttribute("data-src");
          });
          el.load();
          el.dataset.srcLoaded = "1";

          // iOS/Safari autoplay güvence altına al
          el.muted = true;
          const tryPlay = async () => {
            try {
              await el.play();
            } catch {
              // Sessizce yut – kullanıcı etkileşimi gerekebilir
            }
          };
          tryPlay();
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Poster fallback (en altta görünür) */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url(/images/hero/hero-poster.webp)" }}
        aria-hidden="true"
      />
      {/* Background Video */}
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover z-0"
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        poster="/images/hero/hero-poster.webp"
        aria-hidden="true"
      >
        <source
          data-src="/images/hero/hero-video-480p-nosound.webm"
          type="video/webm"
        />
        <source
          data-src="/images/hero/hero-video-480p-24fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Modern Glassmorphism Background */}
      <div className="absolute inset-0 z-10">
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Multiple Glassmorphism Layers */}
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        {/* Glassmorphism Shapes */}
        <div className="absolute inset-0">
          {/* Glassmorphism Circle */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full border border-white/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full border border-white/20"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 rounded-full border border-white/20"></div>
        </div>
        {/* Additional Glassmorphism Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-yellow-300">
            Emlakta Güvenin ve Uzmanlığın Adresi
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Neşeli Gayrimenkul ile güvenilir, hızlı ve profesyonel emlak
            çözümleri
          </p>

          {/* Action Buttons */}
          <div className="bg-white/20 backdrop-blur-3xl rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto border border-white/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                İlanlarımızı Keşfedin
              </h2>
              <p className="text-blue-100">
                Size uygun emlak seçeneklerini bulun
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tüm İlanlar */}
              <Link
                href="/ilanlar"
                className="group bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 hover:border-white/50 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>Tüm İlanlar</span>
                </div>
              </Link>

              {/* Satılık İlanlar */}
              <Link
                href="/satilik"
                className="group bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 hover:border-white/50 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Satılık</span>
                </div>
              </Link>

              {/* Kiralık İlanlar */}
              <Link
                href="/kiralik"
                className="group bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30 hover:border-white/50 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>Kiralık</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                30+
              </div>
              <div className="text-blue-100">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                1000+
              </div>
              <div className="text-blue-100">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">7+</div>
              <div className="text-blue-100">Yıllık Deneyim</div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              {/* Google Monochrome Mark */}
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/30">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-white/90"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M21.35 11.1h-9.9v2.9h5.7c-.25 1.5-1.75 4.4-5.7 4.4-3.45 0-6.25-2.85-6.25-6.35s2.8-6.35 6.25-6.35c1.95 0 3.25.8 4 1.5l2.75-2.65C16.9 2.7 14.8 1.8 12.2 1.8 6.75 1.8 2.4 6.2 2.4 11.65s4.35 9.85 9.8 9.85c5.65 0 9.4-3.95 9.4-9.5 0-.65-.05-1.1-.25-1.9z" />
                </svg>
              </div>
              <span className="text-sm text-white/90">Google</span>
              <div className="h-4 w-px bg-white/30"></div>
              {/* Stars with micro animation */}
              <div className="flex items-center gap-0.5 text-yellow-300 animate-[pulse_2.5s_ease-in-out_infinite]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 drop-shadow-[0_0_2px_rgba(250,204,21,0.45)]"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">5.0/5</span>
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-sm text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/70 transition-colors"
              >
                {googleReviewCount}+ yorum
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
