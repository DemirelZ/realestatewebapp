import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tüm İlanlar
          </h1>
          <p className="text-gray-600 mt-2">Yükleniyor...</p>
        </div>
        <Spinner label="İlanlar yükleniyor" />
      </div>
    </main>
  );
}
