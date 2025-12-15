'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { createClient } from '@/lib/supabase/client'
import { useSettingsStore } from '@/lib/store/settings-store'
import { Note } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Save, FileText, Clock, Edit2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface NoteEditorProps {
  note: Note
  onUpdate: (note: Note) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const { autoSaveEnabled, autoSaveInterval } = useSettingsStore()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(note.title)
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Mulai menulis note Anda...\n\nAnda bisa menggunakan:\n• Heading dengan # ## ###\n• **Bold** dan *italic*\n• Bullet points\n• > Blockquotes\n• `Code` dan code blocks\n\nNote akan tersimpan otomatis.',
      }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  })

  useEffect(() => {
    if (editor && note.content) {
      editor.commands.setContent(note.content)
      setHasUnsavedChanges(false)
    }
    setTitle(note.title)
    setIsEditingTitle(false)
  }, [note, editor])

  useEffect(() => {
    // Auto-save based on user settings
    if (autoSaveEnabled && hasUnsavedChanges && editor && !isSaving) {
      const timer = setTimeout(() => {
        handleSave()
      }, autoSaveInterval * 1000)

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, editor, isSaving, autoSaveEnabled, autoSaveInterval])

  const handleSave = async () => {
    if (!editor || isSaving) return

    setIsSaving(true)
    const content = editor.getJSON()

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          content,
          title: title.trim() || 'Untitled Note',
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal menyimpan note')
        console.error('Error saving note:', error)
      } else {
        setHasUnsavedChanges(false)
        onUpdate(data)
        toast.success('Note berhasil disimpan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan note')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleSave = async () => {
    if (title.trim() === note.title) {
      setIsEditingTitle(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          title: title.trim() || 'Untitled Note',
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengubah judul')
        setTitle(note.title) // Reset to original title
      } else {
        onUpdate(data)
        toast.success('Judul berhasil diubah')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah judul')
      setTitle(note.title) // Reset to original title
    } finally {
      setIsEditingTitle(false)
    }
  }

  const handleManualSave = () => {
    if (hasUnsavedChanges) {
      handleSave()
    }
  }

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave()
                  } else if (e.key === 'Escape') {
                    setTitle(note.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-xl font-semibold"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-app-text-primary">
                  {note.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-app-text-muted">
              <Clock className="h-3 w-3" />
              <span>Terakhir diupdate {formatDateTime(note.updated_at)}</span>
            </div>
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
      <Card className="app-card flex-1">
        <CardContent className="p-0 h-full">
          <div className="min-h-[500px] h-full">
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
                <li>• Klik judul untuk mengedit nama note</li>
                <li>• Gunakan heading untuk mengorganisir konten</li>
                <li>• Note tersimpan otomatis setiap {autoSaveInterval} detik {!autoSaveEnabled && '(dinonaktifkan)'}</li>
                <li>• Gunakan format Markdown untuk styling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}