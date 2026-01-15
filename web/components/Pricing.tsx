"use client"

import { useEffect, useState } from "react"

type Plan = {
  code: string
  name: string
  monthly_price_cents: number
  transaction_fee_percent: number
  offer_limit: number | null
  admin_user_limit: number | null
  features: string[]
}

type Props = {
  apiBaseUrl?: string
}

export function Pricing({ apiBaseUrl }: Props) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL
    if (!baseUrl) {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    fetch(`${baseUrl}/plans`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          throw new Error("Falha ao carregar planos")
        }
        const data = await response.json()
        setPlans(data)
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          setError("Não foi possível carregar os planos agora.")
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [apiBaseUrl])

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Grátis para sempre"
    const value = cents / 100
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  return (
    <section id="precos" className="border-b border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Escolha o plano ideal para sua escala
          </h2>
          <p className="mt-3 text-sm text-vasta-muted md:text-base">
            Comece grátis e evolua conforme suas vendas crescem, sem taxas escondidas.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {loading && (
            <div className="col-span-3 text-center text-sm text-vasta-muted">
              Carregando planos
            </div>
          )}
          {error && !loading && (
            <div className="col-span-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}
          {!loading &&
            !error &&
            plans.map(plan => {
              const isPopular = plan.code === "pro"
              return (
                <div
                  key={plan.code}
                  className={`flex h-full flex-col rounded-3xl border bg-slate-950/90 p-6 shadow-card ${
                    isPopular
                      ? "border-vasta-primary"
                      : "border-slate-800"
                  }`}
                >
                  {isPopular && (
                    <div className="mb-3 inline-flex self-start rounded-full bg-vasta-primary/20 px-3 py-1 text-xs font-semibold text-vasta-primary">
                      Mais popular
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-white md:text-base">
                    {plan.name}
                  </h3>
                  <div className="mt-3 text-xs text-vasta-muted">
                    Taxa por transação: {plan.transaction_fee_percent}%
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-white md:text-3xl">
                      {formatPrice(plan.monthly_price_cents)}
                    </div>
                    {plan.monthly_price_cents > 0 && (
                      <span className="text-xs text-vasta-muted">/mês</span>
                    )}
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 text-xs text-vasta-muted md:text-sm">
                    {plan.offer_limit && (
                      <li>Até {plan.offer_limit} ofertas ativas</li>
                    )}
                    {!plan.offer_limit && <li>Ofertas ilimitadas</li>}
                    {plan.admin_user_limit && (
                      <li>
                        Até {plan.admin_user_limit} usuário administrativo
                        {plan.admin_user_limit > 1 ? "s" : ""}
                      </li>
                    )}
                    {!plan.admin_user_limit && <li>Usuários administrativos ilimitados</li>}
                    <li>Checkout via Stripe em BRL</li>
                    <li>Suporte por email</li>
                    {plan.features.map(feature => (
                      <li key={feature}>{feature.replace("_", " ")}</li>
                    ))}
                  </ul>
                  <button
                    className={`mt-6 w-full rounded-full px-4 py-2 text-xs font-semibold ${
                      isPopular
                        ? "bg-gradient-to-r from-vasta-primary to-vasta-accent text-white"
                        : "bg-slate-900 text-vasta-text"
                    }`}
                  >
                    Começar com este plano
                  </button>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

