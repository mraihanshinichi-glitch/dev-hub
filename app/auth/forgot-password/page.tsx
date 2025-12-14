'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Code2, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        setIsSubmitted(true)
        toast.success('Email reset password telah dikirim!')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim email reset')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12121e] to-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">DevHub</span>
          </Link>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              {isSubmitted ? 'Email Terkirim' : 'Lupa Password'}
            </CardTitle>
            <CardDescription>
              {isSubmitted 
                ? 'Silakan cek email Anda untuk link reset password'
                : 'Masukkan email Anda untuk reset password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-300">
                  Kami telah mengirim link reset password ke <strong>{email}</strong>. 
                  Silakan cek inbox atau folder spam Anda.
                </p>
                <div className="space-y-2">
                  <Link href="/auth/login">
                    <Button className="w-full">
                      Kembali ke Login
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                  >
                    Kirim Ulang
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}