export default function HistoryPanel({ history, onClear, onCopy }) {
  const resultText = history.join("");

  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Prediction History</h3>
          <p className="text-sm text-slate-500">
            Huruf valid disimpan saat confidence minimal 70%.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            disabled={!history.length}
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy Result
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!history.length}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="mt-4 min-h-20 rounded-lg bg-slate-950 p-4 text-white">
        {history.length ? (
          <div className="flex flex-wrap gap-2">
            {history.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-lg font-extrabold ring-1 ring-white/15"
              >
                {letter}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">History masih kosong.</p>
        )}
      </div>

      <p className="mt-3 break-words text-sm font-medium text-slate-600">
        Result: <span className="text-slate-950">{resultText || "-"}</span>
      </p>
    </section>
  );
}
