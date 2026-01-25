"use client"

import { useState } from "react"
import { 
  X, Loader2, Save, ArrowLeft, GripVertical, Mail, 
  AlertCircle, CheckCircle2, Trash2, Plus
} from "lucide-react"
import { createClient } from "../../lib/supabase/client"
import { useAuth } from "../../lib/AuthContext"
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
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface FormModalProps {
  isOpen: boolean
  onClose?: () => void
  onSuccess: () => void
  onBack?: () => void
  embedded?: boolean
}

type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select'

interface FormField {
  id: string
  label: string
  type: FormFieldType
  required: boolean
  placeholder?: string
  options?: string[]
  order: number
}

interface NotificationState {
  type: 'error' | 'success' | null
  message: string
}

function SortableFieldItem({ 
  field, 
  index, 
  onUpdate, 
  onRemove, 
  canRemove 
}: { 
  field: FormField
  index: number
  onUpdate: (id: string, updates: Partial<FormField>) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl border border-vasta-border bg-vasta-surface-soft space-y-3 ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
    >
                <div className="flex items-start gap-2 sm:gap-3 flex-wrap">
                    <button
                      type="button"
                      {...attributes}
                      {...listeners}
                      className="cursor-grab active:cursor-grabbing text-vasta-muted hover:text-vasta-text transition-colors p-1.5 shrink-0 mt-1"
                      title="Arrastar para reordenar"
                    >
                      <GripVertical size={16} />
                    </button>
                    <span className="text-xs font-bold text-vasta-muted w-5 shrink-0 mt-2">#{index + 1}</span>
                    
                    <div className="flex-1 min-w-[150px]">
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => onUpdate(field.id, { label: e.target.value })}
                        placeholder="Nome do campo"
                        className="w-full rounded-lg border border-vasta-border bg-vasta-surface px-3 py-2 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none"
                      />
                    </div>
                    
                    <div className="w-full sm:w-auto sm:min-w-[140px]">
                      <select
                        value={field.type}
                        onChange={e => onUpdate(field.id, { type: e.target.value as FormFieldType })}
                        className="w-full rounded-lg border border-vasta-border bg-vasta-surface px-3 py-2 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none"
                      >
                        <option value="text">Texto</option>
                        <option value="email">Email</option>
                        <option value="tel">Telefone</option>
                        <option value="textarea">Texto Longo</option>
                        <option value="select">Seleção</option>
                      </select>
                    </div>
                    
                    <label className="flex items-center gap-1.5 text-xs text-vasta-muted whitespace-nowrap shrink-0">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => onUpdate(field.id, { required: e.target.checked })}
                        className="rounded"
                      />
                      <span className="hidden sm:inline">Obrigatório</span>
                      <span className="sm:hidden">Obrig.</span>
                    </label>
                    
                    {canRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(field.id)}
                        className="text-vasta-muted hover:text-red-500 transition-colors p-1.5 shrink-0"
                        title="Remover campo"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
      
      {field.type === 'select' && (
        <div>
          <input
            type="text"
            value={field.options?.join(', ') || ''}
            onChange={e => onUpdate(field.id, { 
              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
            })}
            placeholder="Opções separadas por vírgula (Ex: Opção 1, Opção 2)"
            className="w-full rounded-lg border border-vasta-border bg-vasta-surface px-3 py-2 text-xs text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none"
          />
        </div>
      )}
      
      {field.type !== 'select' && (
        <div>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={e => onUpdate(field.id, { placeholder: e.target.value })}
            placeholder="Placeholder (opcional)"
            className="w-full rounded-lg border border-vasta-border bg-vasta-surface px-3 py-2 text-xs text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none"
          />
        </div>
      )}
    </div>
  )
}

export function FormModal({ isOpen, onClose, onSuccess, onBack, embedded = false }: FormModalProps) {
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [destinationEmail, setDestinationEmail] = useState("")
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', label: 'Nome', type: 'text', required: true, placeholder: 'Seu nome completo', order: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<NotificationState>({ type: null, message: '' })
  
  const { user } = useAuth()
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: null, message: '' }), 5000)
  }

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'Novo Campo',
      type: 'text',
      required: false,
      order: fields.length
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const removeField = (id: string) => {
    const newFields = fields.filter(f => f.id !== id)
    // Reorder remaining fields
    setFields(newFields.map((f, index) => ({ ...f, order: index })))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order numbers
        return newItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }

  const validateForm = (): string | null => {
    if (!formTitle.trim()) {
      return "O título do formulário é obrigatório"
    }
    
    if (fields.length === 0) {
      return "Adicione pelo menos um campo ao formulário"
    }
    
    for (const field of fields) {
      if (!field.label.trim()) {
        return `O campo #${fields.indexOf(field) + 1} precisa de um nome`
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        return `O campo "${field.label}" precisa de opções para seleção`
      }
    }
    
    if (destinationEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinationEmail)) {
      return "O e-mail de destino não é válido"
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      showNotification('error', 'Você precisa estar logado para criar um formulário')
      return
    }

    const validationError = validateForm()
    if (validationError) {
      showNotification('error', validationError)
      return
    }

    setLoading(true)

    try {
      // Get max order
      const { data: maxOrderData, error: orderError } = await supabase
        .from('links')
        .select('display_order')
        .eq('profile_id', user.id)
        .order('display_order', { ascending: false })
        .limit(1)

      if (orderError) throw orderError

      const nextOrder = (maxOrderData?.[0]?.display_order ?? 0) + 1

      // Prepare form data
      const formFields = fields.map(f => ({
        label: f.label.trim(),
        type: f.type,
        required: f.required,
        placeholder: f.placeholder?.trim() || null,
        options: f.options || null,
        order: f.order
      }))

      // First, save as a link
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .insert({
          profile_id: user.id,
          title: formTitle.trim(),
          url: `#form:${Date.now()}`,
          icon: '📝',
          is_active: true,
          display_order: nextOrder,
        })
        .select()
        .single()

      if (linkError) {
        console.error("Error saving link:", linkError)
        throw new Error(linkError.message || "Erro ao salvar formulário")
      }

      // Then, save form configuration to forms table
      const { error: formError } = await supabase
        .from('forms')
        .insert({
          profile_id: user.id,
          link_id: linkData.id,
          title: formTitle.trim(),
          description: formDescription.trim() || null,
          destination_email: destinationEmail.trim() || null,
          fields: formFields,
        })

      if (formError) {
        console.error("Error saving form config:", formError)
        // Rollback: delete the link if form creation fails
        await supabase.from('links').delete().eq('id', linkData.id)
        throw new Error(formError.message || "Erro ao salvar configuração do formulário")
      }
      
      showNotification('success', 'Formulário criado com sucesso!')
      
      // Wait a bit to show success message
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('vasta:link-update'))
        onSuccess()
        if (onClose) onClose()
      }, 1000)
    } catch (error: any) {
      console.error("Error saving form:", error)
      showNotification('error', error.message || "Erro ao salvar formulário. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-200 fade-in min-w-0">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-vasta-muted hover:text-vasta-text transition-colors mb-4 w-fit shrink-0"
        >
          <ArrowLeft size={16} />
          Voltar para galeria
        </button>
      )}

      {/* Notification */}
      {notification.type && (
        <div
          className={`mb-4 p-3 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-5 duration-200 ${
            notification.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification({ type: null, message: '' })}
            className="ml-auto text-current opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar min-w-0">
        <h2 className="text-xl font-bold text-vasta-text mb-6">Criar Formulário</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-vasta-muted uppercase mb-2">
                Título do Formulário <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Ex: Formulário de Contato"
                className="w-full rounded-xl border border-vasta-border bg-vasta-surface-soft px-4 py-3 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vasta-muted uppercase mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Descreva o propósito deste formulário..."
                rows={2}
                className="w-full rounded-xl border border-vasta-border bg-vasta-surface-soft px-4 py-3 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vasta-muted uppercase mb-2">
                <Mail size={14} className="inline mr-1.5 align-middle" />
                E-mail de Destino (opcional)
              </label>
              <input
                type="email"
                value={destinationEmail}
                onChange={e => setDestinationEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full rounded-xl border border-vasta-border bg-vasta-surface-soft px-4 py-3 text-sm text-vasta-text focus:border-vasta-primary focus:ring-1 focus:ring-vasta-primary outline-none transition-all"
              />
              <p className="text-xs text-vasta-muted mt-2 leading-relaxed">
                As respostas serão <strong>sempre armazenadas</strong> na sua dashboard. Se preenchido, você também receberá notificações por e-mail.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-vasta-muted uppercase">
                Campos do Formulário <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 text-xs font-bold text-vasta-primary hover:text-vasta-primary-soft transition-colors px-3 py-1.5 rounded-lg hover:bg-vasta-primary/10"
              >
                <Plus size={14} />
                Adicionar Campo
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-vasta-border bg-vasta-surface-soft/50 text-center">
                <p className="text-sm text-vasta-muted mb-3">Nenhum campo adicionado</p>
                <button
                  type="button"
                  onClick={addField}
                  className="text-sm font-bold text-vasta-primary hover:underline"
                >
                  Adicionar primeiro campo
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        onUpdate={updateField}
                        onRemove={removeField}
                        canRemove={fields.length > 1}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-vasta-border">
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
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-vasta-primary text-white py-3 text-sm font-bold hover:bg-vasta-primary-soft transition-all shadow-lg shadow-vasta-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Criar Formulário
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
