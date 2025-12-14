'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, ExternalLink, Database } from 'lucide-react'

export function StorageStatus() {
  const [storageReady, setStorageReady] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const supabase = createClient()

  const checkStorageSetup = async () => {
    setIsChecking(true)
    try {
      // Try to list buckets to check if storage is accessible
      const { data, error } = await supabase.storage.listBuckets()
      
      if (error) {
        setStorageReady(false)
        return
      }

      // Check if avatars bucket exists
      const avatarsBucket = data?.find(bucket => bucket.id === 'avatars')
      setStorageReady(!!avatarsBucket)
      
    } catch (error) {
      setStorageReady(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStorageSetup()
  }, [])

  if (storageReady === null) {
    return (
      <Card className="bg-slate-50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-slate-600 dark:text-gray-400">
              Memeriksa storage setup...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (storageReady) {
    return (
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Storage siap digunakan
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
              Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 text-sm">
          <AlertTriangle className="h-4 w-4" />
          Storage Belum Di-Setup
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-400">
          Bucket storage untuk avatar belum dikonfigurasi. Upload avatar tidak akan berfungsi.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            <p className="mb-2">Untuk mengaktifkan upload avatar:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Buka Supabase Dashboard → Storage</li>
              <li>Buat bucket baru dengan nama "avatars"</li>
              <li>Set sebagai public bucket</li>
              <li>Setup RLS policies untuk keamanan</li>
            </ol>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkStorageSetup}
              disabled={isChecking}
              className="text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
            >
              <Database className="h-3 w-3 mr-1" />
              {isChecking ? 'Memeriksa...' : 'Cek Ulang'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/supabase/STORAGE_SETUP.md', '_blank')}
              className="text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Panduan Setup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}