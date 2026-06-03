export default function PredictionCard({ prediction, isLoading }) {
  const confidence = prediction?.confidence ?? 0;
  const isConfident = confidence >= 70;
  const label = prediction ? (isConfident ? prediction.predicted_label : "Tidak yakin") : "-";

  return (
    <section className="glass-panel rounded-lg p-5 shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Hasil Prediksi
          </p>
          <h2 className="mt-3 text-6xl font-extrabold leading-none text-slate-950 sm:text-7xl">
            {label}
          </h2>
        </div>

        {isLoading && (
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Confidence</span>
          <span className="font-bold text-slate-900">{confidence.toFixed(2)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isConfident
                ? "bg-gradient-to-r from-blue-600 to-violet-600"
                : "bg-gradient-to-r from-amber-400 to-orange-500"
            }`}
            style={{ width: `${Math.min(confidence, 100)}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {prediction
          ? isConfident
            ? "Prediksi cukup kuat dan dapat ditambahkan ke riwayat."
            : "Confidence di bawah 70%, hasil tidak dimasukkan ke history."
          : "Tekan Start Detection untuk mulai membaca gesture tangan."}
      </p>
    </section>
  );
}
