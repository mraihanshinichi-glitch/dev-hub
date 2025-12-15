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
import { Feature } from '@/lib/types/database'
import { createClient } from '@/lib/supabase/client'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { MoreVertical, Edit, Trash2, Calendar, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { EditFeatureDialog } from './edit-feature-dialog'
import { DeleteFeatureDialog } from './delete-feature-dialog'

interface FeatureCardProps {
  feature: Feature
  onUpdate: (feature: Feature) => void
  onDelete: (featureId: string) => void
}

export function FeatureCard({ feature, onUpdate, onDelete }: FeatureCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'planned':
        return 'in-progress'
      case 'in-progress':
        return 'done'
      case 'done':
        return 'planned'
      default:
        return 'planned'
    }
  }

  const getPrevStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'planned':
        return 'done'
      case 'in-progress':
        return 'planned'
      case 'done':
        return 'in-progress'
      default:
        return 'planned'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    
    try {
      const { data, error } = await supabase
        .from('features')
        .update({ status: newStatus })
        .eq('id', feature.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengupdate status')
        console.error(error)
      } else {
        onUpdate(data)
        toast.success(`Status diubah ke ${getStatusLabel(newStatus)}`)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate status')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const isOverdue = feature.due_date && new Date(feature.due_date) < new Date() && feature.status !== 'done'

  return (
    <>
      <Card className="feature-card app-card hover:border-primary/30 transition-colors group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-app-text-primary truncate mb-1">
                {feature.title}
              </h4>
              {feature.description && (
                <p className="text-sm text-app-text-secondary line-clamp-2">
                  {feature.description}
                </p>
              )}
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
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(feature.status)}>
                {getStatusLabel(feature.status)}
              </Badge>
              
              {feature.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-400' : 'text-app-text-muted'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(feature.due_date)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {feature.status !== 'planned' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleStatusChange(getPrevStatus(feature.status))}
                  disabled={isUpdating}
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              )}
              
              {feature.status !== 'done' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleStatusChange(getNextStatus(feature.status))}
                  disabled={isUpdating}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditFeatureDialog
        feature={feature}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <DeleteFeatureDialog
        feature={feature}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => onDelete(feature.id)}
      />
    </>
  )
}