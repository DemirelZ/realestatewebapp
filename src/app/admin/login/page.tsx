"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFirebaseClients } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import PasswordResetModal from "./PasswordResetModal";

export default function AdminLoginPage() {
  const { auth } = getFirebaseClients();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      // Firebase hata mesajlarını kullanıcı dostu Türkçe mesajlarla değiştir
      let errorMessage = "Giriş başarısız";

      if (err && typeof err === "object" && "code" in err) {
        const errorCode = (err as { code: string }).code;

        if (errorCode === "auth/invalid-credential") {
          errorMessage =
            "E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.";
        } else if (errorCode === "auth/user-not-found") {
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
        } else if (errorCode === "auth/wrong-password") {
          errorMessage = "Şifre hatalı. Lütfen tekrar deneyin.";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage =
            "Çok fazla başarısız deneme. Lütfen bir süre bekleyin.";
        } else if (errorCode === "auth/user-disabled") {
          errorMessage = "Bu hesap devre dışı bırakılmış.";
        } else if (errorCode === "auth/network-request-failed") {
          errorMessage =
            "Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.";
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat bg-gray-50 "
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      {/* Ana Sayfa Butonu - Sağ Üst Köşe */}
      <div className="absolute top-4 right-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg shadow-md transition-colors border border-gray-200"
        >
          <svg
            className="w-4 h-4"
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
          Ana Sayfa
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Girişi</h1>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:opacity-60 transition-colors mb-3"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors underline decoration-dotted hover:decoration-solid"
          >
            Şifremi Unuttum
          </button>
        </div>
      </form>

      {/* Şifre Sıfırlama Modal */}
      {showResetModal && (
        <PasswordResetModal
          email={email}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </main>
  );
}
