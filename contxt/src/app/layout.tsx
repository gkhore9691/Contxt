import type { Metadata } from 'next'
import { DM_Serif_Display, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { AuthProvider } from '@/lib/auth/context'
import { ToastProvider } from '@/lib/toast'
import './globals.css'

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Brain Pack — Load Your Brain Into Any AI Agent',
  description:
    'Build structured Context Packs for AI coding agents. Load your full project context into Claude Code, Cursor, Windsurf, and more in 30 seconds.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
    >
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
