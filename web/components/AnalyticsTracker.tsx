
"use client"

import { useEffect, useRef } from 'react'

interface AnalyticsTrackerProps {
    profileId: string
}

export function AnalyticsTracker({ profileId }: AnalyticsTrackerProps) {
    const hasTracked = useRef(false)

    useEffect(() => {
        if (hasTracked.current) return
        hasTracked.current = true

        const trackView = async () => {
            try {
                // Get basic meta info
                const meta = {
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
                    screen: `${window.screen.width}x${window.screen.height}`,
                    language: navigator.language
                }

                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId,
                        type: 'view',
                        meta
                    })
                })
            } catch (err) {
                console.error('Failed to track view:', err)
            }
        }

        trackView()
    }, [profileId])

    return null
}
