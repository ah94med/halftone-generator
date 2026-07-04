import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from '@/components/NavBar'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <NavBar />
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
