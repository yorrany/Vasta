'use client'

import { useState, useRef, useEffect } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { X, Pipette, Palette } from 'lucide-react'

interface ColorPickerModalProps {
    isOpen: boolean
    onClose: () => void
    currentColor: string
    onColorChange: (color: string) => void
}

export function ColorPickerModal({ isOpen, onClose, currentColor, onColorChange }: ColorPickerModalProps) {
    const [color, setColor] = useState(currentColor)
    const modalRef = useRef<HTMLDivElement>(null)

    // Sync with external color changes
    useEffect(() => {
        setColor(currentColor)
    }, [currentColor])

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 100)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    const handleApply = () => {
        onColorChange(color)
        onClose()
    }

    if (!isOpen) return null

    // Preset colors for quick selection
    const presetColors = [
        '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
        '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
        '#000000', '#374151', '#6B7280', '#FFFFFF',
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                style={{ animation: 'fadeIn 0.2s ease-out' }}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-sm bg-vasta-surface border border-vasta-border rounded-[2rem] shadow-2xl overflow-hidden"
                style={{ animation: 'scaleIn 0.2s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-vasta-border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vasta-primary/10">
                            <Palette className="text-vasta-primary" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-vasta-text">Escolher Cor</h3>
                            <p className="text-xs text-vasta-muted">Arraste para selecionar sua cor</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-vasta-border/50 transition-colors"
                    >
                        <X size={20} className="text-vasta-muted" />
                    </button>
                </div>

                {/* Color Picker */}
                <div className="p-6 space-y-6">
                    {/* Main Color Picker - with inline styles to ensure visibility */}
                    <div
                        className="w-full overflow-hidden rounded-2xl"
                        style={{ minHeight: '220px' }}
                    >
                        <style>{`
                            .custom-color-picker {
                                width: 100% !important;
                                height: 220px !important;
                            }
                            .custom-color-picker .react-colorful__saturation {
                                border-radius: 12px 12px 0 0;
                            }
                            .custom-color-picker .react-colorful__hue {
                                height: 24px;
                                border-radius: 0 0 12px 12px;
                                margin-top: 8px;
                            }
                            .custom-color-picker .react-colorful__saturation-pointer {
                                width: 28px;
                                height: 28px;
                                border: 4px solid white;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                            }
                            .custom-color-picker .react-colorful__hue-pointer {
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                border: 4px solid white;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                            @keyframes scaleIn {
                                from { opacity: 0; transform: scale(0.95); }
                                to { opacity: 1; transform: scale(1); }
                            }
                        `}</style>
                        <HexColorPicker
                            color={color}
                            onChange={setColor}
                            className="custom-color-picker"
                        />
                    </div>

                    {/* Current Color Preview & Hex Input */}
                    <div className="flex items-center gap-4 p-4 bg-vasta-bg rounded-2xl">
                        <div
                            className="w-14 h-14 rounded-xl shadow-lg shrink-0 border-2 border-white/20"
                            style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                            <label className="text-xs font-bold text-vasta-muted uppercase tracking-wider block mb-2">
                                Código Hex
                            </label>
                            <div className="flex items-center gap-2 bg-vasta-surface rounded-xl px-4 py-2 border border-vasta-border">
                                <span className="text-vasta-muted font-mono">#</span>
                                <HexColorInput
                                    color={color}
                                    onChange={setColor}
                                    className="w-full bg-transparent text-vasta-text font-mono font-bold uppercase focus:outline-none"
                                    prefixed={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preset Colors */}
                    <div>
                        <label className="text-xs font-bold text-vasta-muted uppercase tracking-wider block mb-3">
                            Cores Rápidas
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {presetColors.map((presetColor) => (
                                <button
                                    key={presetColor}
                                    onClick={() => setColor(presetColor)}
                                    className={`h-10 w-10 rounded-xl transition-all hover:scale-110 active:scale-95 ${color.toLowerCase() === presetColor.toLowerCase() ? 'ring-2 ring-vasta-primary ring-offset-2 ring-offset-vasta-surface' : 'border border-white/10'}`}
                                    style={{ backgroundColor: presetColor }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-4 border-t border-vasta-border">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-vasta-border text-vasta-text font-bold hover:bg-vasta-border/30 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 px-4 rounded-xl bg-vasta-primary text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Pipette size={18} />
                        Aplicar Cor
                    </button>
                </div>
            </div>
        </div>
    )
}
