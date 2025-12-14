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
import { Feature } from '@/lib/types/database'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

interface DeleteFeatureDialogProps {
  feature: Feature
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteFeatureDialog({
  feature,
  open,
  onOpenChange,
  onSuccess,
}: DeleteFeatureDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', feature.id)

      if (error) {
        toast.error('Gagal menghapus fitur')
        console.error(error)
      } else {
        toast.success('Fitur berhasil dihapus!')
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus fitur')
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
              <DialogTitle className="text-red-400">Hapus Fitur</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-300 mb-4">
            Anda yakin ingin menghapus fitur <strong>"{feature.title}"</strong>?
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-300">
              <strong>Peringatan:</strong> Fitur ini akan dihapus dari semua release 
              yang terkait dan tidak dapat dikembalikan.
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
            {isLoading ? 'Menghapus...' : 'Ya, Hapus Fitur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}