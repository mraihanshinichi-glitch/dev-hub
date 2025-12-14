'use client'

import { useState, useRef } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import { createClient } from '@/lib/supabase/client'
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
import { Upload, Camera, Trash2, User, Link, Globe, Shuffle } from 'lucide-react'
import { generateGravatarUrl, generateInitialsAvatar, generateRandomAvatar, isValidImageUrl } from '@/lib/utils/gravatar'

export function SimpleAvatarUpload() {
  const { user, profile, setProfile } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
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

  const handleUrlSubmit = async () => {
    if (!avatarUrl.trim() || !user) return

    setIsUploading(true)

    try {
      // Validate URL
      if (!isValidImageUrl(avatarUrl)) {
        toast.error('URL gambar tidak valid')
        return
      }

      // Update profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        toast.error(`Gagal update avatar: ${profileError.message}`)
        return
      }

      // Update local state
      setProfile(profileData)
      toast.success('Avatar berhasil diupdate!')
      setIsOpen(false)

    } catch (error) {
      toast.error('Terjadi kesalahan saat update avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)

    try {
      // Convert to base64 and store in database
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        // Update profile with base64 data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: base64 })
          .eq('id', user.id)
          .select()
          .single()

        if (profileError) {
          toast.error(`Gagal upload avatar: ${profileError.message}`)
          return
        }

        // Update local state
        setProfile(profileData)
        toast.success('Avatar berhasil diupload!')
        setSelectedFile(null)
        setPreviewUrl(null)
        setIsOpen(false)
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
      
      reader.readAsDataURL(selectedFile)

    } catch (error) {
      toast.error('Terjadi kesalahan saat upload avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user) return

    setIsUploading(true)

    try {
      // Update profile to remove avatar URL
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        toast.error(`Gagal menghapus avatar: ${profileError.message}`)
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

  const handleGenerateGravatar = () => {
    if (!user?.email) return
    const gravatarUrl = generateGravatarUrl(user.email)
    setAvatarUrl(gravatarUrl)
  }

  const handleGenerateInitials = () => {
    if (!profile?.full_name) return
    const initialsUrl = generateInitialsAvatar(profile.full_name)
    setAvatarUrl(initialsUrl)
  }

  const handleGenerateRandom = () => {
    if (!user?.email) return
    const randomUrl = generateRandomAvatar(user.email)
    setAvatarUrl(randomUrl)
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

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return false
    }

    // Validate file size (max 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB')
      return false
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
    return true
  }

  const resetForm = () => {
    setAvatarUrl(profile?.avatar_url || '')
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
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ubah Avatar Profile
          </DialogTitle>
          <DialogDescription>
            Gunakan URL gambar atau upload file langsung (tanpa storage eksternal).
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {/* Current Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={previewUrl || avatarUrl || profile?.avatar_url || ''} 
                alt={profile?.full_name || ''} 
              />
              <AvatarFallback className="bg-primary text-white text-lg">
                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            
            <p className="text-xs text-slate-600 dark:text-gray-400 text-center">
              {previewUrl ? 'Preview gambar baru' : 'Avatar saat ini'}
            </p>
          </div>

          {/* Method Selection */}
          <div className="flex gap-2">
            <Button
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('url')}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              URL Gambar
            </Button>
            <Button
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('file')}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          {/* URL Method */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="avatar-url" className="text-sm">URL Gambar</Label>
              <Input
                id="avatar-url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="text-sm"
              />
              
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateGravatar}
                  className="text-xs px-2"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Gravatar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateInitials}
                  disabled={!profile?.full_name}
                  className="text-xs px-2"
                >
                  <User className="h-3 w-3 mr-1" />
                  Inisial
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateRandom}
                  className="text-xs px-2"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random
                </Button>
              </div>
              
              <Button 
                onClick={handleUrlSubmit} 
                disabled={isUploading || !avatarUrl.trim()}
                className="w-full"
                size="sm"
              >
                {isUploading ? 'Menyimpan...' : 'Simpan Avatar'}
              </Button>
            </div>
          )}

          {/* File Method */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <Label className="text-sm">Pilih File Gambar</Label>
              
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-300 dark:border-gray-600 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    {/* File Preview */}
                    {previewUrl && (
                      <div className="flex justify-center">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                        />
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Camera className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-800 dark:text-green-300">
                          File Terpilih
                        </span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400 text-center">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="w-full text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Ganti File Lain
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 mx-auto text-slate-400 dark:text-gray-500" />
                    <p className="text-xs text-slate-600 dark:text-gray-400">
                      Drag & drop gambar di sini atau
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Pilih File
                    </Button>
                  </div>
                )}
              </div>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <p className="text-xs text-slate-500 dark:text-gray-500">
                Format: JPG, PNG, GIF, WebP. Maksimal 2MB.
              </p>
              
              {selectedFile && (
                <Button 
                  onClick={handleFileUpload} 
                  disabled={isUploading}
                  className="w-full"
                  size="sm"
                >
                  <Upload className="h-3 w-3 mr-2" />
                  {isUploading ? 'Mengupload...' : 'Upload Avatar'}
                </Button>
              )}
            </div>
          )}

          {/* Remove Avatar */}
          {profile?.avatar_url && (
            <Button 
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Hapus Avatar
            </Button>
          )}

          {/* Tips - Compact */}
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 text-xs mb-1">
              Tips Avatar:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-0.5">
              <li>• URL: Link gambar dari internet</li>
              <li>• File: Upload langsung (max 2MB)</li>
              <li>• Generator: Gravatar/Inisial/Random</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}