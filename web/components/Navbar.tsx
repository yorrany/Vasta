import Link from "next/link"

export function Navbar() {
  return (
    <header className="border-b border-slate-800/60 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-vasta-bg/0 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-vasta-primary to-vasta-accent">
            <span className="text-xs font-semibold text-white">V</span>
          </div>
          <span className="text-sm font-semibold text-vasta-text">vasta.pro</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-vasta-muted md:flex">
          <Link href="#recursos" className="hover:text-white">
            Recursos
          </Link>
          <Link href="#precos" className="hover:text-white">
            Preços
          </Link>
          <Link href="#depoimentos" className="hover:text-white">
            Depoimentos
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-vasta-text shadow-sm shadow-slate-900/40"
          >
            Acessar Dashboard
          </Link>
          <button className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-vasta-muted md:inline-flex">
            @seunome
          </button>
        </div>
      </div>
    </header>
  )
}

