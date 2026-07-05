'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

import { createCustomRageClickDetector } from '@/lib/custom-rage-click'
import { buildPostHogPageviewUrl, getPostHogConfig } from '@/lib/posthog-config'

type PostHogProviderProps = {
  children: React.ReactNode
}

const DEBUG_PREFIX = '[PostHog]'

function debugLog(message: string, data?: unknown) {
  if (typeof window !== 'undefined') {
    const timestamp = new Date().toISOString()
    if (data !== undefined) {
      console.log(`${DEBUG_PREFIX} ${timestamp} — ${message}`, data)
    } else {
      console.log(`${DEBUG_PREFIX} ${timestamp} — ${message}`)
    }
  }
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const didInit = useRef(false)

  useEffect(() => {
    debugLog('Initialising PostHog provider')

    const rawKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const rawHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
    const isProduction = process.env.NODE_ENV === 'production'

    debugLog('Environment variables read', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_POSTHOG_KEY: rawKey ? `${rawKey.substring(0, 12)}...` : '(empty)',
      NEXT_PUBLIC_POSTHOG_HOST: rawHost || '(empty)',
    })

    const config = getPostHogConfig({
      key: rawKey,
      host: rawHost,
      isProduction,
    })

    debugLog('Config resolved', { enabled: config.enabled, reason: config.reason })

    if (!config.enabled) {
      console.warn(`${DEBUG_PREFIX} PostHog disabled: ${config.reason}`)
      return
    }

    if (didInit.current) {
      debugLog('Already initialised, skipping')
      return
    }

    debugLog('Calling posthog.init()', {
      key: `${config.key.substring(0, 12)}...`,
      api_host: config.options.api_host,
      autocapture: config.options.autocapture,
      capture_pageview: config.options.capture_pageview,
      disable_session_recording: config.options.disable_session_recording,
    })

    try {
      posthog.init(config.key, config.options)
      didInit.current = true
      debugLog('posthog.init() completed successfully')
    } catch (error) {
      console.error(`${DEBUG_PREFIX} posthog.init() failed`, error)
    }
  }, [])

  useEffect(() => {
    if (!didInit.current) {
      debugLog('Skipping $pageview — PostHog not initialised yet')
      return
    }

    const url = buildPostHogPageviewUrl(pathname, window.location.search.replace(/^\?/, ''))
    debugLog('Capturing $pageview', { url })

    try {
      posthog.capture('$pageview', {
        $current_url: url,
      })
      debugLog('$pageview captured successfully')
    } catch (error) {
      console.error(`${DEBUG_PREFIX} $pageview capture failed`, error)
    }
  }, [pathname])

  useEffect(() => {
    if (!didInit.current) {
      debugLog('Skipping rage-click detector — PostHog not initialised yet')
      return
    }

    debugLog('Setting up custom rage-click detector', { threshold: 3, windowMs: 800 })

    const detector = createCustomRageClickDetector({
      threshold: 3,
      windowMs: 800,
      onRageClick: () => {
        debugLog('Rage click detected, capturing custom_rage_click')
        posthog.capture('custom_rage_click')
      },
    })

    const handleClick = (event: MouseEvent) => {
      detector.recordClick({
        target: event.target,
        timeStamp: event.timeStamp,
      })
    }

    window.addEventListener('click', handleClick, { passive: true })
    debugLog('Rage-click listener attached')

    return () => {
      window.removeEventListener('click', handleClick)
      debugLog('Rage-click listener removed')
    }
  }, [])

  return children
}
