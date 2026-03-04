import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'RoleMark - Every Role Deserves the Right Resume',
    template: '%s | RoleMark',
  },
  description:
    'AI-powered resume scoring, tailoring, and cover letter generation. Upload your resume, score it against any role, and get a tailored version that lands interviews.',
  keywords: [
    'resume',
    'AI resume',
    'resume scoring',
    'cover letter',
    'job application',
    'resume builder',
  ],
  icons: {
    icon: [
      {
        url: '/favicon.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.jpg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/favicon.jpg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1328DC' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
