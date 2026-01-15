"use client"

import { useState } from "react"

type LinkItem = {
  id: number
  title: string
  url: string
  active: boolean
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: 1, title: "LinkedIn", url: "https://linkedin.com/in/seu-perfil", active: true },
    { id: 2, title: "Instagram", url: "https://instagram.com/seu-perfil", active: true }
  ])

  const toggleActive = (id: number) => {
    setLinks(current =>
      current.map(link =>
        link.id === id ? { ...link, active: !link.active } : link
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Meus links</h1>
        <button className="rounded-full bg-gradient-to-r from-vasta-primary to-vasta-accent px-4 py-2 text-xs font-semibold text-white">
          Adicionar novo link
        </button>
      </div>
      <div className="flex gap-2 text-xs">
        <button className="rounded-full bg-slate-900 px-3 py-1 text-vasta-text">
          Todos
        </button>
        <button className="rounded-full bg-slate-900 px-3 py-1 text-vasta-muted">
          Ativos
        </button>
        <button className="rounded-full bg-slate-900 px-3 py-1 text-vasta-muted">
          Ocultos
        </button>
      </div>
      <div className="space-y-3">
        {links.map(link => (
          <div
            key={link.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm"
          >
            <div>
              <div className="font-medium text-white">{link.title}</div>
              <div className="text-xs text-vasta-muted">{link.url}</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-slate-900 px-3 py-1 text-xs text-vasta-text">
                Editar
              </button>
              <button
                onClick={() => toggleActive(link.id)}
                className={`relative h-5 w-9 rounded-full border ${
                  link.active
                    ? "border-emerald-400 bg-emerald-500/30"
                    : "border-slate-600 bg-slate-800"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                    link.active ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

