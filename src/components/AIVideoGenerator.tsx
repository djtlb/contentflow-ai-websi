import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Video, 
  Crown, 
  Play, 
  Download,
  Clock,
  Image as ImageIcon,
  Microphone,
  Gear,
  Sparkle,
  CheckCircle,
  Lock
} from "@phosphor-icons/react"
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/AuthContext'

declare const spark: any

interface VideoProject {
  id: string
  title: string
  script: string
  style: string
  resolution: string
  duration: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  videoUrl?: string
  thumbnailUrl?: string
  createdAt: string
  metadata?: {
    analysis?: any
    visualDirections?: string
    voiceScript?: string
    productionGuide?: string
  }
}

interface VideoScriptForGeneration {
  title: string
  script: string
  scenes: Array<{
    title: string
    dialogue: string
    visuals: string
    duration: string
  }>
}

interface AIVideoGeneratorProps {
  script?: VideoScriptForGeneration
}

export function AIVideoGenerator({ script }: AIVideoGeneratorProps) {
  const { user, isAdmin } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [videoStyle, setVideoStyle] = useState("realistic")
  const [resolution, setResolution] = useState("1080p")
  const [voiceStyle, setVoiceStyle] = useState("professional")
  const [customScript, setCustomScript] = useState("")
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null)
  const [videoProjects, setVideoProjects] = useKV<VideoProject[]>("video-projects", [])
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  // Check if user has premium access - admin emails get full access
  const hasPremiumAccess = isAdmin || !!user // Admin gets full access, others get basic access

  const generateVideo = async () => {
    if (!hasPremiumAccess) {
      setShowUpgradeDialog(true)
      return
    }

    const scriptToUse = script?.script || customScript
    if (!scriptToUse.trim()) {
      toast.error("Please provide a script for video generation")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Create video project
      const newProject: VideoProject = {
        id: Date.now().toString(),
        title: script?.title || "Custom Video",
        script: scriptToUse,
        style: videoStyle,
        resolution,
        duration: "60s", // Default duration
        status: 'processing',
        progress: 0,
        createdAt: new Date().toISOString()
      }

      setCurrentProject(newProject)

      // Step 1: AI Analysis (5%)
      toast.info("Analyzing script with AI", { description: "Understanding content and requirements" })
      setGenerationProgress(5)

      // Use Spark AI to analyze the script and generate video concept
      const analysisPrompt = spark.llmPrompt`Analyze this video script for professional video production:

**Script:** ${scriptToUse}
**Style:** ${videoStyle}
**Resolution:** ${resolution}

Generate a comprehensive video production analysis including:
1. Visual concept and theme
2. Shot list with camera angles
3. Color palette and lighting suggestions
4. Music/audio recommendations
5. Key visual elements needed
6. Estimated production complexity
7. Target audience considerations

Provide practical, production-ready guidance for creating this video.

Format as JSON:
{
  "concept": "Overall visual concept",
  "theme": "Main theme and mood",
  "shotList": ["Shot 1 description", "Shot 2 description"],
  "colorPalette": ["#color1", "#color2", "#color3"],
  "lighting": "Lighting recommendations",
  "audio": "Music and sound recommendations",
  "complexity": "low/medium/high",
  "targetAudience": "Audience analysis",
  "visualElements": ["Element 1", "Element 2"],
  "productionNotes": "Additional production guidance"
}`

      await new Promise(resolve => setTimeout(resolve, 1500))
      const analysisResponse = await spark.llm(analysisPrompt, "gpt-4o", true)
      const videoAnalysis = JSON.parse(analysisResponse)

      // Step 2: Visual Asset Planning (25%)
      toast.info("AI-powered visual asset planning", { description: "Generating shot list and visual guides" })
      setGenerationProgress(25)

      const visualPrompt = spark.llmPrompt`Based on this video analysis, create detailed visual directions:

**Analysis:** ${JSON.stringify(videoAnalysis)}
**Script:** ${scriptToUse}

Generate specific visual directions for each scene including:
1. Camera movements and angles
2. Visual composition
3. Props and set design
4. Actor directions (if applicable)
5. Visual effects needed
6. Transition suggestions

Format as professional video production notes.`

      await new Promise(resolve => setTimeout(resolve, 3000))
      const visualDirections = await spark.llm(visualPrompt)

      // Step 3: Audio Script Generation (50%)
      toast.info("Generating AI voice narration script", { description: "Creating optimized voice-over" })
      setGenerationProgress(50)

      const audioPrompt = spark.llmPrompt`Create an optimized voice-over script for AI narration:

**Original Script:** ${scriptToUse}
**Voice Style:** ${voiceStyle}
**Video Style:** ${videoStyle}

Optimize the script for AI voice generation by:
1. Adding proper pronunciation guides for difficult words
2. Including timing and pacing notes
3. Adding emphasis markers
4. Suggesting pause points
5. Formatting for natural speech flow

Provide the final voice-ready script with production notes.`

      await new Promise(resolve => setTimeout(resolve, 2500))
      const voiceScript = await spark.llm(audioPrompt)

      // Step 4: Production Guide Generation (75%)
      toast.info("Compiling production assets", { description: "Creating comprehensive video guide" })
      setGenerationProgress(75)

      const productionPrompt = spark.llmPrompt`Create a complete video production guide:

**Video Analysis:** ${JSON.stringify(videoAnalysis)}
**Visual Directions:** ${visualDirections}
**Voice Script:** ${voiceScript}

Compile a professional production package including:
1. Executive summary
2. Technical specifications
3. Scene-by-scene breakdown
4. Asset requirements
5. Timeline estimates
6. Quality checkpoints
7. Distribution recommendations

Format as a professional production brief.`

      await new Promise(resolve => setTimeout(resolve, 2000))
      const productionGuide = await spark.llm(productionPrompt)

      // Step 5: Final Processing (100%)
      toast.info("Finalizing video project", { description: "Preparing deliverables" })
      setGenerationProgress(95)

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Complete the project with AI-generated content
      const completedProject: VideoProject = {
        ...newProject,
        status: 'completed',
        progress: 100,
        videoUrl: `/ai-video-guide-${newProject.id}.pdf`, // AI-generated production guide
        thumbnailUrl: `/concept-${newProject.id}.jpg`, // Mock concept thumbnail
        // Store AI-generated content in project metadata
        metadata: {
          analysis: videoAnalysis,
          visualDirections,
          voiceScript,
          productionGuide
        }
      }

      setCurrentProject(completedProject)
      setVideoProjects((currentProjects) => [completedProject, ...(currentProjects || [])])
      
      setGenerationProgress(100)
      toast.success("AI Video Production Guide Generated!", {
        description: "Complete professional video production package ready for download."
      })
    } catch (error) {
      console.error('Video generation failed:', error)
      if (currentProject) {
        setCurrentProject({ ...currentProject, status: 'failed' })
      }
      toast.error("AI Video generation failed", {
        description: "Please try again with a different script or contact support."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadVideo = (project: VideoProject) => {
    if (!project.videoUrl) return
    
    // Generate comprehensive production guide content
    const productionContent = `# ${project.title} - Professional Video Production Guide

## Project Overview
**Generated:** ${new Date(project.createdAt).toLocaleDateString()}
**Style:** ${project.style}
**Resolution:** ${project.resolution}
**Status:** ${project.status}

## Original Script
${project.script}

---

${project.metadata?.analysis ? `## AI Video Analysis
**Visual Concept:** ${project.metadata.analysis.concept || 'N/A'}
**Theme:** ${project.metadata.analysis.theme || 'N/A'}
**Target Audience:** ${project.metadata.analysis.targetAudience || 'N/A'}
**Production Complexity:** ${project.metadata.analysis.complexity || 'N/A'}

### Shot List
${project.metadata.analysis.shotList ? project.metadata.analysis.shotList.map((shot: string, index: number) => `${index + 1}. ${shot}`).join('\n') : 'No shot list available'}

### Color Palette
${project.metadata.analysis.colorPalette ? project.metadata.analysis.colorPalette.join(', ') : 'No color palette specified'}

### Lighting Recommendations
${project.metadata.analysis.lighting || 'No lighting recommendations available'}

### Audio Recommendations
${project.metadata.analysis.audio || 'No audio recommendations available'}

### Visual Elements
${project.metadata.analysis.visualElements ? project.metadata.analysis.visualElements.map((element: string) => `- ${element}`).join('\n') : 'No visual elements specified'}

### Production Notes
${project.metadata.analysis.productionNotes || 'No additional production notes'}

---
` : ''}

${project.metadata?.visualDirections ? `## Visual Directions
${project.metadata.visualDirections}

---
` : ''}

${project.metadata?.voiceScript ? `## AI-Optimized Voice Script
${project.metadata.voiceScript}

---
` : ''}

${project.metadata?.productionGuide ? `## Complete Production Guide
${project.metadata.productionGuide}

---
` : ''}

## Technical Specifications
- **Video Style:** ${project.style}
- **Resolution:** ${project.resolution}
- **Duration:** ${project.duration}

## Next Steps for Video Production
1. Review the AI-generated visual concepts and shot list
2. Gather required props and set pieces based on visual directions
3. Record voice-over using the optimized script
4. Film scenes according to the shot list and visual directions
5. Edit according to the provided production guide
6. Apply color grading based on the suggested palette
7. Add audio and sound effects as recommended
8. Final review and distribution

---

*This production guide was generated by ContentFlow AI using advanced AI analysis of your script. Use this as a comprehensive starting point for professional video production.*

Generated by ContentFlow AI - Professional Video Creation Platform
Visit: https://contentflow.ai for more AI-powered content tools
`
    
    // Create and download the production guide
    const blob = new Blob([productionContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-production-guide.md`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Production Guide Downloaded!", {
      description: "Complete AI-generated video production guide saved to your device."
    })
  }

  return (
    <div className="space-y-6">
      {/* Premium Badge */}
      {!hasPremiumAccess && (
        <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Crown size={24} className="text-amber-600" />
              Premium Feature
            </CardTitle>
            <CardDescription className="text-amber-700">
              AI Video Production Analysis is available for premium subscribers. Get comprehensive production guides and professional insights for your video scripts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <Crown size={16} className="mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Generator */}
      <Card className={!hasPremiumAccess ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video size={24} className="text-accent" />
            AI Video Production Assistant
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
              <Crown size={12} className="mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Generate comprehensive production guides for professional video creation using AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Script Input */}
          {!script && (
            <div className="space-y-2">
              <Label htmlFor="custom-script">Video Script *</Label>
              <Textarea
                id="custom-script"
                placeholder="Enter your video script here..."
                className="min-h-[120px]"
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
              />
            </div>
          )}

          {script && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Using Script: {script.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {script.script.substring(0, 200)}...
              </p>
            </div>
          )}

          {/* Generation Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Video Style</Label>
              <Select value={videoStyle} onValueChange={setVideoStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="animated">Animated</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4k">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Voice Style</Label>
              <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calm">Calm & Soothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Generating Video...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                This may take several minutes depending on video length and complexity
              </p>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateVideo}
            disabled={isGenerating || (!script && !customScript.trim())}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Production Guide...
              </>
            ) : (
              <>
                <Sparkle size={20} className="mr-2" />
                Generate AI Production Guide
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Project Status */}
      {currentProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Play size={20} className="text-accent" />
                {currentProject.title}
              </span>
              <Badge 
                variant={currentProject.status === 'completed' ? 'default' : 'secondary'}
                className={
                  currentProject.status === 'completed' ? 'bg-green-100 text-green-800' :
                  currentProject.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }
              >
                {currentProject.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Style:</span>
                <p className="font-medium capitalize">{currentProject.style}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Resolution:</span>
                <p className="font-medium">{currentProject.resolution}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">{new Date(currentProject.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {currentProject.status === 'completed' && currentProject.videoUrl && (
              <div className="flex gap-2">
                <Button onClick={() => downloadVideo(currentProject)}>
                  <Download size={16} className="mr-2" />
                  Download Production Guide
                </Button>
                <Button variant="outline">
                  <Play size={16} className="mr-2" />
                  View Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Previous Projects */}
      {videoProjects && videoProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Video Projects</CardTitle>
            <CardDescription>Your generated videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videoProjects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <Video size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.style} • {project.resolution} • {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={project.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {project.status}
                    </Badge>
                    {project.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadVideo(project)}
                      >
                        <Download size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown size={24} className="text-amber-600" />
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription>
              Unlock AI Video Generation and create professional videos from your scripts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Premium Features Include:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  AI Video Production Analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Professional shot lists & visual guides
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  AI-optimized voice scripts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Complete production packages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Technical specifications & guidance
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                onClick={() => {
                  setShowUpgradeDialog(false)
                  toast.info("Redirecting to upgrade page...")
                }}
              >
                <Crown size={16} className="mr-2" />
                Upgrade Now
              </Button>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}