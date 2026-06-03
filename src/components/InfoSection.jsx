const steps = [
  {
    title: "1. Ambil ROI",
    description:
      "Webcam membaca video realtime, lalu canvas mengambil crop area tengah sebagai region of interest."
  },
  {
    title: "2. Kirim ke FastAPI",
    description:
      "Frame ROI dikonversi menjadi Blob image/jpeg dan dikirim ke endpoint /predict sebagai FormData."
  },
  {
    title: "3. Tampilkan Prediksi",
    description:
      "Frontend menampilkan huruf, confidence, top 3 prediction, dan menyimpan hasil valid ke history."
  }
];

export default function InfoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Cara Kerja Sistem
          </p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Pipeline deteksi sederhana untuk demo AI yang siap dipresentasikan.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
            >
              <h3 className="font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
