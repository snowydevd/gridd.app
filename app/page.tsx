import {NavBar} from "@/components/navbar";
const COLUMNS = 5;

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <NavBar />
      {/* Retícula alineada al margen del contenido */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex justify-between px-8 sm:px-12 lg:px-16"
      >
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="w-px bg-white/[0.055]" />
        ))}
      </div>

      <header className="relative flex items-center justify-between border-b border-white/10 px-8 py-5 sm:px-12 lg:px-16">
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="size-4 text-brand"
          fill="currentColor"
        >
          <rect x="0" y="0" width="9" height="9" />
          <rect x="11" y="0" width="9" height="9" />
          <rect x="0" y="11" width="9" height="9" />
          <rect x="11" y="11" width="9" height="9" />
        </svg>
        <p className="font-mono text-[0.72rem] tracking-[0.06em] text-zinc-400">
          Próximamente
        </p>
      </header>

      <div className="relative flex flex-1 items-end px-8 pb-12 pt-28 sm:px-12 lg:px-16">
        <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-end xl:justify-between xl:gap-20">
          {/* -ml compensa el bearing de la G para que apoye en el margen */}
          <h1 className="-ml-[0.035em] font-sans text-[clamp(4.5rem,26vw,15rem)] font-bold leading-[0.78] tracking-[-0.05em] text-brand">
            GRIDD
          </h1>
          <p className="max-w-xs text-sm leading-6 text-zinc-400 xl:pb-4 xl:text-right">
            Estamos trabajando en algo nuevo. Todavía no hay mucho para ver por
            acá.
          </p>
        </div>
      </div>

      <footer className="relative flex items-center justify-between border-t border-white/10 px-8 py-5 font-mono text-[0.72rem] tracking-[0.06em] text-zinc-500 sm:px-12 lg:px-16">
        <span>2026</span>
        <span>gridd.app</span>
      </footer>
    </main>
  );
}
