'use client'

import { useState } from 'react'
import { useSettings } from '@/lib/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Bot, Sparkles, ExternalLink, AlertTriangle } from 'lucide-react'

export function AISettings() {
  const {
    aiAssistantEnabled,
    showFloatingAIButton,
    setAIAssistantEnabled,
    setShowFloatingAIButton,
  } = useSettings()

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)

  const handleTestAI = async () => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: 'Hello, test connection',
          projectId: 'test-project-id',
        }),
      })

      if (response.ok) {
        toast.success('AI Assistant terhubung dengan baik!')
      } else {
        const error = await response.json()
        console.error('AI Test Error:', error)
        
        if (response.status === 402) {
          toast.error('OpenRouter memerlukan credits. Silakan tambahkan credits di dashboard OpenRouter.')
        } else if (response.status === 401) {
          toast.error('Silakan login terlebih dahulu untuk test AI Assistant.')
        } else if (response.status === 404) {
          toast.error('Project tidak ditemukan. Test ini memerlukan project yang valid.')
        } else {
          toast.error(`Test gagal: ${error.error}`)
        }
      }
    } catch (error) {
      console.error('AI Test Error:', error)
      toast.error('Gagal menghubungi AI Assistant')
    }
  }

  return (
    <>
      <Card className="app-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-app-text-primary">
            <Bot className="h-5 w-5" />
            AI Assistant
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              GPT-3.5 Turbo
            </Badge>
          </CardTitle>
          <CardDescription>
            Asisten AI yang memahami project Anda dan dapat membantu dengan ide fitur, saran development, dan planning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-app-text-primary">Aktifkan AI Assistant</h4>
              <p className="text-sm text-app-text-secondary">
                Mengaktifkan fitur AI Assistant di seluruh aplikasi
              </p>
            </div>
            <Switch 
              checked={aiAssistantEnabled} 
              onCheckedChange={(checked: boolean) => {
                setAIAssistantEnabled(checked)
                toast.success(checked ? 'AI Assistant diaktifkan' : 'AI Assistant dinonaktifkan')
              }}
            />
          </div>

          {aiAssistantEnabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Floating AI Button</h4>
                  <p className="text-sm text-app-text-secondary">
                    Tampilkan tombol AI melayang di halaman project untuk akses cepat
                  </p>
                </div>
                <Switch 
                  checked={showFloatingAIButton} 
                  onCheckedChange={(checked: boolean) => {
                    setShowFloatingAIButton(checked)
                    toast.success(checked ? 'Floating AI button ditampilkan' : 'Floating AI button disembunyikan')
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-app-text-primary">Konfigurasi API</h4>
                    <p className="text-sm text-app-text-secondary">
                      AI menggunakan OpenRouter dengan model Google Gemma 2 27B (gratis)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowApiKeyDialog(true)}
                    >
                      Setup API Key
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTestAI}
                    >
                      Test Koneksi
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Fitur AI Assistant</h4>
                    <ul className="text-sm text-blue-200 space-y-1">
                      <li>• Memahami context project (nama, deskripsi, notes, features, releases)</li>
                      <li>• Memberikan ide fitur baru berdasarkan project yang ada</li>
                      <li>• Saran development workflow dan best practices</li>
                      <li>• Bantuan planning dan organisasi project</li>
                      <li>• Menjawab pertanyaan teknis dan metodologi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* API Key Setup Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Setup OpenRouter API Key
            </DialogTitle>
            <DialogDescription>
              Untuk menggunakan AI Assistant, Anda perlu API key dari OpenRouter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-300 mb-1">Konfigurasi Diperlukan</h4>
                  <p className="text-sm text-yellow-200">
                    API key harus dikonfigurasi di environment variables server, bukan di aplikasi client.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-app-text-primary">Langkah Setup:</h4>
              <ol className="text-sm text-app-text-secondary space-y-2 list-decimal list-inside">
                <li>Daftar akun gratis di <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">OpenRouter.ai <ExternalLink className="h-3 w-3" /></a></li>
                <li>Dapatkan API key dari dashboard OpenRouter</li>
                <li>Tambahkan ke file .env.local: <code className="bg-gray-800 px-2 py-1 rounded text-xs">OPENROUTER_API_KEY=your_key_here</code></li>
                <li>Restart aplikasi untuk menerapkan perubahan</li>
                <li>Gunakan tombol "Test Koneksi" untuk memverifikasi</li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-200">
                <strong>Catatan:</strong> OpenRouter memerlukan credits untuk menggunakan AI models. Daftar akun dan tambahkan credits di <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter Credits</a>.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowApiKeyDialog(false)}>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}