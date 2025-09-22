import Image from "next/image";
import Link from "next/link";
import TeamSection from "@/components/TeamSection";

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 overflow-hidden">
        {/* Modern Glassmorphism Background */}
        <div className="absolute inset-0">
          {/* Multiple Glassmorphism Layers */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl"></div>
          {/* Glassmorphism Shapes */}
          <div className="absolute inset-0">
            {/* Glassmorphism Circle */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"></div>
          </div>
          {/* Additional Glassmorphism Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Hakkımızda</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Neşeli Gayrimenkul olarak 7 yılı aşkın süredir müşterilerimize
            güvenilir ve profesyonel emlak hizmetleri sunuyoruz
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                2018 yılında Ankara&apos;da kurulan Neşeli Gayrimenkul, emlak
                sektöründe güvenilirlik ve kalite standartlarını yükseltmeyi
                hedefleyen bir aile şirketi olarak yola çıktı.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Kurucumuz İsmail Neşeli&apos;nin 7 yıllık emlak deneyimi ve
                vizyonu ile, müşterilerimize sadece ev satmak değil, hayal
                kurmak ve bu hayalleri gerçeğe dönüştürmek için hizmet
                veriyoruz.
              </p>
              <p className="text-lg text-gray-600">
                Bugün deneyimli emlak danışmanlarımız ile Ankara&apos;nın
                çeşitli bölgelerinde hizmet veriyor, her yıl yüzlerce ailenin
                hayalindeki gayrimenkule kavuşmasına yardımcı oluyoruz.
              </p>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about/company-story.jpg"
                  alt="Neşeli Gayrimenkul Kuruluş Hikayesi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Misyonumuz
              </h3>
              <p className="text-gray-600">
                Müşterilerimize en uygun gayrimenkul çözümlerini sunarak,
                onların yaşam kalitesini artırmak ve güvenli bir gelecek
                kurmalarına yardımcı olmak.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vizyonumuz
              </h3>
              <p className="text-gray-600">
                Türkiye&apos;nin en güvenilir ve tercih edilen emlak şirketi
                olmak, teknoloji ve inovasyon ile sektöre öncülük etmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Neşeli Gayrimenkul&apos;ün temelini oluşturan değerler ve
              prensipler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trust */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Güvenilirlik
              </h3>
              <p className="text-gray-600">
                Müşterilerimizle uzun vadeli ilişkiler kurar, her zaman şeffaf
                ve dürüst davranırız.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kalite
              </h3>
              <p className="text-gray-600">
                En yüksek kalite standartlarında hizmet sunar, sürekli kendimizi
                geliştiririz.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İnovasyon
              </h3>
              <p className="text-gray-600">
                Teknolojik gelişmeleri takip eder, modern çözümlerle hizmet
                kalitemizi artırırız.
              </p>
            </div>

            {/* Customer Focus */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Müşteri Odaklılık
              </h3>
              <p className="text-gray-600">
                Müşteri memnuniyetini ön planda tutar, kişiselleştirilmiş
                çözümler sunarız.
              </p>
            </div>

            {/* Teamwork */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Takım Ruhu
              </h3>
              <p className="text-gray-600">
                Güçlü ekip çalışması ile hedeflerimize ulaşır, birlikte büyürüz.
              </p>
            </div>

            {/* Sustainability */}
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sürdürülebilirlik
              </h3>
              <p className="text-gray-600">
                Çevreye duyarlı yaklaşımlar benimser, gelecek nesillere
                yaşanabilir bir dünya bırakırız.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team - renders only when data exists */}
      <TeamSection />

      {/* Image Section (replaces Stats) */}
      <section className="relative">
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src="/images/about/stats.jpg"
            alt="Neşeli Gayrimenkul — Ofis ve ekip"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Bizimle Çalışmaya Hazır mısınız?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Neşeli Gayrimenkul ekibi olarak size en iyi hizmeti sunmaya hazırız.
            Hemen iletişime geçin, hayalinizdeki evi bulalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İletişime Geçin
            </Link>
            <Link
              href="/"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
