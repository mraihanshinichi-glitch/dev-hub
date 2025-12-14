'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { createClient } from '@/lib/supabase/client'
import { useSettingsStore } from '@/lib/store/settings-store'
import { Project, Note } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Save, FileText, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface NotesTabProps {
  project: Project
}

export function NotesTab({ project }: NotesTabProps) {
  const { autoSaveEnabled, autoSaveInterval } = useSettingsStore()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Mulai menulis notes untuk project ini...\n\nAnda bisa menggunakan:\n• Heading dengan # ## ###\n• **Bold** dan *italic*\n• Bullet points\n• > Blockquotes\n• `Code` dan code blocks\n\nNotes akan tersimpan otomatis.',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      console.log('Editor content changed')
      setHasUnsavedChanges(true)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
      },
    },
  })

  useEffect(() => {
    if (editor) {
      loadNote()
    }
  }, [project.id, editor])

  useEffect(() => {
    // Auto-save based on user settings
    if (autoSaveEnabled && hasUnsavedChanges && editor && !isSaving) {
      console.log(`Setting up auto-save timer for ${autoSaveInterval} seconds...`)
      const timer = setTimeout(() => {
        console.log('Auto-save triggered')
        handleSave()
      }, autoSaveInterval * 1000)

      return () => {
        console.log('Clearing auto-save timer')
        clearTimeout(timer)
      }
    }
  }, [hasUnsavedChanges, editor, isSaving, autoSaveEnabled, autoSaveInterval])

  const loadNote = async () => {
    console.log('Loading note for project:', project.id)
    setIsLoading(true)
    
    // First, test if we can access the project
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name, user_id')
        .eq('id', project.id)
        .single()

      console.log('Project access test:', { projectData, projectError })

      if (projectError) {
        console.error('Cannot access project:', projectError)
        toast.error('Tidak dapat mengakses project')
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.error('Project access error:', error)
      toast.error('Error mengakses project')
      setIsLoading(false)
      return
    }

    // Now try to load the note
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('project_id', project.id)
        .single()

      console.log('Note query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading note:', error)
        toast.error(`Gagal memuat notes: ${error.message}`)
        setSaveError(error.message)
      } else if (data) {
        console.log('Note loaded successfully:', data)
        setNote(data)
        if (editor && data.content) {
          console.log('Setting editor content:', data.content)
          editor.commands.setContent(data.content)
        }
      } else {
        console.log('No existing note found, will create new one on first save')
      }
    } catch (error) {
      console.error('Error loading note:', error)
      toast.error('Terjadi kesalahan saat memuat notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editor || isSaving) {
      console.log('Save blocked:', { editor: !!editor, isSaving })
      return
    }

    console.log('Starting save process...')
    setIsSaving(true)
    const content = editor.getJSON()
    console.log('Editor content to save:', content)

    try {
      if (note) {
        console.log('Updating existing note:', note.id)
        // Update existing note
        const { data, error } = await supabase
          .from('notes')
          .update({ content })
          .eq('id', note.id)
          .select()
          .single()

        console.log('Update result:', { data, error })

        if (error) {
          const errorMsg = `Gagal menyimpan notes: ${error.message}`
          toast.error(errorMsg)
          setSaveError(errorMsg)
          console.error('Update error:', error)
        } else {
          console.log('Note updated successfully')
          setNote(data)
          setHasUnsavedChanges(false)
          setSaveError(null)
          toast.success('Notes berhasil disimpan')
        }
      } else {
        console.log('Creating new note for project:', project.id)
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            project_id: project.id,
            content,
          })
          .select()
          .single()

        console.log('Insert result:', { data, error })

        if (error) {
          const errorMsg = `Gagal menyimpan notes: ${error.message}`
          toast.error(errorMsg)
          setSaveError(errorMsg)
          console.error('Insert error:', error)
        } else {
          console.log('Note created successfully')
          setNote(data)
          setHasUnsavedChanges(false)
          setSaveError(null)
          toast.success('Notes berhasil disimpan')
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan notes')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = () => {
    if (hasUnsavedChanges) {
      handleSave()
    }
  }

  if (isLoading) {
    return (
      <Card className="app-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-app-text-primary">Project Notes</h2>
            <p className="text-sm text-app-text-secondary">
              Dokumentasi dan catatan untuk project ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!autoSaveEnabled && (
            <Badge variant="outline" className="text-xs">
              Auto-save dinonaktifkan
            </Badge>
          )}

          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs">
              {autoSaveEnabled ? `Auto-save dalam ${autoSaveInterval}s` : 'Belum tersimpan'}
            </Badge>
          )}

          {saveError && (
            <Badge variant="destructive" className="text-xs">
              Error: {saveError}
            </Badge>
          )}
          
          {note && (
            <div className="flex items-center gap-1 text-xs text-app-text-muted">
              <Clock className="h-3 w-3" />
              <span>Terakhir diupdate {formatDateTime(note.updated_at)}</span>
            </div>
          )}

          <Button
            onClick={handleManualSave}
            disabled={!hasUnsavedChanges || isSaving}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>


        </div>
      </div>

      {/* Editor */}
      <Card className="app-card">
        <CardContent className="p-0">
          <div className="min-h-[500px]">
            <EditorContent 
              editor={editor} 
              className="w-full h-full"
            />
          </div>
        </CardContent>
      </Card>



      {/* Tips */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-1">Tips Menulis Notes</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Gunakan heading untuk mengorganisir konten</li>
                <li>• Notes tersimpan otomatis setiap {autoSaveInterval} detik {!autoSaveEnabled && '(dinonaktifkan)'}</li>
                <li>• Gunakan format Markdown untuk styling</li>
                <li>• Notes ini berguna untuk dokumentasi project</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}