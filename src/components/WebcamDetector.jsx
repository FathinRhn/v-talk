import { useEffect, useRef, useState } from "react";
import { predictSign } from "../services/api";

const CAPTURE_INTERVAL_MS = 1000;
const ROI_SCALE = 0.62;

function captureRoi(video, canvas) {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (!videoWidth || !videoHeight) {
    return Promise.reject(new Error("Kamera belum siap"));
  }

  const roiSize = Math.floor(Math.min(videoWidth, videoHeight) * ROI_SCALE);
  const sx = Math.floor((videoWidth - roiSize) / 2);
  const sy = Math.floor((videoHeight - roiSize) / 2);

  canvas.width = roiSize;
  canvas.height = roiSize;

  const context = canvas.getContext("2d");
  context.drawImage(video, sx, sy, roiSize, roiSize, 0, 0, roiSize, roiSize);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Gagal mengambil frame kamera"));
        }
      },
      "image/jpeg",
      0.9
    );
  });
}

export default function WebcamDetector({
  onPrediction,
  onError,
  onLoadingChange,
  isLoading
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const isRequestingRef = useRef(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  function getCameraErrorMessage(error) {
    if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
      return "Akses kamera ditolak. Periksa izin kamera untuk situs ini di Chrome dan pengaturan privacy Windows.";
    }

    if (error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError") {
      return "Kamera tidak ditemukan. Pastikan webcam terhubung dan terdeteksi oleh sistem.";
    }

    if (error?.name === "NotReadableError" || error?.name === "TrackStartError") {
      return "Kamera tidak bisa dibaca. Tutup aplikasi lain yang mungkin sedang memakai kamera, lalu coba lagi.";
    }

    if (error?.name === "OverconstrainedError") {
      return "Setting kamera tidak cocok dengan perangkat. Coba refresh halaman atau gunakan kamera lain.";
    }

    if (!window.isSecureContext) {
      return "Browser memblokir kamera karena halaman tidak dibuka dari HTTPS atau localhost.";
    }

    return `Kamera gagal dibuka${error?.name ? ` (${error.name})` : ""}. Pastikan izin kamera diberikan dan perangkat kamera tersedia.`;
  }

  useEffect(() => {
    let isMounted = true;

    async function openCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError("Browser tidak mendukung akses kamera.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraReady(true);
        onError("");
      } catch (error) {
        onError(getCameraErrorMessage(error));
      }
    }

    openCamera();

    return () => {
      isMounted = false;
      window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onError]);

  useEffect(() => {
    async function detectFrame() {
      if (!videoRef.current || !canvasRef.current || isRequestingRef.current) {
        return;
      }

      isRequestingRef.current = true;
      onLoadingChange(true);

      try {
        const blob = await captureRoi(videoRef.current, canvasRef.current);
        const result = await predictSign(blob);
        onPrediction(result);
        onError("");
      } catch (error) {
        onError(error.message || "Gagal menghubungi API");
      } finally {
        isRequestingRef.current = false;
        onLoadingChange(false);
      }
    }

    if (isDetecting) {
      detectFrame();
      intervalRef.current = window.setInterval(detectFrame, CAPTURE_INTERVAL_MS);
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [isDetecting, onError, onLoadingChange, onPrediction]);

  return (
    <section className="glass-panel rounded-lg p-4 shadow-glow sm:p-5">
      <div className="relative overflow-hidden rounded-lg bg-slate-950">
        <video
          ref={videoRef}
          className="aspect-video w-full scale-x-[-1] object-cover"
          autoPlay
          playsInline
          muted
        />

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="relative aspect-square w-[62%] max-w-[360px] rounded-lg border-4 border-blue-400 shadow-[0_0_0_999px_rgba(2,6,23,0.34)]">
            <span className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-white" />
            <span className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-white" />
            <span className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-white" />
            <span className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-white" />
          </div>
        </div>

        {!cameraReady && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/85 px-6 text-center text-sm font-semibold text-white">
            Membuka kamera...
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setIsDetecting(true)}
          disabled={!cameraReady || isDetecting}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start Detection
        </button>
        <button
          type="button"
          onClick={() => setIsDetecting(false)}
          disabled={!isDetecting}
          className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Stop Detection
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Arahkan tangan ke dalam kotak deteksi, lalu tekan Start Detection.</p>
        <p className="font-semibold text-slate-700">
          Status:{" "}
          <span className={isDetecting ? "text-blue-700" : "text-slate-500"}>
            {isDetecting ? (isLoading ? "Mengirim frame..." : "Aktif") : "Berhenti"}
          </span>
        </p>
      </div>
    </section>
  );
}
