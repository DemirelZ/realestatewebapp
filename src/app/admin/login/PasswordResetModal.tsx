"use client";

import { useState, useEffect } from "react";
import { getFirebaseClients } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

interface PasswordResetModalProps {
  email: string;
  onClose: () => void;
}

export default function PasswordResetModal({
  email,
  onClose,
}: PasswordResetModalProps) {
  const { auth } = getFirebaseClients();
  const [resetEmail, setResetEmail] = useState(email);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Güvenlik önlemleri
  const [resetAttempts, setResetAttempts] = useState(0);
  const [lastResetTime, setLastResetTime] = useState<number>(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownActive && cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCooldownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownActive, cooldownSeconds]);

  async function handlePasswordReset() {
    if (!resetEmail.trim()) {
      setError("Şifre sıfırlama için e-posta adresinizi girin");
      return;
    }

    // Güvenlik kontrolleri
    const now = Date.now();
    const timeSinceLastReset = now - lastResetTime;

    // 1 dakika içinde tekrar deneme engeli
    if (timeSinceLastReset < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeSinceLastReset) / 1000);
      setError(
        `Çok hızlı deneme yapıyorsunuz. ${remainingSeconds} saniye bekleyin.`
      );
      return;
    }

    // Günlük maksimum deneme sayısı (5)
    if (resetAttempts >= 5) {
      setError(
        "Günlük maksimum şifre sıfırlama denemesi aşıldı. Yarın tekrar deneyin."
      );
      return;
    }

    setResetLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail);

      // Başarılı reset sonrası güvenlik önlemleri
      setResetAttempts((prev) => prev + 1);
      setLastResetTime(now);

      // 5 dakika cooldown
      setCooldownActive(true);
      setCooldownSeconds(300);

      setSuccess(
        "Şifre sıfırlama e-postası gönderildi. E-posta kutunuzu kontrol edin. (Spam klasörünü de kontrol edin.)"
      );
    } catch (err: unknown) {
      // Firebase hata mesajlarını kullanıcı dostu Türkçe mesajlarla değiştir
      let errorMessage = "Şifre sıfırlama başarısız";

      if (err && typeof err === "object" && "code" in err) {
        const errorCode = (err as { code: string }).code;

        if (errorCode === "auth/user-not-found") {
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
        } else if (errorCode === "auth/invalid-email") {
          errorMessage = "Geçersiz e-posta adresi formatı.";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage = "Çok fazla deneme yapıldı. Lütfen bir süre bekleyin.";
        } else if (errorCode === "auth/user-disabled") {
          errorMessage = "Bu hesap devre dışı bırakılmış.";
        } else if (errorCode === "auth/network-request-failed") {
          errorMessage =
            "Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.";
        } else if (errorCode === "auth/operation-not-allowed") {
          errorMessage = "Şifre sıfırlama özelliği bu projede etkin değil.";
        }
      }

      setError(errorMessage);
    } finally {
      setResetLoading(false);
    }
  }

  // Reset butonunun durumu
  const isResetDisabled =
    resetLoading || !resetEmail.trim() || cooldownActive || resetAttempts >= 5;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Şifre Sıfırlama</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          {/* Güvenlik bilgileri */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-medium mb-1">Güvenlik Durumu:</p>
            <p>Günlük deneme: {resetAttempts}/5</p>
            {cooldownActive && (
              <p className="text-orange-600 font-medium">
                Cooldown aktif: {cooldownSeconds}s
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResetDisabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resetLoading
                ? "Gönderiliyor..."
                : cooldownActive
                ? `${cooldownSeconds}s bekleyin`
                : resetAttempts >= 5
                ? "Günlük limit aşıldı"
                : "Şifre Sıfırla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
