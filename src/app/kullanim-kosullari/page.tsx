export const metadata = {
  title: "Kullanım Koşulları | Neşeli Gayrimenkul",
  description: "Neşeli Gayrimenkul web sitesinin kullanım koşulları.",
};

export default function KullanimKosullariPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        Kullanım Koşulları
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Son güncelleme: Eylül 2025
      </p>

      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Bu web sitesini ("Site") kullanarak aşağıdaki koşulları kabul etmiş
        sayılırsınız:
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Bilgi Amaçlı İçerik
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200 mb-6">
        <li>
          Sitede yer alan tüm ilan ve bilgiler yalnızca{" "}
          <strong>bilgilendirme amaçlıdır</strong>.
        </li>
        <li>
          İlan içerikleri, fiyatlar ve açıklamalar önceden haber verilmeksizin
          değişebilir; <strong>doğruluğu ve güncelliği garanti edilmez</strong>.
        </li>
        <li>
          Her türlü işlem öncesinde bilgilerin{" "}
          <strong>ilan sahibi / emlak danışmanı</strong> ile teyidi önerilir.
        </li>
      </ul>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Sorumluluk Reddi
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Sitede yer alan hata, eksiklik veya güncel olmama durumlarından dolayı
        ortaya çıkabilecek zararlardan Site sahibi sorumlu tutulamaz.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Telif Hakları
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Sitedeki marka, logo, metin ve görseller ilgili sahiplerine aittir;
        izinsiz kopyalanamaz veya çoğaltılamaz.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Değişiklikler
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Bu koşullar gerektiğinde güncellenebilir. Güncellemeler, bu sayfada
        yayımlandığı anda yürürlüğe girer.
      </p>

      <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <a
          href="/gizlilik-politikasi"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Gizlilik Politikası
        </a>{" "}
        ·{" "}
        <a
          href="/cerez-politikasi"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Çerez Politikası
        </a>{" "}
        · © {currentYear} Neşeli Gayrimenkul
      </footer>
    </main>
  );
}
