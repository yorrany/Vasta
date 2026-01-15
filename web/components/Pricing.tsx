"use client"

import { useState, useEffect } from "react"
import { Check, X, Loader2 } from "lucide-react"

type PlanFeature = {
  name: string
  included: boolean
}

type Plan = {
  code: string
  name: string
  monthly_price_cents: number
  transaction_fee_percent: number
  offer_limit: number | null
  admin_user_limit: number | null
  features: string[]
}

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`)
      .then(res => res.json())
      .then(data => {
        setPlans(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching plans:", err)
        setLoading(false)
      })
  }, [])

  // Map API features to UI features (mock mapping for now to keep design fidelity)
  const getUiFeatures = (plan: Plan): PlanFeature[] => {
    const isStart = plan.code === "start"
    const isPro = plan.code === "pro"
    
    // This is a mix of API flags and hardcoded labels for visual fidelity
    return [
      { name: plan.offer_limit ? `Até ${plan.offer_limit} produtos` : "Produtos ilimitados", included: true },
      { name: `${plan.admin_user_limit} usuário${plan.admin_user_limit! > 1 ? "s" : ""} administrativo`, included: true },
      { name: "Checkout transparente", included: true },
      { name: "Suporte por email", included: true },
      { name: "Analytics básico", included: true },
      { name: "Domínio próprio", included: !isStart },
      { name: "Sem marca d'água", included: !isStart },
      { name: "Recuperação de carrinho", included: !isStart },
      { name: "Suporte prioritário", included: !isStart && !isPro },
    ].filter((f, i) => plan.code === 'business' || i < 8) // Show more for business
  }

  return (
    <section id="precos" className="relative border-b border-slate-800/60 bg-slate-950/80 py-20 md:py-32">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-vasta-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center">
          <div className="inline-block rounded-full border border-vasta-primary/30 bg-vasta-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-vasta-primary">
            Planos Flexíveis
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Escolha o plano ideal para sua escala
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-vasta-muted">
            Comece grátis e evolua conforme suas vendas crescem. Sem fidelidade ou taxas escondidas.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/50 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${billingCycle === "monthly"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-vasta-muted hover:text-white"
                }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all ${billingCycle === "yearly"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-vasta-muted hover:text-white"
                }`}
            >
              Anual
              <span className="absolute -right-3 -top-2 rounded-full bg-vasta-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-8 min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-vasta-primary animate-spin" />
                <span className="ml-3 text-vasta-muted">Carregando planos...</span>
            </div>
          ) : (
            plans.map((plan) => {
              const price = billingCycle === "monthly" 
                ? plan.monthly_price_cents / 100 
                : (plan.monthly_price_cents * 0.8 * 12) / 1200 // Mock 20% discount on yearly
              
              const isPopular = plan.code === "pro"
              const uiFeatures = getUiFeatures(plan)

              return (
                <div
                  key={plan.code}
                  className={`relative flex flex-col rounded-[2rem] border p-8 transition-all hover:shadow-card ${isPopular
                      ? "border-vasta-primary bg-slate-900/80 ring-1 ring-vasta-primary/50"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-vasta-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                      Mais Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      {plan.monthly_price_cents === 0 ? (
                        <span className="text-3xl font-bold text-white">Grátis para sempre</span>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-vasta-muted">R$</span>
                          <span className="text-4xl font-bold text-white">{(billingCycle === "yearly" ? price : plan.monthly_price_cents / 100).toFixed(2)}</span>
                          <span className="text-sm text-vasta-muted">/mês</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-400 bg-slate-900/50 inline-block px-2 py-1 rounded-md border border-slate-800">
                      Taxa de transação: <span className="text-slate-200">{plan.transaction_fee_percent}%</span>
                    </div>
                  </div>

                  <div className="mb-8 flex-1 space-y-4">
                    {uiFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        {feature.included ? (
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800">
                            <X className="h-2.5 w-2.5 text-slate-500" />
                          </div>
                        )}
                        <span className={feature.included ? "text-slate-300" : "text-slate-600 line-through decoration-slate-600/50"}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${isPopular
                        ? "bg-gradient-to-r from-vasta-primary to-vasta-accent text-white hover:opacity-90 shadow-lg shadow-vasta-primary/25"
                        : "bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                      }`}
                  >
                    {plan.monthly_price_cents === 0 ? "Começar agora" : "Criar minha loja agora"}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
