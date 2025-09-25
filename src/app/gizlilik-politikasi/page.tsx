import Link from "next/link";

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
        <strong>Neşeli Gayrimenkul</strong> (&quot;Site&quot;) yalnızca satılık
        ve kiralık emlak ilanlarını sergilemek amacıyla hazırlanmıştır.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Toplanan Kişisel Veriler
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-4">
        <strong>İletişim Formu:</strong> Web sitemizdeki iletişim formu
        aracılığıyla aşağıdaki kişisel verilerinizi topluyoruz:
      </p>
      <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mb-4 space-y-1">
        <li>Ad ve soyadınız</li>
        <li>E-posta adresiniz</li>
        <li>Telefon numaranız (opsiyonel)</li>
        <li>Gönderdiğiniz mesaj içeriği</li>
        <li>İletişim tarihi ve saati</li>
      </ul>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Bu veriler <strong>sadece talebinize dönüş yapmak</strong> amacıyla
        işlenir ve <strong>3 yıl süreyle</strong> saklanır. Kişisel verileriniz{" "}
        <strong>üçüncü taraflarla paylaşılmaz</strong> ve yasal zorunluluklar
        dışında silinir.
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
        Kişisel Verilerinizin Korunması Hakkındaki Haklarınız
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-4">
        KVKK kapsamında aşağıdaki haklara sahipsiniz:
      </p>
      <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mb-4 space-y-1">
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
        <li>
          Kişisel verilerinizin işlenme amacını ve bunların amacına uygun
          kullanılıp kullanılmadığını öğrenme
        </li>
        <li>
          Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü
          kişileri bilme
        </li>
        <li>
          Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde
          bunların düzeltilmesini isteme
        </li>
        <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
        <li>
          Düzeltme, silme ve yok edilme işlemlerinin, kişisel verilerin
          aktarıldığı üçüncü kişilere bildirilmesini isteme
        </li>
      </ul>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        Veri Güvenliği
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve idari
        tedbirleri alıyoruz. Verileriniz şifrelenmiş olarak saklanır ve yetkisiz
        erişime karşı korunur.
      </p>

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-8 mb-2">
        İletişim
      </h2>
      <p className="text-gray-800 dark:text-gray-200 mb-6">
        Gizlilik politikası veya kişisel verilerinizle ilgili sorularınız için
        bizimle iletişime geçebilirsiniz:{" "}
        <a
          href="mailto:neseligayrimenkul@gmail.com"
          className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
        >
          neseligayrimenkul@gmail.com
        </a>
      </p>

      <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/kullanim-kosullari"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Kullanım Koşulları
        </Link>
        ·{" "}
        <Link
          href="/cerez-politikasi"
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-4"
        >
          Çerez Politikası
        </Link>{" "}
        · © {currentYear} Neşeli Gayrimenkul
      </footer>
    </main>
  );
}
