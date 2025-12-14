'use client'

import { useState, useRef } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import { createClient } from '@/lib/supabase/client'
import { uploadAvatar, deleteAvatar } from '@/lib/utils/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Upload, Camera, Trash2, User } from 'lucide-react'

export function AvatarUploadDialog() {
  const { user, profile, setProfile } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return false
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return false
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      validateAndSetFile(imageFile)
    } else {
      toast.error('Silakan drop file gambar')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload avatar using utility function
      const result = await uploadAvatar(selectedFile, user.id)
      
      clearInterval(progressInterval)
      setUploadProgress(95)
      
      if (!result.success) {
        // Check if it's a storage setup issue
        if (result.error?.includes('bucket') || result.error?.includes('storage')) {
          toast.error('Storage belum di-setup. Silakan lihat STORAGE_SETUP.md untuk instruksi.')
        } else {
          toast.error(result.error || 'Gagal upload avatar')
        }
        return
      }

      // Update profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: result.avatarUrl })
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        toast.error(`Gagal update profile: ${profileError.message}`)
        return
      }

      setUploadProgress(100)
      
      // Update local state
      setProfile(profileData)
      toast.success('Avatar berhasil diupdate!')
      
      // Reset form after a short delay
      setTimeout(() => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setUploadProgress(0)
        setIsOpen(false)
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 500)

    } catch (error) {
      toast.error('Terjadi kesalahan saat upload avatar')
      console.error(error)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user || !profile?.avatar_url) return

    setIsUploading(true)

    try {
      // Delete avatar files from storage
      const deleteResult = await deleteAvatar(user.id)
      
      if (!deleteResult.success) {
        toast.error(deleteResult.error || 'Gagal menghapus avatar dari storage')
        return
      }

      // Update profile to remove avatar URL
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        toast.error(`Gagal update profile: ${profileError.message}`)
        return
      }

      // Update local state
      setProfile(profileData)
      toast.success('Avatar berhasil dihapus!')
      setIsOpen(false)

    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Camera className="h-4 w-4 mr-2" />
          Ubah Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ubah Avatar Profile
          </DialogTitle>
          <DialogDescription>
            Upload gambar baru untuk avatar profile Anda. Maksimal 5MB.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-6">
              {/* Current Avatar */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-2">
                  <AvatarImage 
                    src={profile?.avatar_url || ''} 
                    alt={profile?.full_name || ''} 
                  />
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-slate-500 dark:text-gray-500">Saat ini</p>
              </div>

              {/* Arrow */}
              {previewUrl && (
                <>
                  <div className="text-slate-400 dark:text-gray-500">→</div>
                  
                  {/* New Avatar Preview */}
                  <div className="text-center">
                    <div className="relative">
                      <Avatar className="h-20 w-20 mx-auto mb-2">
                        <AvatarImage 
                          src={previewUrl} 
                          alt="Preview" 
                        />
                        <AvatarFallback className="bg-primary text-white text-lg">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">Preview</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="avatar-upload">Pilih Gambar Baru</Label>
            
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-slate-300 dark:border-gray-600 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-gray-500" />
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">
                Drag & drop gambar di sini atau{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  pilih file
                </button>
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-500">
                JPG, PNG, GIF hingga 5MB
              </p>
            </div>
            
            <Input
              id="avatar-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* File Info */}
            {selectedFile && (
              <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                      <Camera className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {selectedFile && (
              <div className="space-y-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? `Mengupload... ${uploadProgress}%` : 'Upload Avatar'}
                </Button>
                
                {isUploading && (
                  <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {profile?.avatar_url && (
              <Button 
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Avatar
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
              className="w-full"
            >
              Batal
            </Button>
          </div>

          {/* Tips */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 text-sm mb-1">
              Tips Avatar yang Baik:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Gunakan foto wajah yang jelas</li>
              <li>• Rasio 1:1 (persegi) untuk hasil terbaik</li>
              <li>• Hindari gambar yang terlalu gelap atau terang</li>
              <li>• Ukuran minimal 200x200 pixel</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}