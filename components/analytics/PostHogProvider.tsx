'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

import { createCustomRageClickDetector } from '@/lib/custom-rage-click'
import { buildPostHogPageviewUrl, getPostHogConfig } from '@/lib/posthog-config'

type PostHogProviderProps = {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const didInit = useRef(false)

  useEffect(() => {
    const config = getPostHogConfig({
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      isProduction: process.env.NODE_ENV === 'production',
    })

    if (!config.enabled) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`PostHog disabled: ${config.reason}`)
      }
      return
    }

    if (didInit.current) {
      return
    }

    posthog.init(config.key, config.options)
    didInit.current = true
  }, [])

  useEffect(() => {
    if (!didInit.current) {
      return
    }

    posthog.capture('$pageview', {
      $current_url: buildPostHogPageviewUrl(pathname, window.location.search.replace(/^\?/, '')),
    })
  }, [pathname])

  useEffect(() => {
    if (!didInit.current) {
      return
    }

    const detector = createCustomRageClickDetector({
      threshold: 3,
      windowMs: 800,
      onRageClick: () => posthog.capture('custom_rage_click'),
    })

    const handleClick = (event: MouseEvent) => {
      detector.recordClick({
        target: event.target,
        timeStamp: event.timeStamp,
      })
    }

    window.addEventListener('click', handleClick, { passive: true })

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return children
}
