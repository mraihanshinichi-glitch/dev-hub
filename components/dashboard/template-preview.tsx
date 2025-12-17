'use client'

import { ProjectTemplate } from '@/lib/types/templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Zap, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface TemplatePreviewProps {
  template: ProjectTemplate
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <AlertCircle className="h-3 w-3 text-gray-400" />
      case 'in-progress':
        return <Clock className="h-3 w-3 text-yellow-400" />
      case 'done':
        return <CheckCircle className="h-3 w-3 text-green-400" />
      default:
        return <AlertCircle className="h-3 w-3 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Direncanakan'
      case 'in-progress':
        return 'Dikerjakan'
      case 'done':
        return 'Selesai'
      default:
        return 'Direncanakan'
    }
  }

  return (
    <div className="space-y-4">
      {/* Template Info */}
      <div className="text-center space-y-2">
        <div className="text-4xl">{template.icon}</div>
        <h3 className="text-xl font-semibold text-app-text-primary">
          {template.name}
        </h3>
        <p className="text-app-text-secondary">
          {template.description}
        </p>
        <Badge variant="secondary">{template.category}</Badge>
      </div>

      {/* Content Preview */}
      <div className="grid gap-4">
        {/* Notes */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes Panduan ({template.notes.length})
            </CardTitle>
            <CardDescription>
              Notes yang akan dibuat untuk memandu development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {template.notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border border-gray-800">
                    <FileText className="h-4 w-4 text-app-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-app-text-primary text-sm">
                          {note.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {note.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="app-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Features ({template.features.length})
            </CardTitle>
            <CardDescription>
              Features yang akan dibuat sebagai roadmap development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border border-gray-800">
                    <div className="flex items-center gap-1 mt-0.5">
                      {getStatusIcon(feature.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-app-text-primary text-sm">
                          {feature.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                      {feature.description && (
                        <p className="text-xs text-app-text-secondary">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Releases */}
        {template.releases && template.releases.length > 0 && (
          <Card className="app-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Releases ({template.releases.length})
              </CardTitle>
              <CardDescription>
                Release plan yang akan dibuat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {template.releases.map((release, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border border-gray-800">
                    <Package className="h-4 w-4 text-app-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-app-text-primary text-sm">
                          v{release.version}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {release.category}
                        </Badge>
                      </div>
                      {release.notes && (
                        <p className="text-xs text-app-text-secondary">
                          {release.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-sm text-blue-200">
          <strong>Template ini akan membuat:</strong>
        </p>
        <ul className="text-sm text-blue-200 mt-1 space-y-1">
          <li>• {template.notes.length} notes panduan development</li>
          <li>• {template.features.length} features sebagai roadmap</li>
          {template.releases && template.releases.length > 0 && (
            <li>• {template.releases.length} release plan</li>
          )}
        </ul>
      </div>
    </div>
  )
}