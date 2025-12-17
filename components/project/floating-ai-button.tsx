'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Project } from '@/lib/types/database'
import { useSettings } from '@/lib/hooks/use-settings'
import { AIAssistant } from './ai-assistant'
import { Bot, Sparkles } from 'lucide-react'

interface FloatingAIButtonProps {
  project: Project
}

export function FloatingAIButton({ project }: FloatingAIButtonProps) {
  const { aiAssistantEnabled, showFloatingAIButton } = useSettings()
  const [showDialog, setShowDialog] = useState(false)

  // Don't render if AI assistant is disabled or floating button is hidden
  if (!aiAssistantEnabled || !showFloatingAIButton) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowDialog(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 group"
          size="sm"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <Sparkles className="h-3 w-3 text-white absolute -top-1 -right-1 animate-pulse" />
          </div>
        </Button>
      </div>

      {/* AI Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              AI Assistant - {project.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <AIAssistant project={project} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}