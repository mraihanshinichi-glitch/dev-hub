import { createHash } from 'crypto'

export function generateGravatarUrl(email: string, size: number = 200): string {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim()
  
  // Create MD5 hash (for browser compatibility, we'll use a simple hash)
  const hash = btoa(normalizedEmail).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 32)
  
  // Generate Gravatar URL with fallback to identicon
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`
}

export function generateInitialsAvatar(name: string, size: number = 200): string {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  // Use DiceBear API for consistent avatar generation
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=a78bfa&textColor=ffffff&size=${size}`
}

export function generateRandomAvatar(seed: string, size: number = 200): string {
  // Use DiceBear API with different styles
  const styles = ['avataaars', 'bottts', 'identicon', 'jdenticon', 'personas']
  const style = styles[Math.abs(hashCode(seed)) % styles.length]
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const pathname = urlObj.pathname.toLowerCase()
    
    // Check if URL has valid image extension or is from known image services
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext))
    const isImageService = [
      'gravatar.com',
      'dicebear.com',
      'imgur.com',
      'cloudinary.com',
      'unsplash.com',
      'picsum.photos'
    ].some(service => urlObj.hostname.includes(service))
    
    return hasValidExtension || isImageService
  } catch {
    return false
  }
}