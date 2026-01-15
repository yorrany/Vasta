import Link from "next/link"

export function Hero() {
  return (
    <section className="glass-surface border-b border-slate-800/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-16 md:flex-row md:items-center md:pb-32 md:pt-20">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs text-vasta-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Comece gratuitamente</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Sua expertise
            </p>
            <p className="gradient-title text-4xl font-extrabold leading-tight md:text-5xl">
              merece destaque.
            </p>
          </div>
          <p className="max-w-xl text-sm text-vasta-muted md:text-base">
            Unifique sua presença digital, compartilhe links, venda produtos e serviços e cresça sua
            audiência com uma única URL profissional.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-stretch rounded-full border border-slate-700 bg-slate-900/70 text-xs text-vasta-muted">
              <span className="flex items-center px-4 text-slate-500">vasta.pro/</span>
              <input
                placeholder="seu-nome"
                className="flex-1 bg-transparent text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-vasta-primary to-vasta-accent px-6 py-2 text-xs font-semibold text-white shadow-card"
            >
              Criar grátis
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-vasta-muted">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Plano grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Sem cartão de crédito</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center md:justify-end">
          <div className="relative h-96 w-56 rotate-3 rounded-[2.5rem] bg-gradient-to-b from-slate-800 to-slate-950 p-2 shadow-card">
            <div className="h-full w-full rounded-[2rem] bg-slate-950 p-4">
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-vasta-primary to-vasta-accent" />
                <div className="text-xs font-medium text-white">@seunome</div>
                <div className="text-[11px] text-vasta-muted">
                  Designer de Produtos e Criador de Conteúdo
                </div>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-[11px] text-vasta-text">
                  Portfólio no Behance
                </div>
                <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-[11px] text-vasta-text">
                  Projetos GitHub
                </div>
                <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-[11px] text-vasta-text">
                  Agendar Consultoria
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-semibold text-vasta-muted">
                  Produtos e ofertas
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-slate-900/80 p-2">
                    <div className="h-14 rounded-lg bg-slate-800" />
                    <div className="mt-1 text-[10px] text-vasta-text">E-book</div>
                    <div className="text-[11px] font-semibold text-white">R$ 197</div>
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-900/80 p-2">
                    <div className="h-14 rounded-lg bg-slate-800" />
                    <div className="mt-1 text-[10px] text-vasta-text">Mentoria</div>
                    <div className="text-[11px] font-semibold text-white">R$ 47</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                <button className="rounded-lg bg-slate-900 px-2 py-1 text-white">
                  Escuro ativo
                </button>
                <button className="rounded-lg bg-slate-900 px-2 py-1 text-slate-400">
                  Sunset
                </button>
                <button className="rounded-lg bg-slate-900 px-2 py-1 text-slate-400">
                  Neon
                </button>
                <button className="rounded-lg bg-slate-900 px-2 py-1 text-slate-400">
                  Claro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

