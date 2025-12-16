'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Rocket, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect immediately when user is detected, don't wait for profile
    if (user) {
      console.log('User detected, redirecting to dashboard...')
      router.replace('/dashboard')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12121e] to-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat aplikasi...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12121e] to-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">DevHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Project Management untuk{' '}
            <span className="text-primary">Developer Solo</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Platform khusus untuk indie hacker dan developer solo yang ingin merencanakan, 
            membangun, dan meluncurkan aplikasi mereka dengan lebih terorganisir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                <Rocket className="mr-2 h-5 w-5" />
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fitur Lengkap untuk Developer
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola project dari ide hingga peluncuran
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">10 Project Slots</CardTitle>
              <CardDescription>
                Kelola hingga 10 project sekaligus dengan sistem slot yang terorganisir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">Release Management</CardTitle>
              <CardDescription>
                Kelola timeline release dan update project dengan mudah dan terorganisir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">Feature Management</CardTitle>
              <CardDescription>
                Kelola fitur dengan status, due date, dan drag & drop untuk workflow yang smooth
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-primary/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Siap Membangun Project Impian Anda?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Bergabung dengan developer lain yang sudah menggunakan DevHub untuk mengelola project mereka
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Daftar Sekarang - Gratis!
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 DevHub. Dibuat dengan ❤️ untuk developer Indonesia.</p>
        </div>
      </footer>
    </div>
  )
}