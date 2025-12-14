import { createClient } from '@/lib/supabase/client'

export interface AvatarUploadResult {
  success: boolean
  avatarUrl?: string
  error?: string
}

export async function uploadAvatar(file: File, userId: string): Promise<AvatarUploadResult> {
  const supabase = createClient()

  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File harus berupa gambar' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Ukuran file maksimal 5MB' }
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // Delete old avatar if exists
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list(userId)

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(file => `${userId}/${file.name}`)
      await supabase.storage
        .from('avatars')
        .remove(filesToDelete)
    }

    // Upload new file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return { success: true, avatarUrl: urlData.publicUrl }

  } catch (error) {
    console.error('Avatar upload error:', error)
    return { success: false, error: 'Terjadi kesalahan saat upload' }
  }
}

export async function deleteAvatar(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    // List all files for user
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId)

    if (listError) {
      return { success: false, error: listError.message }
    }

    if (files && files.length > 0) {
      // Delete all user's avatar files
      const filesToDelete = files.map(file => `${userId}/${file.name}`)
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete)

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Avatar delete error:', error)
    return { success: false, error: 'Terjadi kesalahan saat menghapus avatar' }
  }
}

export function getAvatarUrl(userId: string, filename: string): string {
  const supabase = createClient()
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/${filename}`)
  
  return data.publicUrl
}

export function generateAvatarPlaceholder(name: string): string {
  // Generate a simple avatar placeholder URL using DiceBear API
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=a78bfa&textColor=ffffff`
}