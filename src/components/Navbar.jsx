export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
            BI
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-950">
              BISINDO AI
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Hand Sign Detection
            </span>
          </span>
        </a>

        <a
          href="#detector"
          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Coba Deteksi
        </a>
      </nav>
    </header>
  );
}
