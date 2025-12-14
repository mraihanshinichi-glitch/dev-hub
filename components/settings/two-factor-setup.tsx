'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/lib/store/settings-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shield, Key, Smartphone, Copy, Check } from 'lucide-react'

export function TwoFactorSetup() {
  const { twoFactorEnabled, setTwoFactorEnabled } = useSettingsStore()
  const [isSetupMode, setIsSetupMode] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes] = useState([
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0',
    'E1F2-G3H4-I5J6',
    'K7L8-M9N0-O1P2',
    'Q3R4-S5T6-U7V8'
  ])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Mock secret key for demo
  const secretKey = 'JBSWY3DPEHPK3PXP'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/DevHub:user@example.com?secret=${secretKey}&issuer=DevHub`

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      setIsSetupMode(true)
    } else {
      // Disable 2FA
      setTwoFactorEnabled(false)
      setIsSetupMode(false)
      toast.success('Two-Factor Authentication dinonaktifkan')
    }
  }

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      // In real app, verify with backend
      setTwoFactorEnabled(true)
      setIsSetupMode(false)
      setVerificationCode('')
      toast.success('Two-Factor Authentication berhasil diaktifkan!')
    } else {
      toast.error('Kode verifikasi harus 6 digit')
    }
  }

  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Backup code disalin ke clipboard')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (isSetupMode) {
    return (
      <Card className="app-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-app-text-primary">
            <Shield className="h-5 w-5" />
            Setup Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Ikuti langkah-langkah berikut untuk mengaktifkan 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: QR Code */}
          <div className="space-y-3">
            <h4 className="font-medium text-app-text-primary">1. Scan QR Code</h4>
            <p className="text-sm text-app-text-secondary">
              Gunakan aplikasi authenticator seperti Google Authenticator atau Authy
            </p>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
          </div>

          {/* Step 2: Manual Entry */}
          <div className="space-y-3">
            <h4 className="font-medium text-app-text-primary">2. Atau Masukkan Kode Manual</h4>
            <div className="flex items-center gap-2">
              <Input
                value={secretKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(secretKey)
                  toast.success('Secret key disalin ke clipboard')
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Step 3: Verification */}
          <div className="space-y-3">
            <h4 className="font-medium text-app-text-primary">3. Masukkan Kode Verifikasi</h4>
            <div className="flex gap-2">
              <Input
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="font-mono text-center text-lg"
                maxLength={6}
              />
              <Button onClick={handleVerifyCode} disabled={verificationCode.length !== 6}>
                Verifikasi
              </Button>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="space-y-3">
            <h4 className="font-medium text-app-text-primary">4. Simpan Backup Codes</h4>
            <p className="text-sm text-app-text-secondary">
              Simpan kode-kode ini di tempat yang aman. Anda dapat menggunakannya jika kehilangan akses ke authenticator.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded font-mono text-sm"
                >
                  <span className="text-gray-300">{code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyBackupCode(code)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedCode === code ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSetupMode(false)}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-app-text-primary flex items-center gap-2">
          <Key className="h-4 w-4" />
          Two-Factor Authentication
          {twoFactorEnabled && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Aktif
            </Badge>
          )}
        </h4>
        <p className="text-sm text-app-text-secondary">
          {twoFactorEnabled 
            ? 'Akun Anda dilindungi dengan 2FA' 
            : 'Tambahkan lapisan keamanan ekstra untuk akun Anda'
          }
        </p>
      </div>
      <Button 
        onClick={handleEnable2FA}
        variant={twoFactorEnabled ? "destructive" : "default"}
        size="sm"
      >
        <Smartphone className="h-4 w-4 mr-2" />
        {twoFactorEnabled ? 'Nonaktifkan 2FA' : 'Setup 2FA'}
      </Button>
    </div>
  )
}