const testimonials = [
  {
    name: "Marina Silva",
    role: "Influenciadora digital",
    quote:
      "O Vasta mudou completamente como compartilho meu conteúdo. Simples, bonito e profissional."
  },
  {
    name: "Pedro Henrique",
    role: "Músico e produtor",
    quote:
      "Finalmente uma plataforma que entende criadores. As estatísticas e a experiência de checkout são incríveis."
  },
  {
    name: "Ana Beatriz",
    role: "Designer freelancer",
    quote:
      "Meus clientes adoram meu link personalizado. Muito mais conversões em propostas e produtos digitais."
  }
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="border-b border-slate-800/60 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Amado por criadores independentes
          </h2>
          <p className="mt-3 text-sm text-vasta-muted md:text-base">
            Veja como o Vasta ajuda especialistas a transformar atenção em receita recorrente.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map(testimonial => (
            <article
              key={testimonial.name}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-card"
            >
              <div className="mb-4 text-lg text-amber-400">★★★★★</div>
              <p className="text-sm text-vasta-text">
                {testimonial.quote}
              </p>
              <div className="mt-6">
                <div className="text-sm font-semibold text-white">
                  {testimonial.name}
                </div>
                <div className="text-xs text-vasta-muted">
                  {testimonial.role}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

