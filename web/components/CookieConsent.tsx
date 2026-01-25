"use client"

import { useState, useEffect } from "react"
import { X, Settings, Shield, Cookie } from "lucide-react"

interface CookiePreferences {
    necessary: boolean // Always true
    analytics: boolean
    security: boolean
    functional: boolean
}

interface CookieDetails {
    name: string
    category: 'necessary' | 'analytics' | 'security' | 'functional'
    purpose: string
    duration: string
    provider: string
}

const COOKIES: CookieDetails[] = [
    // Cookies Necessários
    {
        name: 'supabase-auth-token',
        category: 'necessary',
        purpose: 'Mantém você autenticado durante sua sessão',
        duration: '7 dias',
        provider: 'Supabase'
    },
    {
        name: 'vasta-consent',
        category: 'necessary',
        purpose: 'Armazena suas preferências de cookies',
        duration: '1 ano',
        provider: 'Vasta (próprio)'
    },
    // Cookies de Segurança
    {
        name: 'cf_clearance',
        category: 'security',
        purpose: 'Proteção contra bots e ataques automatizados',
        duration: '30 minutos',
        provider: 'Cloudflare Turnstile'
    },
    // Cookies Analíticos
    {
        name: 'supabase-analytics',
        category: 'analytics',
        purpose: 'Análise de uso da plataforma para melhorias',
        duration: '30 dias',
        provider: 'Supabase Analytics'
    },
    // Cookies Funcionais
    {
        name: 'user-theme-preference',
        category: 'functional',
        purpose: 'Salva suas preferências de tema (claro/escuro)',
        duration: '1 ano',
        provider: 'Vasta (próprio)'
    }
]

const DEFAULT_PREFERENCES: CookiePreferences = {
    necessary: true,
    analytics: false,
    security: false,
    functional: false
}

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)
    const [showPreferences, setShowPreferences] = useState(false)
    const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

    useEffect(() => {
        const consent = localStorage.getItem('vasta-consent')
        if (!consent) {
            setShowBanner(true)
        } else {
            try {
                setPreferences(JSON.parse(consent))
            } catch {
                setShowBanner(true)
            }
        }
    }, [])

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            security: true,
            functional: true
        }
        savePreferences(allAccepted)
    }

    const acceptNecessary = () => {
        savePreferences(DEFAULT_PREFERENCES)
    }

    const savePreferences = (prefs: CookiePreferences) => {
        setPreferences(prefs)
        localStorage.setItem('vasta-consent', JSON.stringify(prefs))
        localStorage.setItem('vasta-consent-date', new Date().toISOString())
        setShowBanner(false)
        setShowPreferences(false)

        // Dispatch event for analytics tracking
        window.dispatchEvent(new CustomEvent('vasta:consent-updated', { detail: prefs }))
    }

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return // Can't disable necessary cookies
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const categoryInfo = {
        necessary: {
            title: 'Cookies Necessários',
            description: 'Essenciais para o funcionamento básico do site. Não podem ser desativados.',
            icon: Shield,
            required: true
        },
        security: {
            title: 'Cookies de Segurança',
            description: 'Protegem contra fraudes e garantem a segurança da sua conta.',
            icon: Shield,
            required: false
        },
        analytics: {
            title: 'Cookies Analíticos',
            description: 'Nos ajudam a entender como você usa o site para melhorar sua experiência.',
            icon: Cookie,
            required: false
        },
        functional: {
            title: 'Cookies Funcionais',
            description: 'Permitem funcionalidades avançadas e personalização.',
            icon: Settings,
            required: false
        }
    }

    if (!showBanner && !showPreferences) return null

    return (
        <>
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Vasta",
                        "cookiePolicy": {
                            "@type": "CreativeWork",
                            "name": "Política de Cookies",
                            "description": "Utilizamos cookies para melhorar sua experiência e garantir a segurança da plataforma"
                        }
                    })
                }}
            />

            {/* Banner */}
            {showBanner && !showPreferences && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Cookie className="text-blue-500" size={24} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        Sua privacidade é importante
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                        Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência,
                                        garantir a segurança da plataforma e personalizar conteúdo conforme seus interesses.
                                        Ao clicar em "Aceitar Todos", você concorda com o uso de todas as tecnologias.
                                        Você pode gerenciar suas preferências a qualquer momento.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={acceptAll}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
                                        >
                                            Aceitar Todos
                                        </button>
                                        <button
                                            onClick={acceptNecessary}
                                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-colors"
                                        >
                                            Apenas Necessários
                                        </button>
                                        <button
                                            onClick={() => setShowPreferences(true)}
                                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-colors"
                                        >
                                            <Settings className="inline mr-2" size={16} />
                                            Gerenciar Preferências
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                                        Ao continuar navegando, você concorda com nossa{' '}
                                        <a href="/privacy" className="underline hover:text-blue-600">Política de Privacidade</a>
                                        {' '}e{' '}
                                        <a href="/terms" className="underline hover:text-blue-600">Termos de Uso</a>.
                                        {' '}Conforme a LGPD (Lei nº 13.709/2018).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Settings className="text-blue-500" size={24} />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Preferências de Privacidade
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Sobre suas escolhas:</strong> Você pode optar por não permitir certos tipos de cookies.
                                    No entanto, bloquear alguns tipos pode impactar sua experiência no site e os serviços que podemos oferecer.
                                </p>
                            </div>

                            {/* Categories */}
                            {Object.entries(categoryInfo).map(([key, info]) => {
                                const categoryCookies = COOKIES.filter(c => c.category === key)
                                const Icon = info.icon
                                const isEnabled = preferences[key as keyof CookiePreferences]

                                return (
                                    <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                        <div className="p-5 bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <Icon className="text-blue-500" size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-gray-900 dark:text-white">{info.title}</h3>
                                                            {info.required && (
                                                                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 rounded">
                                                                    Obrigatório
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                                                    </div>
                                                </div>

                                                {/* Toggle */}
                                                <button
                                                    onClick={() => togglePreference(key as keyof CookiePreferences)}
                                                    disabled={info.required}
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${isEnabled
                                                            ? 'bg-blue-600'
                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                        } ${info.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'
                                                        }`} />
                                                </button>
                                            </div>

                                            {/* Cookie Details */}
                                            <div className="mt-4 space-y-2">
                                                {categoryCookies.map((cookie, idx) => (
                                                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-3 text-xs">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <span className="font-bold text-gray-700 dark:text-gray-300">Nome:</span>
                                                                <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">{cookie.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-gray-700 dark:text-gray-300">Provedor:</span>
                                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{cookie.provider}</span>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="font-bold text-gray-700 dark:text-gray-300">Finalidade:</span>
                                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{cookie.purpose}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-gray-700 dark:text-gray-300">Duração:</span>
                                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{cookie.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* LGPD Notice */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    <strong className="text-gray-900 dark:text-white">Lei Geral de Proteção de Dados (LGPD):</strong>
                                    {' '}Em conformidade com a Lei nº 13.709/2018, você tem o direito de acessar, corrigir, excluir
                                    ou portar seus dados pessoais. Para exercer esses direitos ou obter mais informações sobre como
                                    tratamos seus dados, consulte nossa Política de Privacidade ou entre em contato através do email:
                                    <a href="mailto:privacidade@vasta.app" className="underline ml-1 text-blue-600 dark:text-blue-400">
                                        privacidade@vasta.app
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => savePreferences(preferences)}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Salvar Preferências
                            </button>
                            <button
                                onClick={acceptAll}
                                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                Aceitar Todos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
