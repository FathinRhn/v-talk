export default function TopPredictions({ top3 = [] }) {
  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">Top 3 Prediction</h3>

      <div className="mt-4 space-y-3">
        {top3.length > 0 ? (
          top3.map((item, index) => (
            <div key={`${item.label}-${index}`} className="rounded-lg bg-white/78 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                    {index + 1}
                  </span>
                  <span className="text-xl font-extrabold text-slate-950">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {Number(item.confidence).toFixed(2)}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-600"
                  style={{ width: `${Math.min(Number(item.confidence), 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Belum ada prediksi dari API.
          </p>
        )}
      </div>
    </section>
  );
}
