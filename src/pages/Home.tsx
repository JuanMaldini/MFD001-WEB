import { Link } from "react-router-dom";
import { buildAuthUrl } from "../components/auth/authRouting";

export function Home() {
  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#18181a] px-6 font-['Montserrat']">
      <img
        src="/favicon.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.2] blur-[100px] pointer-events-none select-none"
      />
      <div className="relative z-10 flex w-full min-w-0 max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-[0.04em] text-white md:text-5xl">
          MFD001
        </h1>
        <div className="flex gap-2">
          <Link
            to={buildAuthUrl("/mfd001")}
            className="inline-flex items-center gap-2 rounded-md bg-[#2087a3] px-6 py-3 text-sm font-bold tracking-[0.14em] text-white shadow-[0_0px_24px_rgba(32,135,163,0.4)] hver:brightness-105"
          >
            <span>START</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
