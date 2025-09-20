import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  FileText, 
  Crown, 
  ArrowRight,
  Sparkle,
  Play
} from "@phosphor-icons/react"
import { VideoScriptGenerator } from './VideoScriptGenerator'
import { AIVideoGenerator } from './AIVideoGenerator'

interface VideoScript {
  title: string
  script: string
  scenes: Array<{
    title: string
    dialogue: string
    visuals: string
    duration: string
  }>
}

export function VideoCreationHub() {
  const [activeTab, setActiveTab] = useState("scripts")
  const [selectedScript, setSelectedScript] = useState<VideoScript | null>(null)

  const handleScriptToVideo = (script: VideoScript) => {
    setSelectedScript(script)
    setActiveTab("videos")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Video size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Video Creation Suite</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional video content from concept to completion with AI-powered tools
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            <span>Script Generation</span>
          </div>
          <ArrowRight size={16} className="text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Video size={16} className="text-primary" />
            <span>AI Video Creation</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
              <Crown size={10} className="mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <FileText size={16} />
            Script Generator
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video size={16} />
            AI Video Generator
            <Crown size={12} className="text-amber-600" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-6">
          <VideoScriptGenerator onCreateVideo={handleScriptToVideo} />
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <AIVideoGenerator script={selectedScript || undefined} />
        </TabsContent>
      </Tabs>

      {/* Feature Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={24} className="text-accent" />
              Script Generation
            </CardTitle>
            <CardDescription>
              Create professional video scripts with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Scene-by-scene breakdown
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Dialogue and visual directions
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Customizable tone and audience
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Export and save scripts
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setActiveTab("scripts")}
            >
              Start Creating Scripts
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-gradient-to-r from-amber-200 to-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video size={24} className="text-primary" />
              AI Video Generation
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                <Crown size={10} className="mr-1" />
                Premium
              </Badge>
            </CardTitle>
            <CardDescription>
              Transform scripts into professional videos automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                Multiple video styles
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                AI voice narration
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                HD/4K resolution options
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                Professional video output
              </li>
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" 
              onClick={() => setActiveTab("videos")}
            >
              <Play size={16} className="mr-2" />
              Create AI Videos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}