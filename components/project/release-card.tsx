'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Release } from '@/lib/types/database'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { MoreVertical, Edit, Trash2, Calendar, Package, ArrowRight, ArrowLeft, CheckCircle, Clock, FileText } from 'lucide-react'
import { EditReleaseDialog } from './edit-release-dialog'
import { DeleteReleaseDialog } from './delete-release-dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useReleaseShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'

interface ReleaseCardProps {
  release: Release
  isLast: boolean
  onUpdate: (release: Release) => void
  onDelete: (releaseId: string) => void
}

export function ReleaseCard({ release, isLast, onUpdate, onDelete }: ReleaseCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const supabase = createClient()

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'planned':
        return 'upcoming'
      case 'upcoming':
        return 'released'
      case 'released':
        return 'planned'
      default:
        return 'planned'
    }
  }

  const getPrevStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'planned':
        return 'released'
      case 'upcoming':
        return 'planned'
      case 'released':
        return 'upcoming'
      default:
        return 'planned'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    
    try {
      const updateData: any = {
        status: newStatus,
      }

      // If status changed to released and wasn't released before, set released_at
      if (newStatus === 'released' && release.status !== 'released') {
        updateData.released_at = new Date().toISOString()
      }
      // If status changed from released to something else, clear released_at
      else if (newStatus !== 'released' && release.status === 'released') {
        updateData.released_at = null
      }

      const { data, error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', release.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengubah status release')
        console.error(error)
      } else {
        onUpdate(data)
        toast.success(`Status diubah ke ${getStatusLabel(newStatus)}`)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah status')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <FileText className="h-3 w-3" />
      case 'upcoming':
        return <Clock className="h-3 w-3" />
      case 'released':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  // Enable keyboard shortcuts when card is focused (after handleStatusChange is defined)
  useReleaseShortcuts(handleStatusChange, release.status, isFocused)

  return (
    <>
      <div className="flex gap-4">
        {/* Timeline Line */}
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
            isUpdating ? 'animate-pulse bg-primary' :
            release.status === 'released' ? 'bg-green-500' :
            release.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
          }`} />
          {!isLast && <div className="w-px h-16 bg-gray-700 mt-2" />}
        </div>

        {/* Content */}
        <Card 
          className={`release-card flex-1 app-card hover:border-primary/30 transition-all duration-200 group cursor-pointer ${
            isUpdating ? 'opacity-75 scale-[0.99]' : ''
          } ${isFocused ? 'ring-2 ring-primary/50 border-primary/50' : ''}`}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={() => setIsFocused(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-app-text-primary">
                    Version {release.version}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(release.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(release.status)}
                        {getStatusLabel(release.status)}
                      </div>
                    </Badge>
                    
                    {release.category && (
                      <Badge variant="outline" className="text-xs">
                        {release.category}
                      </Badge>
                    )}
                    
                    {/* Quick Status Change Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {release.status !== 'planned' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-700 hover:text-primary transition-colors"
                          onClick={() => handleStatusChange(getPrevStatus(release.status))}
                          disabled={isUpdating}
                          title={`← Ubah ke ${getStatusLabel(getPrevStatus(release.status))}`}
                        >
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-primary" />
                          ) : (
                            <ArrowLeft className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                      
                      {release.status !== 'released' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-700 hover:text-primary transition-colors"
                          onClick={() => handleStatusChange(getNextStatus(release.status))}
                          disabled={isUpdating}
                          title={`Ubah ke ${getStatusLabel(getNextStatus(release.status))} →`}
                        >
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-primary" />
                          ) : (
                            <ArrowRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {release.notes && (
                  <p className="text-sm text-app-text-secondary mb-2">
                    {release.notes}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-app-text-muted">
                    {release.target_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Target: {formatDate(release.target_date)}</span>
                      </div>
                    )}
                    
                    {release.released_at && (
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>Dirilis: {formatDate(release.released_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Keyboard Shortcuts Hint */}
                  {isFocused && (
                    <div className="flex items-center gap-2 text-xs text-app-text-muted">
                      <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">←→</span>
                      <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">1-3</span>
                      <span>untuk ubah status</span>
                    </div>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Quick Status Changes */}
                  {release.status !== 'planned' && (
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('planned')}
                      disabled={isUpdating}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ubah ke Direncanakan
                    </DropdownMenuItem>
                  )}
                  
                  {release.status !== 'upcoming' && (
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('upcoming')}
                      disabled={isUpdating}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Ubah ke Akan Datang
                    </DropdownMenuItem>
                  )}
                  
                  {release.status !== 'released' && (
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('released')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Ubah ke Dirilis
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Detail
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-400 focus:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditReleaseDialog
        release={release}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <DeleteReleaseDialog
        release={release}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => onDelete(release.id)}
      />
    </>
  )
}