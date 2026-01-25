"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type LinkItem = {
    id: number
    title: string
    url: string
    is_active: boolean
    display_order: number
    icon?: string
}

interface CollectionItemProps {
    collection: LinkItem
    childLinks: LinkItem[]
    toggleActive: (id: number, currentState: boolean) => void
    onEdit: (link: LinkItem) => void
}

export function CollectionItem({ collection, childLinks, toggleActive, onEdit }: CollectionItemProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: collection.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
    }

    let collectionData = { description: '', links: [] as number[] }
    try {
        collectionData = JSON.parse(collection.url.replace('#collection:', ''))
    } catch {
        // Invalid collection data
    }

    return (
        <div ref={setNodeRef} style={style} className="space-y-2">
            {/* Collection Header */}
            <div
                className={`group flex items-center gap-3 rounded-2xl border border-vasta-border bg-vasta-surface/50 p-4 transition-all hover:bg-vasta-surface ${isDragging ? "shadow-2xl brightness-110 scale-[1.02]" : "shadow-sm"
                    } ${!collection.is_active ? "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : ""}`}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-vasta-muted transition-colors hover:text-vasta-text p-2 -ml-2 rounded-lg hover:bg-vasta-surface-soft"
                >
                    <GripVertical size={20} />
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-vasta-muted hover:text-vasta-text transition-colors p-1"
                >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                <div className="flex-1 space-y-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 w-full">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">
                            📚 Coleção
                        </span>
                        <div className="font-semibold text-vasta-text truncate text-sm flex-1 min-w-0">
                            {collection.title}
                        </div>
                        <span className="text-xs text-vasta-muted">
                            {childLinks.length} {childLinks.length === 1 ? 'link' : 'links'}
                        </span>
                    </div>

                    {collectionData.description && (
                        <div className="text-xs text-vasta-muted truncate pl-0.5 opacity-80">
                            {collectionData.description}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <button
                        onClick={() => onEdit(collection)}
                        className="rounded-lg bg-vasta-surface-soft px-3 py-1.5 text-xs font-medium text-vasta-text transition-colors hover:bg-vasta-border"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => toggleActive(collection.id, collection.is_active)}
                        className={`relative h-6 w-11 rounded-full p-1 transition-colors ${collection.is_active ? "bg-vasta-primary" : "bg-vasta-muted/30"
                            }`}
                    >
                        <div
                            className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${collection.is_active ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Child Links */}
            {isExpanded && childLinks.length > 0 && (
                <div className="ml-8 space-y-2 pl-4 border-l-2 border-vasta-border/30">
                    {childLinks.map((link) => (
                        <div
                            key={link.id}
                            className="group flex items-center gap-3 rounded-xl border border-vasta-border/50 bg-vasta-surface/30 p-3 transition-all hover:bg-vasta-surface/50 text-sm"
                        >
                            <div className="flex-1 space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                    {link.icon && <span className="text-sm">{link.icon}</span>}
                                    <div className="font-medium text-vasta-text truncate">
                                        {link.title}
                                    </div>
                                </div>
                                <div className="text-xs text-vasta-muted truncate opacity-70">
                                    {link.url}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
