export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      {label ? <p className="mt-3 text-sm text-gray-500">{label}</p> : null}
    </div>
  );
}
