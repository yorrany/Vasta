"use client"

import { useEffect, useState } from "react"
import { CookieConsent } from "./CookieConsent"

interface PublicPageData {
    accentColor?: string
    isDark?: boolean
}

export function ThemedCookieConsent() {
    const [theme, setTheme] = useState<PublicPageData>({})

    useEffect(() => {
        // Listen for theme updates from public page
        const handleThemeUpdate = (event: CustomEvent<PublicPageData>) => {
            setTheme(event.detail)
        }

        window.addEventListener('vasta:theme-update' as any, handleThemeUpdate)

        // Also check if theme is already set
        const existingTheme = (window as any).__vastaTheme
        if (existingTheme) {
            setTheme(existingTheme)
        }

        return () => {
            window.removeEventListener('vasta:theme-update' as any, handleThemeUpdate)
        }
    }, [])

    return <CookieConsent accentColor={theme.accentColor} isDark={theme.isDark} />
}
