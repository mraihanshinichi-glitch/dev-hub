'use client'

import { useState } from 'react'
import { ProjectTemplate, PROJECT_TEMPLATES } from '@/lib/types/templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TemplatePreview } from './template-preview'
import { ArrowLeft, Sparkles, FileText, Zap } from 'lucide-react'

interface TemplateSelectionProps {
  onSelectTemplate: (template: ProjectTemplate | null) => void
  onBack: () => void
}

export function TemplateSelection({ onSelectTemplate, onBack }: TemplateSelectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)

  const handleSelectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
  }

  const handleUseTemplate = () => {
    onSelectTemplate(selectedTemplate)
  }

  const handleCustomProject = () => {
    onSelectTemplate(null)
  }

  if (selectedTemplate) {
    return (
      <div className="flex flex-col h-full max-h-[60vh]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTemplate(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-app-text-primary">
              {selectedTemplate.icon} {selectedTemplate.name}
            </h3>
            <p className="text-sm text-app-text-secondary">
              {selectedTemplate.description}
            </p>
          </div>
        </div>

        {/* Template Details */}
        <ScrollArea className="flex-1 mb-4">
          <div className="pr-4">
            <TemplatePreview template={selectedTemplate} />
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 flex-shrink-0">
          <Button onClick={handleUseTemplate} className="flex-1">
            <Sparkles className="h-4 w-4 mr-2" />
            Gunakan Template Ini
          </Button>
          <Button variant="outline" onClick={handleCustomProject}>
            Project Custom
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h3 className="text-lg font-semibold text-app-text-primary">
            Pilih Template Project
          </h3>
          <p className="text-sm text-app-text-secondary">
            Mulai dengan template atau buat project custom
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {/* Custom Project Option */}
          <Card className="app-card border-primary/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">🎨 Project Custom</h4>
                  <p className="text-sm text-app-text-secondary">
                    Mulai dari kosong dan buat project sesuai kebutuhan Anda
                  </p>
                </div>
                <Button onClick={handleCustomProject}>
                  Pilih
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template Grid */}
          <div className="space-y-4">
            <h4 className="font-medium text-app-text-primary">Template Tersedia</h4>
            <div className="grid gap-3">
              {PROJECT_TEMPLATES.map((template) => (
                <Card 
                  key={template.id} 
                  className="app-card cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-app-text-primary">
                            {template.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-app-text-secondary mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-app-text-muted">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {template.notes.length} notes
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {template.features.length} features
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}