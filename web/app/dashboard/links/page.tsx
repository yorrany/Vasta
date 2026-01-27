"use client"

import { useState, useEffect, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Loader2 } from "lucide-react"
import { createClient } from "../../../lib/supabase/client"
import { useAuth } from "../../../lib/AuthContext"
import { LinkModal } from "../../../components/links/LinkModal"
import { AddLinkModal } from "../../../components/links/AddLinkModal"
import { isValidUrl } from "../../../components/links/AddLinkModal/types"
import { FormEditModal } from "../../../components/forms/FormEditModal"
import { CollectionItem } from "../../../components/links/CollectionItem"
import { CollectionEditModal } from "../../../components/collections/CollectionEditModal"

type LinkItem = {
  id: number
  title: string
  url: string
  is_active: boolean
  display_order: number
}

interface SortableItemProps {
  link: LinkItem
  toggleActive: (id: number, currentState: boolean) => void
  onEdit: (link: LinkItem) => void
}

function SortableLinkItem({ link, toggleActive, onEdit }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  }

  // Content Type Logic
  let type = 'link'
  let contentPreview = link.url
  if (link.url.startsWith('header://')) {
    type = 'header'
    contentPreview = link.url.replace('header://', '')
  } else if (link.url.startsWith('text://')) {
    type = 'text'
    contentPreview = link.url.replace('text://', '')
  } else if (link.url.startsWith('#form:')) {
    type = 'form'
    contentPreview = 'Formulário interativo'
  } else if (link.url.startsWith('#collection:')) {
    type = 'collection'
    try {
      const data = JSON.parse(link.url.replace('#collection:', ''))
      contentPreview = data.description || 'Coleção de links'
    } catch {
      contentPreview = 'Coleção de links'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-2xl border border-vasta-border bg-vasta-surface/50 p-4 transition-all hover:bg-vasta-surface ${isDragging ? "shadow-2xl brightness-110 scale-[1.02]" : "shadow-sm"
        } ${!link.is_active ? "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-vasta-muted transition-colors hover:text-vasta-text p-2 -ml-2 rounded-lg hover:bg-vasta-surface-soft"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1 space-y-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 w-full">
          {type === 'header' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-wider">Título</span>}
          {type === 'text' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase tracking-wider">Texto</span>}
          {type === 'form' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20 uppercase tracking-wider">📝 Formulário</span>}
          {type === 'collection' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">📚 Coleção</span>}
          {type === 'link' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">Link</span>}

          <div className="font-semibold text-vasta-text truncate text-sm flex-1 min-w-0">{link.title}</div>
        </div>

        <div className="text-xs text-vasta-muted truncate pl-0.5 opacity-80">
          {contentPreview}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={() => onEdit(link)}
          className="rounded-lg bg-vasta-surface-soft px-3 py-1.5 text-xs font-medium text-vasta-text transition-colors hover:bg-vasta-border"
        >
          Editar
        </button>
        <button
          onClick={() => toggleActive(link.id, link.is_active)}
          className={`relative h-6 w-11 rounded-full p-1 transition-colors ${link.is_active
            ? "bg-vasta-primary"
            : "bg-vasta-muted/30"
            }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${link.is_active ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
      </div>
    </div>
  )
}

export default function LinksPage() {
  const { user } = useAuth()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)

  // Add Modal State
  const [addModalState, setAddModalState] = useState<{ isOpen: boolean, initialState?: { view: 'gallery' | 'form', url?: string, title?: string } }>({ isOpen: false })

  // Form Edit Modal State
  const [isFormEditModalOpen, setIsFormEditModalOpen] = useState(false)
  const [editingFormId, setEditingFormId] = useState<number | null>(null)

  // Collection Edit Modal State  
  const [isCollectionEditModalOpen, setIsCollectionEditModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<LinkItem | null>(null)

  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchLinks = async () => {
    if (!user) return
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', user.id)
      .order('display_order', { ascending: true })

    if (data) setLinks(data)
    setLoading(false)

    // Also notify preview on fetch in case of new items
    window.dispatchEvent(new Event('vasta:link-update'))
  }

  useEffect(() => {
    fetchLinks()
  }, [user])

  // Global Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Ignore if target is input/textarea/editable
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
        return
      }

      const text = e.clipboardData?.getData('text')
      if (text && isValidUrl(text)) {
        e.preventDefault()
        setAddModalState({
          isOpen: true,
          initialState: { view: 'form', url: text }
        })
      }
    }

    // Add listener to window
    window.addEventListener('paste', handlePaste)

    // Cleanup
    return () => window.removeEventListener('paste', handlePaste)
  }, []) // Empty dependency array = run once on mount

  // Process collections and extract link IDs that are inside collections
  const linksInCollections = useMemo(() => {
    const linkIds = new Set<number>()
    links.forEach(link => {
      if (link.url.startsWith('#collection:')) {
        try {
          const collectionData = JSON.parse(link.url.replace('#collection:', ''))
          collectionData.links?.forEach((id: number) => linkIds.add(id))
        } catch {
          // Invalid collection data
        }
      }
    })
    return linkIds
  }, [links])

  // Get child links for a collection
  const getCollectionLinks = (collection: LinkItem): LinkItem[] => {
    try {
      const collectionData = JSON.parse(collection.url.replace('#collection:', ''))
      const linkIds = collectionData.links || []
      return links.filter(link => linkIds.includes(link.id))
    } catch {
      return []
    }
  }

  // Filter visible items (Collections + Standalone Links) respecting the original order
  const visibleItems = useMemo(() => {
    return links.filter(link => {
      // Always show collections
      if (link.url.startsWith('#collection:')) return true

      // Show link ONLY if it's NOT inside a collection
      return !linksInCollections.has(link.id)
    })
  }, [links, linksInCollections])

  // Apply Active/All filter
  const filteredItems = useMemo(() => {
    if (filter === 'all') return visibleItems
    return visibleItems.filter(l => l.is_active)
  }, [visibleItems, filter])

  const toggleActive = async (id: number, currentState: boolean) => {
    // Optimistic update
    setLinks(current =>
      current.map(link =>
        link.id === id ? { ...link, is_active: !currentState } : link
      )
    )

    // Server update
    await supabase.from('links').update({ is_active: !currentState }).eq('id', id)

    // Notify Preview after update
    window.dispatchEvent(new Event('vasta:link-update'))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (filter !== 'all') {
      // Disable drag if filtered, to avoid order confusion
      return
    }

    if (active.id !== over?.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        // Note: arrayMove works on the full 'items' array.
        // But if we are dragging visual items that skip actual items in the array (hidden children),
        // we might have issues if we just use indices.
        // However, standard dnd-kit vertical list usually implies visual index matching.
        // If 'items' contains hidden children, moving index 5 to 2 might jump over hidden items.

        // BETTER APPROACH for mixed lists:
        // We need to reorder the SUBSET of visible items, and then reconstruct the full list.
        // But simply swapping in the full list is easier if hidden items are ignored/safe.
        // Let's stick to simple arrayMove on the full list for now, assuming hidden items (children)
        // are usually grouped or at the end? No, they are anywhere.

        // Actually, since child links are hidden from this view, they shouldn't be involved in the drag.
        // But 'items' here IS the full list including children.
        // If I drag Item A (index 0) to position of Item B (index 5), and indices 1-4 are hidden children...
        // `arrayMove` on the full list might act weirdly if I don't map visual indices to real indices.

        // ROBUST REORDERING:
        const visibleIds = visibleItems.map(i => i.id)
        const activeId = active.id as number
        const overId = over?.id as number

        const oldVisualIndex = visibleIds.indexOf(activeId)
        const newVisualIndex = visibleIds.indexOf(overId)

        if (oldVisualIndex === -1 || newVisualIndex === -1) return items

        // Create a new array based on the visual move
        const newVisibleOrder = arrayMove(visibleIds, oldVisualIndex, newVisualIndex)

        // Reconstruct the full list, preserving the relative order of visible items
        // and keeping hidden items where they were (relative to their neighbors? or just stable).
        // Simplest strategy: Rebuild 'items' by picking from newVisibleOrder when we encounter a visible item,
        // and keeping hidden items in place? No, that's hard.

        // EASIER: Just move the item in the full list from its REAL old index to the REAL new index of the target.
        const realOldIndex = items.findIndex(i => i.id === activeId)
        const realNewIndex = items.findIndex(i => i.id === overId)

        const newItems = arrayMove(items, realOldIndex, realNewIndex)

        const updates = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }))

        // Fire and forget
        updates.forEach(upd => {
          supabase.from('links').update({ display_order: upd.display_order }).eq('id', upd.id).then()
        })

        // Notify Preview
        window.dispatchEvent(new Event('vasta:link-update'))

        return newItems
      })
    }
  }

  const openNewLinkModal = () => {
    setAddModalState({ isOpen: true, initialState: { view: 'gallery' } })
  }

  const openEditModal = async (link: LinkItem) => {
    // Check if this is a collection link
    if (link.url.startsWith('#collection:')) {
      setEditingCollection(link)
      setIsCollectionEditModalOpen(true)
      return
    }

    // Check if this is a form link
    if (link.url.startsWith('#form:')) {
      // Fetch the form ID from the forms table
      const { data: formData } = await supabase
        .from('forms')
        .select('id')
        .eq('link_id', link.id)
        .single()

      if (formData) {
        setEditingFormId(formData.id)
        setIsFormEditModalOpen(true)
      } else {
        alert('Formul\u00e1rio n\u00e3o encontrado')
      }
    } else {
      // Regular link
      setEditingLink(link)
      setIsEditModalOpen(true)
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-vasta-primary" /></div>
  }

  return (
    <div className="w-full space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vasta-text">Conteúdo</h1>
          <p className="text-sm text-vasta-muted">Gerencie links, títulos e textos da sua página</p>
        </div>
        <button
          onClick={openNewLinkModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-vasta-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-vasta-primary-soft shadow-lg shadow-vasta-primary/20 hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Adicionar novo link
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-vasta-surface-soft/50 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === 'all'
            ? 'bg-vasta-surface text-vasta-text shadow-sm border border-vasta-border'
            : 'text-vasta-muted hover:text-vasta-text'}`}
        >
          Todos ({links.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === 'active'
            ? 'bg-vasta-surface text-vasta-text shadow-sm border border-vasta-border'
            : 'text-vasta-muted hover:text-vasta-text'}`}
        >
          Ativos ({links.filter(l => l.is_active).length})
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4">
          <SortableContext items={filteredItems.map(l => l.id)} strategy={verticalListSortingStrategy}>
            {filteredItems.map(item => {
              if (item.url.startsWith('#collection:')) {
                return (
                  <CollectionItem
                    key={item.id}
                    collection={item}
                    childLinks={getCollectionLinks(item)}
                    toggleActive={toggleActive}
                    onEdit={openEditModal}
                  />
                )
              }
              return (
                <SortableLinkItem
                  key={item.id}
                  link={item}
                  toggleActive={toggleActive}
                  onEdit={openEditModal}
                />
              )
            })}
          </SortableContext>
        </div>
      </DndContext>

      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-vasta-border py-20 text-center bg-vasta-surface/30">
          <div className="h-16 w-16 rounded-full bg-vasta-surface-soft flex items-center justify-center mb-4 text-vasta-muted">
            <Plus size={32} />
          </div>
          <h3 className="font-bold text-vasta-text mb-1">Crie seu primeiro link</h3>
          <p className="text-sm text-vasta-muted max-w-xs mx-auto mb-6">Compartilhe seu Instagram, LinkedIn, loja ou qualquer outro site.</p>
          <button
            onClick={openNewLinkModal}
            className="text-sm font-bold text-vasta-primary hover:underline"
          >
            Adicionar link agora
          </button>
        </div>
      )}

      {/* Edit Modal (Legacy/Simple) */}
      <LinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        linkToEdit={editingLink}
        onSuccess={fetchLinks}
      />

      {/* New Add Link Modal */}
      <AddLinkModal
        isOpen={addModalState.isOpen}
        onClose={() => setAddModalState(prev => ({ ...prev, isOpen: false }))}
        onSuccess={fetchLinks}
        initialState={addModalState.initialState}
      />

      {/* Form Edit Modal */}
      <FormEditModal
        isOpen={isFormEditModalOpen}
        onClose={() => setIsFormEditModalOpen(false)}
        formId={editingFormId}
        onSuccess={fetchLinks}
      />

      {/* Collection Edit Modal */}
      <CollectionEditModal
        isOpen={isCollectionEditModalOpen}
        onClose={() => setIsCollectionEditModalOpen(false)}
        collectionLink={editingCollection}
        onSuccess={fetchLinks}
      />
    </div>
  )
}
