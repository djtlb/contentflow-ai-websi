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
import { ABTestingTemplates } from './ABTestingTemplates'

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
    objective?: string
    ctaElements?: string
  }>
  createdAt: string
  campaignType?: string
  keyMessages?: string[]
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
          <h1 className="text-3xl font-bold">Professional Video Marketing Suite</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create compelling marketing videos from concept to completion with AI-powered script generation and professional production guidance
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            <span>Marketing Script Generation</span>
          </div>
          <ArrowRight size={16} className="text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Video size={16} className="text-primary" />
            <span>AI Production Assistant</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
              <Crown size={10} className="mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <FileText size={16} />
            Script Generator
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Sparkle size={16} />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video size={16} />
            AI Production Assistant
            <Crown size={12} className="text-amber-600" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-6">
          <VideoScriptGenerator onCreateVideo={handleScriptToVideo} />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <ABTestingTemplates />
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
              Marketing Script Generator
            </CardTitle>
            <CardDescription>
              Create professional marketing video scripts with campaign templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                8 marketing campaign templates
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Scene-by-scene production guide
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Call-to-action optimization
              </li>
              <li className="flex items-center gap-2">
                <Sparkle size={14} className="text-accent" />
                Visual direction & dialogue
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setActiveTab("scripts")}
            >
              Start Creating Marketing Scripts
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-gradient-to-r from-amber-200 to-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video size={24} className="text-primary" />
              AI Production Assistant
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                <Crown size={10} className="mr-1" />
                Premium
              </Badge>
            </CardTitle>
            <CardDescription>
              Get professional production guides and technical analysis for your video scripts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                AI video analysis & concept development
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                Professional shot lists & visual guides
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                Production specifications & technical guidance
              </li>
              <li className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                Complete production packages
              </li>
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" 
              onClick={() => setActiveTab("videos")}
            >
              <Play size={16} className="mr-2" />
              Get AI Production Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}