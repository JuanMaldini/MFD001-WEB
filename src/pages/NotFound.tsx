import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#18181a] px-6 font-['Montserrat']">
      <div className="w-full max-w-md rounded-xl border border-white/20 bg-black/30 p-6 text-center text-white backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          Error
        </p>
        <h1 className="mt-2 text-5xl font-semibold tracking-[0.04em]">404</h1>
        <p className="mt-3 text-sm text-white/75">Page not found.</p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-[#2087a3] px-4 py-2 text-xs font-bold tracking-[0.14em] text-white"
          >
            HOME
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center rounded-md border border-white/30 px-4 py-2 text-xs font-bold tracking-[0.14em] text-white"
          >
            AUTH
          </Link>
        </div>
      </div>
    </main>
  );
}
