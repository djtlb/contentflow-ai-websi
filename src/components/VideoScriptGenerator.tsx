import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Video, 
  Clock, 
  Play, 
  Users, 
  Target,
  Sparkle,
  Download,
  Copy
} from "@phosphor-icons/react"
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

declare const spark: any

interface VideoScript {
  id: string
  title: string
  topic: string
  duration: string
  audience: string
  tone: string
  script: string
  scenes: Array<{
    id: string
    title: string
    description: string
    duration: string
    dialogue: string
    visuals: string
  }>
  createdAt: string
}

interface VideoScriptGeneratorProps {
  onCreateVideo?: (script: VideoScript) => void
}

export function VideoScriptGenerator({ onCreateVideo }: VideoScriptGeneratorProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("60")
  const [audience, setAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null)
  const [savedScripts, setSavedScripts] = useKV<VideoScript[]>("video-scripts", [])

  const generateScript = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your video script")
      return
    }

    setIsGenerating(true)
    
    try {
      // Generate the video script using AI
      const prompt = spark.llmPrompt`Generate a comprehensive video script for the following requirements:

Topic: ${topic}
Duration: ${duration} seconds
Target Audience: ${audience || "General audience"}
Tone: ${tone}

Create a detailed video script with the following structure:
1. A compelling title
2. 4-6 scenes that fit within the duration
3. For each scene, provide:
   - Scene title
   - Description of what happens
   - Estimated duration (distribute across ${duration} seconds total)
   - Dialogue/narration text
   - Visual descriptions for filming/animation

The script should be engaging, well-paced, and suitable for ${tone} content targeting ${audience || "general audience"}.

Format the response as JSON with this structure:
{
  "title": "Video Title",
  "hook": "Opening hook sentence",
  "scenes": [
    {
      "title": "Scene Name",
      "description": "What happens in this scene",
      "duration": "10s",
      "dialogue": "Spoken text for this scene",
      "visuals": "Visual descriptions and camera directions"
    }
  ],
  "callToAction": "Ending call to action"
}`

      const response = await spark.llm(prompt, "gpt-4o", true)
      const scriptData = JSON.parse(response)
      
      // Create the video script object
      const newScript: VideoScript = {
        id: Date.now().toString(),
        title: scriptData.title,
        topic,
        duration,
        audience: audience || "General audience",
        tone,
        script: `${scriptData.hook}\n\n${scriptData.scenes.map((scene: any) => scene.dialogue).join('\n\n')}\n\n${scriptData.callToAction}`,
        scenes: scriptData.scenes.map((scene: any, index: number) => ({
          id: `scene-${index + 1}`,
          title: scene.title,
          description: scene.description,
          duration: scene.duration,
          dialogue: scene.dialogue,
          visuals: scene.visuals
        })),
        createdAt: new Date().toISOString()
      }

      setGeneratedScript(newScript)
      toast.success("Video script generated successfully!", {
        description: "Your professional video script is ready for use."
      })
    } catch (error) {
      console.error('Script generation failed:', error)
      toast.error("Script generation failed", {
        description: "Please try again with a different topic."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveScript = () => {
    if (!generatedScript) return
    
    setSavedScripts((currentScripts) => [generatedScript, ...(currentScripts || [])])
    toast.success("Script saved!", {
      description: "Your video script has been saved to your library."
    })
  }

  const copyScript = () => {
    if (!generatedScript) return
    
    const scriptText = `${generatedScript.title}\n\n${generatedScript.script}`
    navigator.clipboard.writeText(scriptText)
    toast.success("Script copied to clipboard!")
  }

  const downloadScript = () => {
    if (!generatedScript) return
    
    const scriptContent = `# ${generatedScript.title}

**Topic:** ${generatedScript.topic}
**Duration:** ${generatedScript.duration} seconds
**Audience:** ${generatedScript.audience}
**Tone:** ${generatedScript.tone}
**Created:** ${new Date(generatedScript.createdAt).toLocaleDateString()}

## Full Script
${generatedScript.script}

## Scene Breakdown
${generatedScript.scenes.map((scene, index) => `
### Scene ${index + 1}: ${scene.title}
**Duration:** ${scene.duration}
**Description:** ${scene.description}

**Dialogue:**
${scene.dialogue}

**Visuals:**
${scene.visuals}
`).join('\n')}
`
    
    const blob = new Blob([scriptContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedScript.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-script.md`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Script downloaded!")
  }

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video size={24} className="text-primary" />
            Video Script Generator
          </CardTitle>
          <CardDescription>
            Create professional video scripts with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Video Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., How to start a sustainable business"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Small business owners, Students"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone & Style</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="entertaining">Entertaining</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={generateScript}
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkle size={20} className="mr-2" />
                Generate Video Script
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Script Display */}
      {generatedScript && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play size={20} className="text-accent" />
                  {generatedScript.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {generatedScript.duration}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {generatedScript.audience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={16} />
                    {generatedScript.tone}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyScript}>
                  <Copy size={16} className="mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadScript}>
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
                <Button size="sm" onClick={saveScript}>
                  Save Script
                </Button>
                {onCreateVideo && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    onClick={() => onCreateVideo(generatedScript)}
                  >
                    <Video size={16} className="mr-1" />
                    Create Video
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Script */}
            <div>
              <h4 className="font-semibold mb-2">Complete Script</h4>
              <div className="bg-muted p-4 rounded-lg">
                <div className="prose prose-sm max-w-none">
                  {generatedScript.script.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-foreground">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Scene Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Scene Breakdown</h4>
              <div className="space-y-4">
                {generatedScript.scenes.map((scene, index) => (
                  <Card key={scene.id} className="border-l-4 border-l-accent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        Scene {index + 1}: {scene.title}
                        <Badge variant="secondary">{scene.duration}</Badge>
                      </CardTitle>
                      <CardDescription>{scene.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Dialogue:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{scene.dialogue}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Visual Direction:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{scene.visuals}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Scripts */}
      {savedScripts && savedScripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Scripts</CardTitle>
            <CardDescription>Your previously generated video scripts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedScripts.slice(0, 5).map((script) => (
                <div key={script.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{script.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {script.topic} • {script.duration}s • {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGeneratedScript(script)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}