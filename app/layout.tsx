import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevHub - Project Management untuk Developer',
  description: 'Platform manajemen project khusus untuk developer solo dan indie hacker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            {children}
            <Toaster 
              theme="dark" 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1f2937',
                  border: '1px solid #374151',
                  color: '#ffffff',
                },
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}