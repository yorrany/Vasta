export default function AparenciaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-white">Aparência</h1>
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold text-white">Temas prontos</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-vasta-primary bg-slate-900/80 p-4">
                <div className="h-20 rounded-lg bg-slate-800" />
                <div className="text-sm font-medium text-white">Escuro</div>
                <div className="text-xs text-vasta-muted">
                  Elegante e moderno, perfeito para destacar seus links.
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="h-20 rounded-lg bg-slate-200" />
                <div className="text-sm font-medium text-white">Claro</div>
                <div className="text-xs text-vasta-muted">
                  Limpo e profissional, ideal para apresentações formais.
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold text-white">Cor de destaque</h2>
            <div className="mt-4 flex gap-3">
              <button className="h-10 w-10 rounded-xl bg-vasta-primary" />
              <button className="h-10 w-10 rounded-xl bg-vasta-accent" />
              <button className="h-10 w-10 rounded-xl bg-vasta-accentSoft" />
            </div>
          </section>
        </div>
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">Tipografia</h2>
          <div className="mt-4 grid gap-3">
            <button className="w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-xs text-vasta-text">
              Inter
            </button>
            <button className="w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-xs text-vasta-muted">
              Poppins
            </button>
            <button className="w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-xs text-vasta-muted">
              Montserrat
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

