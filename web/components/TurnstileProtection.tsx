"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

// Cloudflare Turnstile keys
const TURNSTILE_TEST_KEY = '1x00000000000000000000AA' // Always passes
const TURNSTILE_PROD_KEY = process.env.NEXT_PUBLIC_TURNSTILE_KEY || '0x4AAAAAACLyd4XoDMS56kOLRKOQfMRUUJU'

export function TurnstileProtection() {
  const [isLocalhost, setIsLocalhost] = useState(true) // Default to true to prevent flash

  useEffect(() => {
    // Check if we're on localhost
    const hostname = window.location.hostname
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')
    setIsLocalhost(isLocal)
  }, [])

  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
    />
  )
}

return (
  <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
      strategy="afterInteractive"
    />
    <div ref={containerRef} className="hidden" />
  </>
)
}
