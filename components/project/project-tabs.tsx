'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project } from '@/lib/types/database'
import { NotesTab } from './tabs/notes-tab'
import { FeaturesTab } from './tabs/features-tab'
import { ReleasesTab } from './tabs/releases-tab'
import { FileText, Zap, Rocket } from 'lucide-react'

interface ProjectTabsProps {
  project: Project
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="features" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Features</span>
        </TabsTrigger>
        <TabsTrigger value="releases" className="flex items-center gap-2">
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline">Releases</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="notes" className="space-y-4">
          <NotesTab project={project} />
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <FeaturesTab project={project} />
        </TabsContent>

        <TabsContent value="releases" className="space-y-4">
          <ReleasesTab project={project} />
        </TabsContent>
      </div>
    </Tabs>
  )
}