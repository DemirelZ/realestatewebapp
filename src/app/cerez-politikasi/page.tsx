import Link from "next/link";

export const metadata = {
  title: "Çerez Politikası | Neşeli Gayrimenkul",
  description: "Neşeli Gayrimenkul web sitesinin çerez politikası.",
};

export default function CerezPolitikasiPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        Çerez Politikası
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Son güncelleme: Eylül 2025
      </p>

      <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2.5 py-1 text-xs mb-6">
        Durum: Çerez kullanılmıyor
      </span>

      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Bu web sitesinde <strong>çerez kullanılmamaktadır</strong> ve ziyaretçi
        davranışları izlenmemektedir.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Gelecekteki Değişiklikler
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        İleride analitik veya işlevsel çerezlerin kullanımı gündeme gelirse,
        ziyaretçiler bu konuda bilgilendirilecek ve gerekliyse onayları
        alınacaktır.
      </p>

      <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/gizlilik-politikasi"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Gizlilik Politikası
        </Link>{" "}
        ·{" "}
        <Link
          href="/kullanim-kosullari"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Kullanım Koşulları
        </Link>{" "}
        · © {currentYear} Neşeli Gayrimenkul
      </footer>
    </main>
  );
}
