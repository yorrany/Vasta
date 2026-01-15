const rows = [
  {
    id: 1,
    product: "Prompts de decoração",
    client: "pending@checkout.stripe",
    amount: "R$ 9,90",
    status: "created"
  }
]

export default function VendasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-white">Vendas</h1>
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="text-vasta-muted">Receita total</div>
          <div className="mt-2 text-xl font-semibold text-white">R$ 0,00</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="text-vasta-muted">Vendas</div>
          <div className="mt-2 text-xl font-semibold text-white">1</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="text-vasta-muted">Ticket médio</div>
          <div className="mt-2 text-xl font-semibold text-white">R$ 0,00</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="text-vasta-muted">Clientes</div>
          <div className="mt-2 text-xl font-semibold text-white">0</div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-white">Histórico de vendas</div>
          <input
            placeholder="Buscar pedido"
            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-vasta-text placeholder:text-slate-600 focus:outline-none"
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-[11px]">
            <thead className="border-b border-slate-800 text-vasta-muted">
              <tr>
                <th className="pb-2 pr-4">Produto</th>
                <th className="pb-2 pr-4">Cliente</th>
                <th className="pb-2 pr-4">Valor</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-slate-900 last:border-0">
                  <td className="py-2 pr-4 text-vasta-text">{row.product}</td>
                  <td className="py-2 pr-4 text-vasta-muted">{row.client}</td>
                  <td className="py-2 pr-4 text-vasta-text">{row.amount}</td>
                  <td className="py-2">
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-vasta-text">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

