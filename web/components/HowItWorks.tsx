export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Crie sua página grátis",
      description:
        "Cadastre-se em segundos e ganhe sua URL personalizada para centralizar seus links e ofertas."
    },
    {
      number: "02",
      title: "Personalize com links e temas",
      description:
        "Adicione links, escolha cores, fontes e organize seus produtos digitais em um layout profissional."
    },
    {
      number: "03",
      title: "Explore recursos premium",
      description:
        "Ative planos avançados para liberar automações, analytics detalhado e experiências exclusivas."
    }
  ]

  return (
    <section id="recursos" className="border-b border-slate-800/60 bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Como funciona o Vasta
          </h2>
          <p className="mt-3 text-sm text-vasta-muted md:text-base">
            Comece gratuitamente em poucos passos e evolua conforme suas vendas crescem.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(step => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-sm shadow-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-vasta-primary">{step.number}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white md:text-base">
                {step.title}
              </h3>
              <p className="mt-3 text-xs text-vasta-muted md:text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

