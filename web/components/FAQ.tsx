const faqs = [
  {
    question: "O Vasta é gratuito?",
    answer:
      "Sim. O plano Start é grátis para sempre com os recursos essenciais para validar sua oferta."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. Você pode alterar ou cancelar seu plano quando quiser, sem fidelidade."
  },
  {
    question: "Como recebo meus pagamentos?",
    answer:
      "Os pagamentos são processados pela Stripe em BRL. Você recebe diretamente em sua conta conectada."
  },
  {
    question: "O que acontece se eu atingir o limite do plano Start?",
    answer:
      "Você poderá fazer upgrade para o plano Pro ou Business para liberar mais ofertas e recursos."
  }
]

export function FAQ() {
  return (
    <section className="bg-vasta-bg">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Dúvidas frequentes
          </h2>
          <p className="mt-3 text-sm text-vasta-muted md:text-base">
            Tudo o que você precisa saber antes de lançar seu link que vende.
          </p>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map(item => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-white">
                <span>{item.question}</span>
                <span className="text-xl text-vasta-muted group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-xs text-vasta-muted md:text-sm">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

