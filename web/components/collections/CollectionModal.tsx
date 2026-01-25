"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Save, ArrowLeft, Check, Search } from "lucide-react"
import { createClient } from "../../lib/supabase/client"
import { useAuth } from "../../lib/AuthContext"

interface CollectionModalProps {
  isOpen: boolean
  onClose?: () => void
  onSuccess: () => void
  onBack?: () => void
  embedded?: boolean
}

interface Link {
  id: number
  title: string
  url: string
  icon?: string
}

export function CollectionModal({ isOpen, onClose, onSuccess, onBack, embedded = false }: CollectionModalProps) {
  const [collectionTitle, setCollectionTitle] = useState("")
  const [collectionDescription, setCollectionDescription] = useState("")
  const [availableLinks, setAvailableLinks] = useState<Link[]>([])
  const [selectedLinkIds, setSelectedLinkIds] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingLinks, setLoadingLinks] = useState(true)

  const { user } = useAuth()
  const supabase = createClient()

  // Fetch user's links
  useEffect(() => {
    if (isOpen && user) {
      fetchLinks()
    }
  }, [isOpen, user])

  const fetchLinks = async () => {
    if (!user) return
    setLoadingLinks(true)

    try {
      const { data, error } = await supabase
        .from('links')
        .select('id, title, url, icon')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .not('url', 'like', '#collection:%') // Exclude existing collections
        .not('url', 'like', '#form:%') // Exclude forms
        .not('url', 'like', 'header://%') // Exclude headers
        .not('url', 'like', 'text://%') // Exclude text blocks
        .order('display_order', { ascending: true })

      if (error) throw error
      setAvailableLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      alert('Erro ao carregar links')
    } finally {
      setLoadingLinks(false)
    }
  }

  const toggleLink = (linkId: number) => {
    const newSelected = new Set(selectedLinkIds)
    if (newSelected.has(linkId)) {
      newSelected.delete(linkId)
    } else {
      newSelected.add(linkId)
    }
    setSelectedLinkIds(newSelected)
  }

  const filteredLinks = availableLinks.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (selectedLinkIds.size === 0) {
      alert("Selecione pelo menos um link para a coleção.")
      return
    }

    setLoading(true)

    try {
      // Get max order
      const { data: maxOrderData } = await supabase
        .from('links')
        .select('display_order')
        .eq('profile_id', user.id)
        .order('display_order', { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.display_order ?? 0) + 1

      // Store selected link IDs as JSON in the URL
      const collectionData = {
        links: Array.from(selectedLinkIds),
        description: collectionDescription || undefined
      }

      // Save collection as a special link
      const { error } = await supabase
        .from('links')
        .insert({
          profile_id: user.id,
          title: collectionTitle || 'Coleção',
          url: `#collection:${JSON.stringify(collectionData)}`,
          icon: '📚',
          is_active: true,
          display_order: nextOrder,
        })

      if (error) throw error

      window.dispatchEvent(new CustomEvent('vasta:link-update'))
      onSuccess()
      if (onClose) onClose()
    } catch (error) {
      console.error("Error saving collection:", error)
      alert("Erro ao salvar coleção. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-200 fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-vasta-muted hover:text-vasta-text transition-colors mb-4 w-fit"
        >
          <ArrowLeft size={16} />
          Voltar para galeria
        </button>
      )}

      <div className="overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-vasta-text mb-4">Criar Coleção</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-vasta-muted uppercase mb-1.5">
              Título da Coleção
            </label>
            <input
              type="text"
              required
              value={collectionTitle}
              onChange={e => setCollectionTitle(e.target.value)}
              placeholder="Ex: Meus Projetos Favoritos"
              className="w-full rounded-xl border border-vasta-border bg-vasta-surface-soft px-4 py-3 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-vasta-muted uppercase mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              value={collectionDescription}
              onChange={e => setCollectionDescription(e.target.value)}
              placeholder="Descreva sua coleção..."
              rows={2}
              className="w-full rounded-xl border border-vasta-border bg-vasta-surface-soft px-4 py-3 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none transition-all resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-vasta-muted uppercase">
                Selecionar Links ({selectedLinkIds.size} selecionados)
              </label>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vasta-muted" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar links..."
                className="w-full rounded-lg border border-vasta-border bg-vasta-surface px-3 pl-10 py-2 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none"
              />
            </div>

            {/* Links List */}
            {loadingLinks ? (
              <div className="flex items-center justify-center p-8 text-vasta-muted">
                <Loader2 className="animate-spin mr-2" size={20} />
                Carregando links...
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-vasta-border bg-vasta-surface-soft/50">
                <p className="text-sm text-vasta-muted">
                  {searchQuery ? 'Nenhum link encontrado' : 'Você ainda não tem links cadastrados'}
                </p>
                {!searchQuery && (
                  <p className="text-xs text-vasta-muted mt-1">
                    Adicione links primeiro para criar uma coleção
                  </p>
                )}
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 p-1">
                {filteredLinks.map((link) => {
                  const isSelected = selectedLinkIds.has(link.id)
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => toggleLink(link.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left flex items-start gap-3 ${isSelected
                          ? 'border-vasta-primary bg-vasta-primary/5'
                          : 'border-vasta-border bg-vasta-surface-soft hover:border-vasta-border-hover'
                        }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected
                          ? 'bg-vasta-primary border-vasta-primary'
                          : 'border-vasta-border bg-vasta-surface'
                        }`}>
                        {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>

                      {/* Link Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {link.icon && <span className="text-base">{link.icon}</span>}
                          <p className="font-medium text-sm text-vasta-text truncate">{link.title}</p>
                        </div>
                        <p className="text-xs text-vasta-muted truncate mt-0.5">{link.url}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-vasta-border bg-transparent text-vasta-text py-3 text-sm font-bold hover:bg-vasta-surface-soft transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading || selectedLinkIds.size === 0}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-vasta-primary text-white py-3 text-sm font-bold hover:bg-vasta-primary-soft transition-all shadow-lg shadow-vasta-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Criar Coleção</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
