import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'planned':
      return 'bg-gray-500/20 text-gray-300'
    case 'in-progress':
      return 'bg-yellow-500/20 text-yellow-300'
    case 'done':
      return 'bg-green-500/20 text-green-300'
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-300'
    case 'released':
      return 'bg-purple-500/20 text-purple-300'
    default:
      return 'bg-gray-500/20 text-gray-300'
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case 'planned':
      return 'Direncanakan'
    case 'in-progress':
      return 'Sedang Dikerjakan'
    case 'done':
      return 'Selesai'
    case 'upcoming':
      return 'Akan Datang'
    case 'released':
      return 'Dirilis'
    default:
      return status
  }
}