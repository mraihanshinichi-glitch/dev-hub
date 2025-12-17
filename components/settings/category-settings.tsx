'use client'

import { useState } from 'react'
import { useSettings } from '@/lib/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Tags, Plus, X, FileText, Zap, Package } from 'lucide-react'

export function CategorySettings() {
  const {
    noteCategories,
    featureCategories,
    releaseCategories,
    addNoteCategory,
    addFeatureCategory,
    addReleaseCategory,
    removeNoteCategory,
    removeFeatureCategory,
    removeReleaseCategory,
  } = useSettings()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addType, setAddType] = useState<'note' | 'feature' | 'release'>('note')
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    const category = newCategory.trim().toLowerCase()
    
    // Check if category already exists
    const existingCategories = addType === 'note' ? noteCategories :
                              addType === 'feature' ? featureCategories :
                              releaseCategories

    if (existingCategories.includes(category)) {
      toast.error('Kategori sudah ada')
      return
    }

    // Add category
    if (addType === 'note') {
      addNoteCategory(category)
    } else if (addType === 'feature') {
      addFeatureCategory(category)
    } else {
      addReleaseCategory(category)
    }

    toast.success(`Kategori "${category}" berhasil ditambahkan`)
    setNewCategory('')
    setShowAddDialog(false)
  }

  const handleRemoveCategory = (type: 'note' | 'feature' | 'release', category: string) => {
    if (type === 'note') {
      removeNoteCategory(category)
    } else if (type === 'feature') {
      removeFeatureCategory(category)
    } else {
      removeReleaseCategory(category)
    }
    toast.success(`Kategori "${category}" berhasil dihapus`)
  }

  const openAddDialog = (type: 'note' | 'feature' | 'release') => {
    setAddType(type)
    setShowAddDialog(true)
  }

  const getCategoryIcon = (type: 'note' | 'feature' | 'release') => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4" />
      case 'feature':
        return <Zap className="h-4 w-4" />
      case 'release':
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryTitle = (type: 'note' | 'feature' | 'release') => {
    switch (type) {
      case 'note':
        return 'Kategori Notes'
      case 'feature':
        return 'Kategori Features'
      case 'release':
        return 'Kategori Releases'
    }
  }

  const CategorySection = ({ 
    type, 
    categories, 
    onRemove 
  }: { 
    type: 'note' | 'feature' | 'release'
    categories: string[]
    onRemove: (category: string) => void 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getCategoryIcon(type)}
          <h4 className="font-medium text-app-text-primary">{getCategoryTitle(type)}</h4>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openAddDialog(type)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {category}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-red-500/20"
              onClick={() => onRemove(category)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-app-text-muted">Belum ada kategori</p>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Card className="app-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-app-text-primary">
            <Tags className="h-5 w-5" />
            Kategori
          </CardTitle>
          <CardDescription>
            Kelola kategori untuk notes, features, dan releases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CategorySection
            type="note"
            categories={noteCategories}
            onRemove={(category) => handleRemoveCategory('note', category)}
          />
          
          <CategorySection
            type="feature"
            categories={featureCategories}
            onRemove={(category) => handleRemoveCategory('feature', category)}
          />
          
          <CategorySection
            type="release"
            categories={releaseCategories}
            onRemove={(category) => handleRemoveCategory('release', category)}
          />
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getCategoryIcon(addType)}
              Tambah {getCategoryTitle(addType)}
            </DialogTitle>
            <DialogDescription>
              Tambahkan kategori baru untuk {addType === 'note' ? 'notes' : addType === 'feature' ? 'features' : 'releases'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Nama Kategori</Label>
              <Input
                id="category"
                placeholder="Masukkan nama kategori..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory()
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false)
                setNewCategory('')
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Tambah Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}