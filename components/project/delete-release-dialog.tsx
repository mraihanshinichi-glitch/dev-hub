'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Release } from '@/lib/types/database'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

interface DeleteReleaseDialogProps {
  release: Release
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteReleaseDialog({
  release,
  open,
  onOpenChange,
  onSuccess,
}: DeleteReleaseDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', release.id)

      if (error) {
        toast.error('Gagal menghapus release')
        console.error(error)
      } else {
        toast.success('Release berhasil dihapus!')
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus release')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-red-400">Hapus Release</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-300 mb-4">
            Anda yakin ingin menghapus release <strong>"v{release.version}"</strong>?
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-300">
              <strong>Peringatan:</strong> Release ini akan dihapus dari timeline 
              dan semua fitur yang terkait akan terlepas dari release ini.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus Release'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}