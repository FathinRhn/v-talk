import { useCallback, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import WebcamDetector from "./components/WebcamDetector";
import PredictionCard from "./components/PredictionCard";
import TopPredictions from "./components/TopPredictions";
import HistoryPanel from "./components/HistoryPanel";
import InfoSection from "./components/InfoSection";

export default function App() {
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastAcceptedLabel, setLastAcceptedLabel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = useCallback(
    (result) => {
      setPrediction(result);
      setCopyMessage("");

      if (result.confidence < 70) {
        return;
      }

      if (result.predicted_label !== lastAcceptedLabel) {
        setHistory((current) => [...current, result.predicted_label]);
        setLastAcceptedLabel(result.predicted_label);
      }
    },
    [lastAcceptedLabel]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setLastAcceptedLabel("");
    setCopyMessage("");
  }, []);

  const handleCopyResult = useCallback(async () => {
    const text = history.join("");

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Result berhasil disalin.");
    } catch {
      setCopyMessage("Gagal menyalin result.");
    }
  }, [history]);

  const heroStats = useMemo(
    () => [
      { label: "Interval", value: "1s" },
      { label: "Input", value: "ROI" },
      { label: "Mode", value: "Realtime" }
    ],
    []
  );

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute right-[-12%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-violet-200/45 blur-3xl" />
      </div>

      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                AI Portfolio Project
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                BISINDO Hand Sign Detection
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Arahkan tangan ke dalam kotak deteksi, lalu tekan Start Detection.
                Sistem akan mengambil ROI dari webcam dan mengirimkannya ke API
                FastAPI untuk prediksi huruf BISINDO.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-lg p-3 text-center">
                  <p className="text-lg font-extrabold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="detector"
            className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:items-start"
          >
            <WebcamDetector
              onPrediction={handlePrediction}
              onError={setErrorMessage}
              onLoadingChange={setIsLoading}
              isLoading={isLoading}
            />

            <div className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              {copyMessage && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                  {copyMessage}
                </div>
              )}

              <PredictionCard prediction={prediction} isLoading={isLoading} />
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <TopPredictions top3={prediction?.top3 || []} />
            <HistoryPanel
              history={history}
              onClear={handleClearHistory}
              onCopy={handleCopyResult}
            />
          </div>
        </section>

        <InfoSection />
      </main>
    </div>
  );
}
