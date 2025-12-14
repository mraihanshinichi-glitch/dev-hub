import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
      sizeClasses[size],
      className
    )} />
  )
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="text-gray-400 mt-4">{message}</p>
      <p className="text-gray-600 text-sm mt-2">Jika loading terlalu lama, coba refresh halaman</p>
    </div>
  )
}