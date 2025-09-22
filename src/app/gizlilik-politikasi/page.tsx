export const metadata = {
  title: "Gizlilik Politikası | Neşeli Gayrimenkul",
  description: "Neşeli Gayrimenkul web sitesinin gizlilik politikası.",
};

export default function GizlilikPolitikasiPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        Gizlilik Politikası
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Son güncelleme: Eylül 2025
      </p>

      <p className="text-gray-800 dark:text-gray-200 mb-6">
        <strong>Neşeli Gayrimenkul</strong> ("Site") yalnızca satılık ve kiralık
        emlak ilanlarını sergilemek amacıyla hazırlanmıştır.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Toplanan Veriler
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Site ziyaretçilerinden <strong>herhangi bir kişisel veri</strong> (isim,
        e-posta, telefon vb.) toplanmamaktadır.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Çerezler ve İzleme
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Site üzerinde <strong>çerez kullanılmamaktadır</strong> ve kullanıcı
        davranışları izlenmemektedir.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Üçüncü Taraf Hizmetler
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Analitik, reklam veya benzeri üçüncü taraf hizmetler kullanılmamaktadır.
        Gelecekte böyle bir entegrasyon olması halinde, ziyaretçiler
        bilgilendirilecek ve gerekliyse onayları alınacaktır.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        İletişim
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Gizlilikle ilgili sorular için bizimle iletişime geçebilirsiniz:{" "}
        <a
          href="mailto:neseligayrimenkul@gmail.com"
          className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
        >
          neseligayrimenkul@gmail.com
        </a>
      </p>

      <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <a
          href="/kullanim-kosullari"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Kullanım Koşulları
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
