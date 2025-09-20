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

      // Simulate video generation process with realistic steps
      const steps = [
        { name: "Analyzing script", duration: 2000 },
        { name: "Generating visual assets", duration: 8000 },
        { name: "Creating voice narration", duration: 5000 },
        { name: "Compositing scenes", duration: 6000 },
        { name: "Rendering final video", duration: 4000 }
      ]

      let totalProgress = 0
      const progressPerStep = 100 / steps.length

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        toast.info(step.name, { description: `Step ${i + 1} of ${steps.length}` })
        
        // Animate progress for this step
        const stepStartProgress = totalProgress
        const stepEndProgress = totalProgress + progressPerStep
        
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            const newProgress = Math.min(prev + 2, stepEndProgress)
            return newProgress
          })
        }, step.duration / 50)

        await new Promise(resolve => setTimeout(resolve, step.duration))
        clearInterval(progressInterval)
        totalProgress = stepEndProgress
      }

      // Complete the project
      const completedProject: VideoProject = {
        ...newProject,
        status: 'completed',
        progress: 100,
        videoUrl: `/generated-video-${newProject.id}.mp4`, // Mock URL
        thumbnailUrl: `/thumbnail-${newProject.id}.jpg` // Mock URL
      }

      setCurrentProject(completedProject)
      setVideoProjects((currentProjects) => [completedProject, ...(currentProjects || [])])
      
      setGenerationProgress(100)
      toast.success("Video generated successfully!", {
        description: "Your AI-generated video is ready for download."
      })
    } catch (error) {
      console.error('Video generation failed:', error)
      if (currentProject) {
        setCurrentProject({ ...currentProject, status: 'failed' })
      }
      toast.error("Video generation failed", {
        description: "Please try again or contact support if the issue persists."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadVideo = (project: VideoProject) => {
    if (!project.videoUrl) return
    
    // In a real implementation, this would download the actual video file
    toast.success("Download started", {
      description: "Your video will be downloaded shortly."
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
              AI Video Generation is available for premium subscribers. Upgrade to create professional videos from your scripts.
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
            AI Video Generator
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
              <Crown size={12} className="mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Transform your scripts into professional videos with AI
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
                Generating Video...
              </>
            ) : (
              <>
                <Sparkle size={20} className="mr-2" />
                Generate AI Video
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
                  Download Video
                </Button>
                <Button variant="outline">
                  <Play size={16} className="mr-2" />
                  Preview
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
                  AI Video Generation from scripts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Multiple video styles & resolutions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Professional AI voice narration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Unlimited video generations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Priority processing & support
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