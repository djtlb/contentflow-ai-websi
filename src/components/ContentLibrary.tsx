import React, { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FileText, 
  Video, 
  MagnifyingGlass, 
  Calendar, 
  Funnel, 
  Download, 
  Share, 
  Star, 
  Trash, 
  Copy,
  SortAscending,
  SortDescending,
  Eye,
  Archive,
  FolderPlus,
  Folder,
  Export,
  CheckSquare,
  Square,
  Tag,
  ChartBar,
  Brain,
  Lightning
} from "@phosphor-icons/react"
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

// Types for content items
interface ContentItem {
  id: string
  title: string
  content: string
  type: 'article' | 'video-script' | 'marketing-copy' | 'blog-post' | 'social-media'
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  wordCount: number
  status: 'draft' | 'published' | 'archived'
  metadata?: {
    campaign?: string
    target_audience?: string
    seo_keywords?: string[]
    performance_notes?: string
  }
}

interface ContentFolder {
  id: string
  name: string
  description: string
  createdAt: string
  color: string
  itemCount: number
}

export function ContentLibrary() {
  // State management with persistence
  const [contentItems, setContentItems] = useKV<ContentItem[]>("content-library", [])
  const [videoScripts, setVideoScripts] = useKV<any[]>("video-scripts", [])
  const [folders, setFolders] = useKV<ContentFolder[]>("content-folders", [])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "title" | "type" | "favorites">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Combine content items and video scripts
  const allContent = useMemo(() => {
    const content = contentItems || []
    const scripts = (videoScripts || []).map((script: any) => ({
      id: script.id,
      title: script.title || script.topic,
      content: script.script || JSON.stringify(script.scenes, null, 2),
      type: 'video-script' as const,
      category: script.campaignType || 'Video Scripts',
      tags: [script.tone, script.audience, script.duration + 's'].filter(Boolean),
      createdAt: script.createdAt,
      updatedAt: script.createdAt,
      isFavorite: script.isFavorite || false,
      wordCount: script.script ? script.script.split(' ').length : 100,
      status: 'draft' as const,
      metadata: {
        campaign: script.campaignType,
        target_audience: script.audience,
        performance_notes: `${script.duration}s video for ${script.audience}`
      }
    }))
    
    return [...content, ...scripts]
  }, [contentItems, videoScripts])

  // Sample data initialization
  useEffect(() => {
    if (!allContent || allContent.length === 0) {
      const sampleContent: ContentItem[] = [
        {
          id: "1",
          title: "Sustainable Technology Trends 2024",
          content: "# Sustainable Technology Trends Shaping 2024\n\nThe landscape of sustainable technology is evolving rapidly...",
          type: "article",
          category: "Technology",
          tags: ["sustainability", "technology", "2024", "trends"],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          isFavorite: true,
          wordCount: 1250,
          status: "published",
          metadata: {
            seo_keywords: ["sustainable technology", "green tech", "renewable energy"],
            target_audience: "Business professionals"
          }
        },
        {
          id: "2",
          title: "Marketing Video Script: Product Launch",
          content: "# Professional Marketing Video Script\n\n**Scene 1: Hook (3s)**\nAre you ready to transform your workflow?...",
          type: "video-script",
          category: "Marketing",
          tags: ["video", "marketing", "product-launch", "script"],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          isFavorite: false,
          wordCount: 850,
          status: "draft",
          metadata: {
            campaign: "Q4 Product Launch",
            target_audience: "Enterprise customers"
          }
        }
      ]
      setContentItems(sampleContent)
    }

    if (!folders || folders.length === 0) {
      const sampleFolders: ContentFolder[] = [
        {
          id: "1",
          name: "Marketing Campaigns",
          description: "All marketing-related content and scripts",
          createdAt: new Date().toISOString(),
          color: "bg-blue-500",
          itemCount: 5
        },
        {
          id: "2", 
          name: "Blog Posts",
          description: "Published and draft blog articles",
          createdAt: new Date().toISOString(),
          color: "bg-green-500",
          itemCount: 8
        }
      ]
      setFolders(sampleFolders)
    }
  }, [allContent, setContentItems, setFolders])

  // Filtered and sorted content
  const filteredContent = useMemo(() => {
    if (!allContent) return []
    
    let filtered = allContent.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesFavorites = !showFavorites || item.isFavorite
      
      return matchesSearch && matchesCategory && matchesType && matchesFavorites
    })

    // Sort content
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "favorites":
          comparison = (a.isFavorite ? 1 : 0) - (b.isFavorite ? 1 : 0)
          break
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [allContent, searchQuery, selectedCategory, selectedType, showFavorites, sortBy, sortOrder])

  // Get unique categories and types
  const categories = useMemo(() => {
    if (!allContent) return []
    const cats = Array.from(new Set(allContent.map(item => item.category)))
    return cats.sort()
  }, [allContent])

  const types = useMemo(() => {
    const typeOptions = [
      { value: "article", label: "Articles" },
      { value: "video-script", label: "Video Scripts" },
      { value: "marketing-copy", label: "Marketing Copy" },
      { value: "blog-post", label: "Blog Posts" },
      { value: "social-media", label: "Social Media" }
    ]
    return typeOptions
  }, [])

  // Content actions
  const toggleFavorite = (itemId: string) => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.map(item => 
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    })
    
    // Also update video scripts if it's a video script
    setVideoScripts(currentScripts => {
      if (!currentScripts) return []
      return currentScripts.map(script => 
        script.id === itemId ? { ...script, isFavorite: !script.isFavorite } : script
      )
    })
    
    toast.success("Updated favorites")
  }

  const deleteContent = (itemId: string) => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.filter(item => item.id !== itemId)
    })
    
    // Also delete from video scripts if it's a video script
    setVideoScripts(currentScripts => {
      if (!currentScripts) return []
      return currentScripts.filter(script => script.id !== itemId)
    })
    
    toast.success("Content deleted")
  }

  const duplicateContent = (item: ContentItem) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft"
    }
    setContentItems(currentItems => {
      if (!currentItems) return [newItem]
      return [newItem, ...currentItems]
    })
    toast.success("Content duplicated")
  }

  const archiveContent = (itemId: string) => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.map(item => 
        item.id === itemId ? { ...item, status: item.status === 'archived' ? 'draft' : 'archived' } : item
      )
    })
    toast.success("Content archived")
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Content copied to clipboard")
  }

  const viewContent = (item: ContentItem) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }

  // Bulk actions
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map(item => item.id))
    }
  }

  const bulkDelete = () => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.filter(item => !selectedItems.includes(item.id))
    })
    setVideoScripts(currentScripts => {
      if (!currentScripts) return []
      return currentScripts.filter(script => !selectedItems.includes(script.id))
    })
    setSelectedItems([])
    toast.success(`Deleted ${selectedItems.length} items`)
  }

  const bulkArchive = () => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.map(item => 
        selectedItems.includes(item.id) 
          ? { ...item, status: item.status === 'archived' ? 'draft' : 'archived' as const }
          : item
      )
    })
    setSelectedItems([])
    toast.success(`Archived ${selectedItems.length} items`)
  }

  const bulkFavorite = () => {
    setContentItems(currentItems => {
      if (!currentItems) return []
      return currentItems.map(item => 
        selectedItems.includes(item.id) ? { ...item, isFavorite: true } : item
      )
    })
    setVideoScripts(currentScripts => {
      if (!currentScripts) return []
      return currentScripts.map(script => 
        selectedItems.includes(script.id) ? { ...script, isFavorite: true } : script
      )
    })
    setSelectedItems([])
    toast.success(`Added ${selectedItems.length} items to favorites`)
  }

  const exportContent = (format: 'json' | 'csv' | 'txt') => {
    const itemsToExport = selectedItems.length > 0 
      ? filteredContent.filter(item => selectedItems.includes(item.id))
      : filteredContent

    let content = ''
    let filename = ''
    let mimeType = ''

    switch (format) {
      case 'json':
        content = JSON.stringify(itemsToExport, null, 2)
        filename = 'content-library.json'
        mimeType = 'application/json'
        break
      case 'csv':
        const headers = 'Title,Type,Category,Status,Word Count,Created,Tags,Content Preview\n'
        const rows = itemsToExport.map(item => 
          `"${item.title}","${item.type}","${item.category}","${item.status}","${item.wordCount}","${item.createdAt}","${item.tags.join('; ')}","${item.content.slice(0, 100).replace(/"/g, '""')}..."`
        ).join('\n')
        content = headers + rows
        filename = 'content-library.csv'
        mimeType = 'text/csv'
        break
      case 'txt':
        content = itemsToExport.map(item => 
          `Title: ${item.title}\nType: ${item.type}\nCategory: ${item.category}\nCreated: ${item.createdAt}\n\nContent:\n${item.content}\n\n${'='.repeat(80)}\n\n`
        ).join('')
        filename = 'content-library.txt'
        mimeType = 'text/plain'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success(`Exported ${itemsToExport.length} items as ${format.toUpperCase()}`)
  }

  // Stats calculations
  const stats = useMemo(() => {
    if (!allContent) return { total: 0, byType: {}, byStatus: {}, totalWords: 0, avgWords: 0 }
    
    const byType = allContent.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byStatus = allContent.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const totalWords = allContent.reduce((sum, item) => sum + item.wordCount, 0)
    
    return {
      total: allContent.length,
      byType,
      byStatus,
      totalWords,
      avgWords: Math.round(totalWords / allContent.length) || 0,
      favorites: allContent.filter(item => item.isFavorite).length
    }
  }, [allContent])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800' 
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video-script': return <Video size={16} />
      case 'article':
      case 'blog-post':
      case 'marketing-copy':
      case 'social-media':
      default:
        return <FileText size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            Manage and organize all your AI-generated content
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-sm">
            {filteredContent.length} of {allContent?.length || 0} items
          </Badge>
          <Button onClick={() => setShowStats(!showStats)} variant="outline" size="sm">
            <ChartBar size={16} className="mr-2" />
            Stats
          </Button>
          <Button onClick={() => setShowFavorites(!showFavorites)} variant={showFavorites ? "default" : "outline"} size="sm">
            <Star size={16} className="mr-2" />
            Favorites
          </Button>
          {selectedItems.length > 0 && (
            <Button onClick={() => setShowBulkActions(!showBulkActions)} variant="outline" size="sm">
              <CheckSquare size={16} className="mr-2" />
              Bulk ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar size={20} />
              Library Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.favorites}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalWords.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.avgWords}</div>
                <div className="text-sm text-muted-foreground">Avg Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{(stats.byStatus as any)?.published || 0}</div>
                <div className="text-sm text-muted-foreground">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{(stats.byStatus as any)?.draft || 0}</div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Content Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type.replace('-', ' ')}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedItems.length > 0 && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckSquare size={20} />
                Bulk Actions ({selectedItems.length} selected)
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={bulkFavorite}>
                <Star size={16} className="mr-2" />
                Add to Favorites
              </Button>
              <Button variant="outline" size="sm" onClick={bulkArchive}>
                <Archive size={16} className="mr-2" />
                Archive/Unarchive
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportContent('json')}>
                <Export size={16} className="mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportContent('csv')}>
                <Export size={16} className="mr-2" />
                Export CSV
              </Button>
              <Button variant="destructive" size="sm" onClick={bulkDelete}>
                <Trash size={16} className="mr-2" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Funnel size={20} />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAscending size={16} /> : <SortDescending size={16} />}
              </Button>
            </div>
          </div>
          
          {/* Bulk selection controls */}
          {filteredContent.length > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                  onCheckedChange={selectAllItems}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select all ({filteredContent.length})
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportContent('json')}>
                  <Export size={14} className="mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportContent('csv')}>
                  <Export size={14} className="mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  {getTypeIcon(item.type)}
                  <Badge variant="outline" className="text-xs">
                    {item.type.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {item.isFavorite ? (
                      <Star size={16} className="text-yellow-500 fill-current" />
                    ) : (
                      <Star size={16} />
                    )}
                  </Button>
                </div>
              </div>
              
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>{item.category}</span>
                <Badge className={getStatusColor(item.status)} variant="secondary">
                  {item.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground line-clamp-3">
                {item.content.slice(0, 150)}...
              </div>
              
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.tags.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(item.createdAt)}
                </div>
                <span>{item.wordCount} words</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewContent(item)}
                  className="flex-1"
                >
                  <Eye size={14} className="mr-2" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.content)}
                >
                  <Copy size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateContent(item)}
                >
                  <Share size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => archiveContent(item.id)}
                >
                  <Archive size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteContent(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" || selectedType !== "all" 
                ? "Try adjusting your filters or search terms"
                : "Start creating content to see it here"}
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedType !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedType("all")
                  setShowFavorites(false)
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Content Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {selectedItem && getTypeIcon(selectedItem.type)}
                {selectedItem?.title}
              </span>
              <div className="flex items-center gap-2">
                <Badge className={selectedItem ? getStatusColor(selectedItem.status) : ""} variant="secondary">
                  {selectedItem?.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectedItem && toggleFavorite(selectedItem.id)}
                >
                  {selectedItem?.isFavorite ? (
                    <Star size={16} className="text-yellow-500 fill-current" />
                  ) : (
                    <Star size={16} />
                  )}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span>{selectedItem.category}</span>
                  <span>•</span>
                  <span>{selectedItem.wordCount} words</span>
                  <span>•</span>
                  <span>Created {formatDate(selectedItem.createdAt)}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Metadata */}
              {selectedItem.metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedItem.metadata.campaign && (
                      <div><strong>Campaign:</strong> {selectedItem.metadata.campaign}</div>
                    )}
                    {selectedItem.metadata.target_audience && (
                      <div><strong>Target Audience:</strong> {selectedItem.metadata.target_audience}</div>
                    )}
                    {selectedItem.metadata.seo_keywords && (
                      <div>
                        <strong>SEO Keywords:</strong> {selectedItem.metadata.seo_keywords.join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Content */}
              <div className="bg-background border rounded-lg p-6 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {selectedItem.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-xl font-bold mb-4">{line.slice(2)}</h1>
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-lg font-semibold mb-3 mt-6">{line.slice(3)}</h2>
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-base font-medium mb-2 mt-4">{line.slice(4)}</h3>
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-semibold mb-2">{line.slice(2, -2)}</p>
                    } else if (line.trim()) {
                      return <p key={index} className="mb-2 text-muted-foreground">{line}</p>
                    } else {
                      return <br key={index} />
                    }
                  })}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button onClick={() => copyToClipboard(selectedItem.content)}>
                  <Copy size={16} className="mr-2" />
                  Copy Content
                </Button>
                <Button variant="outline" onClick={() => duplicateContent(selectedItem)}>
                  <Share size={16} className="mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" onClick={() => archiveContent(selectedItem.id)}>
                  <Archive size={16} className="mr-2" />
                  {selectedItem.status === 'archived' ? 'Unarchive' : 'Archive'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteContent(selectedItem.id)
                    setViewDialogOpen(false)
                  }}
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}