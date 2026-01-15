export default function MinhaLojaPage() {
  const products = [
    {
      id: 1,
      title: "Prompts de decoração",
      price: "R$ 9,90",
      status: "Ativo"
    },
    {
      id: 2,
      title: "Prompts de inverno",
      price: "R$ 9,90",
      status: "Ativo"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Minha loja</h1>
        <button className="rounded-full bg-gradient-to-r from-vasta-primary to-vasta-accent px-4 py-2 text-xs font-semibold text-white">
          Novo produto
        </button>
      </div>
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-vasta-text">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-emerald-400">Pagamentos ativos</div>
              <div className="mt-1 text-vasta-muted">
                Você está pronto para vender e receber pagamentos via Stripe.
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map(product => (
            <div
              key={product.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
            >
              <div className="h-32 rounded-xl bg-slate-800" />
              <div className="mt-3 text-xs font-semibold text-vasta-muted">
                DIGITAL • {product.status.toUpperCase()}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                {product.title}
              </div>
              <div className="text-xs text-vasta-text">
                {product.price}
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <button className="flex-1 rounded-full bg-slate-900 px-3 py-1 text-vasta-text">
                  Editar
                </button>
                <button className="flex-1 rounded-full bg-slate-900 px-3 py-1 text-vasta-text">
                  Compartilhar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

