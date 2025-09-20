import React, { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Lightning, ChartBar, Users, ArrowRight, Sparkle, Target, Clock, TrendUp, Play, CheckCircle, Calendar, Phone, Video, FileText, Crown } from "@phosphor-icons/react"
import { toast } from 'sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { UserMenu } from '@/components/UserMenu'
import { VideoCreationHub } from '@/components/VideoCreationHub'
import { ContentLibrary } from '@/components/ContentLibrary'
import { ErrorFallback } from './ErrorFallback'

// Declare spark global for TypeScript
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<any>
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}

declare const spark: Window['spark']

function AppContent() {
  const { user, loading, isAdmin } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [demoProgress, setDemoProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [inputTopic, setInputTopic] = useState("")
  const [isMainGenerating, setIsMainGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'library'>('home')

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle sign in
  const handleSignIn = () => {
    if (user) {
      // User is already signed in, show user menu or dashboard
      toast.info("You're already signed in!")
    } else {
      setAuthDialogOpen(true)
    }
  }

  // Handle get started
  const handleGetStarted = () => {
    if (user) {
      toast.success("Welcome back!", {
        description: "You're already signed in and ready to create content."
      })
    } else {
      setAuthDialogOpen(true)
    }
  }

  // Handle start free trial
  const handleStartFreeTrial = () => {
    if (user) {
      toast.success("Free Trial Active!", {
        description: "Your account already has an active subscription."
      })
    } else {
      setAuthDialogOpen(true)
    }
  }

  // Handle schedule demo
  const handleScheduleDemo = () => {
    toast.info("Demo Scheduled", {
      description: "A demo has been scheduled. You'll receive a calendar invite shortly."
    })
  }

  const [demoSteps, setDemoSteps] = useState([
    {
      title: "Enter Your Topic",
      description: "Start by describing what content you want to create",
      content: "sustainable technology trends in 2024"
    },
    {
      title: "AI Analysis",
      description: "Our AI analyzes your topic and identifies key themes",
      content: "Analyzing: renewable energy, green tech, sustainability metrics..."
    },
    {
      title: "Content Generation",
      description: "Generating high-quality, SEO-optimized content",
      content: "Creating engaging content with proper structure and keywords..."
    },
    {
      title: "Final Result",
      description: "Your AI-generated content is ready for use",
      content: `# Sustainable Technology Trends Shaping 2024

The landscape of sustainable technology is evolving rapidly, with groundbreaking innovations transforming how businesses approach environmental responsibility. From advanced renewable energy systems to AI-powered carbon tracking, companies are leveraging cutting-edge solutions to reduce their environmental footprint while maintaining competitive advantage.

## Key Trends to Watch

**Renewable Energy Integration**: Smart grid technologies are making renewable energy more reliable and cost-effective than ever before.

**Circular Economy Solutions**: Advanced recycling technologies and sustainable materials are creating closed-loop systems across industries.

**Carbon Intelligence**: AI-driven platforms are providing unprecedented visibility into carbon emissions, enabling data-driven sustainability decisions.

This content is optimized for search engines and ready for publication across your marketing channels.`
    }
  ])

  const startDemo = async () => {
    setDemoStep(0)
    setDemoProgress(0)
    setIsGenerating(true)
    setGeneratedContent("")

    // Step 1: Show topic input
    setDemoStep(1)
    setDemoProgress(25)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Step 2: Show AI analysis
    setDemoStep(2)
    setDemoProgress(50)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Step 3: Show content generation
    setDemoStep(3)
    setDemoProgress(75)
    
    try {
      // Generate both content and video script for comprehensive demo
      const contentPrompt = spark.llmPrompt`Generate a comprehensive, engaging article about sustainable technology trends in 2024. 

Structure the content with:
- A compelling headline starting with "#"
- An engaging introduction paragraph
- 3-4 main sections with descriptive subheadings starting with "##"
- Key insights and practical information
- Focus on renewable energy, green tech, and sustainability metrics

Make the content professional, informative, and suitable for publication. Keep it concise but comprehensive.`

      const videoScriptPrompt = spark.llmPrompt`Generate a professional marketing video script for "Sustainable Technology Trends in 2024" campaign:

Duration: 60 seconds
Target Audience: Business professionals and decision makers
Tone: Professional yet engaging
Campaign Type: Product Launch & Awareness

Create a comprehensive marketing video script with:
1. Compelling title optimized for business impact
2. Attention-grabbing hook (first 3 seconds)
3. 5-6 scenes that tell a complete marketing story
4. Each scene should include:
   - Scene title and marketing objective (awareness/consideration/conversion)
   - Duration (distribute across 60 seconds)
   - Compelling dialogue/narration with psychological triggers
   - Professional visual descriptions for high-end video production
   - Strategic call-to-action elements
   - Persuasion techniques (social proof, urgency, benefits)

**Marketing Requirements:**
- Focus on clear value propositions and customer benefits
- Include emotional triggers appropriate for business audience
- Address potential objections within the narrative
- Build credibility through professional presentation
- Drive specific business outcomes and conversions
- Optimize for multiple distribution channels

Make it highly persuasive, results-driven, and designed for maximum business impact.

Format as JSON:
{
  "title": "Professional Marketing Video Title",
  "hook": "Compelling 3-second business-focused opening",
  "totalDuration": "60s",
  "scenes": [
    {
      "title": "Scene Name",
      "objective": "awareness/consideration/conversion",
      "duration": "10s",
      "dialogue": "Persuasive professional narration with business benefits",
      "visuals": "High-end professional visual descriptions and production notes",
      "ctaElements": "Strategic call-to-action elements and on-screen text",
      "persuasionTechniques": "Specific persuasion methods used"
    }
  ],
  "callToAction": "Strong business-focused closing CTA with clear next steps",
  "keyMessages": ["Primary value prop", "Key differentiator", "Business benefit"],
  "marketingNotes": {
    "targetPainPoints": ["Business pain point 1", "Challenge addressed"],
    "persuasionTechniques": ["Social proof", "Authority positioning"],
    "brandingElements": "Professional branding emphasis"
  }
}`

      // Generate both pieces of content simultaneously for demo
      const [aiContent, videoScriptResponse] = await Promise.all([
        spark.llm(contentPrompt),
        spark.llm(videoScriptPrompt, "gpt-4o", true)
      ])
      
      const videoScript = JSON.parse(videoScriptResponse)
      
      // Update the demo steps with real AI content
      setDemoSteps(prev => [
        ...prev.slice(0, 3),
        {
          title: "🤖 AI Generation Complete",
          description: "Your professional content and video script generated with advanced AI",
          content: `# 🚀 AI-Generated Professional Marketing Campaign

## 📝 Article Content (Generated by AI):
${aiContent}

---

## 🎬 AI-Generated Marketing Video Script: ${videoScript.title}

**🎯 Campaign Analysis:**
- **Type:** ${videoScript.marketingNotes?.campaignType || 'Product Launch & Awareness'}
- **Target:** Business professionals and decision makers
- **AI Confidence:** High (optimized for business impact)
- **Generated Elements:** Script, visuals, CTAs, and performance insights

**⚡ Hook (Opening 3 seconds - AI optimized):**
${videoScript.hook}

**🔑 AI-Identified Key Messages:**
${videoScript.keyMessages ? videoScript.keyMessages.map((msg: string) => `• ${msg}`).join('\n') : '• Value proposition optimization\n• Market differentiation\n• Customer benefit focus'}

**🎭 Complete AI-Generated Video Script:**
${videoScript.scenes.map((scene: any, index: number) => `

**Scene ${index + 1}: ${scene.title}** (${scene.duration})
*🎯 Marketing Objective: ${scene.objective}*
*🧠 AI Persuasion Technique: ${scene.persuasionTechniques || 'Professional positioning & authority building'}*

**Dialogue (AI-optimized):** ${scene.dialogue}

**Visual AI Directions:** ${scene.visuals}

${scene.ctaElements ? `**🎯 Strategic CTAs:** ${scene.ctaElements}` : ''}
`).join('')}

**📢 AI-Crafted Closing Call-to-Action:**
${videoScript.callToAction}

**📊 AI Marketing Intelligence:**
${videoScript.marketingNotes ? `
🎯 **Target Pain Points Identified:** ${videoScript.marketingNotes.targetPainPoints?.join(', ') || 'Business efficiency, competitive advantage, growth challenges'}
🧠 **AI Persuasion Methods:** ${videoScript.marketingNotes.persuasionTechniques?.join(', ') || 'Authority positioning, social proof, emotional triggers'}
🏢 **Branding Strategy:** ${videoScript.marketingNotes.brandingElements || 'Professional credibility, innovation leadership, customer-centricity'}
` : `
🎯 **Target Pain Points:** Business efficiency, competitive challenges
🧠 **AI Persuasion Methods:** Authority, social proof, urgency
🏢 **Branding Focus:** Professional credibility and innovation`}

**🌐 AI-Recommended Distribution Channels:**
Primary: YouTube, LinkedIn, Website Hero Section
Secondary: Email Campaigns, Sales Presentations, Social Media
Advanced: Retargeting Ads, Conference Presentations

**🤖 AI Generation Summary:**
✅ Content optimized for search engines and engagement
✅ Video script tailored for business decision-makers  
✅ Persuasion techniques embedded throughout
✅ Multi-channel distribution strategy included
✅ Performance tracking metrics suggested

---

*🎉 Both your article and video script were generated using advanced AI models, optimized for maximum business impact, and are ready for immediate professional deployment!*

**Next Steps:**
1. Copy content for immediate use
2. Customize branding elements
3. Deploy across recommended channels
4. Track performance metrics`
        }
      ])
      
      // Step 4: Show final result
      setDemoStep(4)
      setDemoProgress(100)
      setIsGenerating(false)
      toast.success("Generative AI demo completed!", {
        description: "Generated original content article and professional video script with AI."
      })
    } catch (error) {
      console.error('Demo content generation failed:', error)
      setDemoStep(4)
      setDemoProgress(100)
      setIsGenerating(false)
      toast.error("Demo generation failed", {
        description: "Using fallback content for demonstration."
      })
    }
  }

  const generateMainContent = async () => {
    if (!inputTopic.trim()) return
    
    setIsMainGenerating(true)
    
    try {
      // Create AI prompt for content generation
      const prompt = spark.llmPrompt`Generate a comprehensive, high-quality article about ${inputTopic} using advanced AI content generation.

**Content Generation Requirements:**
- Topic: ${inputTopic}
- Use professional writing style with engaging tone
- Create original, unique content (not templated)
- Include SEO-optimized elements naturally
- Provide actionable insights and practical information
- Structure for maximum readability and engagement

**AI Writing Instructions:**
1. Generate a compelling, keyword-rich headline
2. Create an engaging introduction that hooks readers
3. Develop 3-4 main sections with descriptive subheadings
4. Include specific examples, statistics, or insights where relevant
5. Write in a natural, conversational yet professional tone
6. Ensure content is completely original and AI-generated
7. End with actionable takeaways or conclusions

**Content Goals:**
- Minimum 400+ words for substantial value
- Include semantic keywords naturally
- Write for both human readers and search engines
- Provide genuine value and insights
- Make it publication-ready

Generate completely original, AI-powered content that demonstrates the power of artificial intelligence in content creation. Topic: ${inputTopic}`

      // Generate content using Spark LLM
      const aiContent = await spark.llm(prompt)
      setGeneratedContent(aiContent)
      
      // Save content to library
      const contentItem = {
        id: Date.now().toString(),
        title: inputTopic.charAt(0).toUpperCase() + inputTopic.slice(1),
        content: aiContent,
        type: 'article' as const,
        category: 'Generated Content',
        tags: inputTopic.split(' ').filter(word => word.length > 2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        wordCount: aiContent.split(' ').length,
        status: 'draft' as const,
        metadata: {
          seo_keywords: inputTopic.split(' '),
          target_audience: 'General audience'
        }
      }
      
      // Save to content library
      await spark.kv.get<any[]>("content-library").then(async (existingContent) => {
        const currentContent = existingContent || []
        await spark.kv.set("content-library", [contentItem, ...currentContent])
      })
      
      toast.success("Original content generated and saved!", {
        description: "Your AI-generated original content is ready and saved to your library."
      })
    } catch (error) {
      console.error('Content generation failed:', error)
      setGeneratedContent(`Sorry, we encountered an issue generating content about "${inputTopic}". Please try again or try a different topic.`)
      toast.error("Content generation failed", {
        description: "Please try again with a different topic."
      })
    } finally {
      setIsMainGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain size={32} weight="bold" className="text-primary" />
              <span className="text-xl font-bold">ContentFlow AI</span>
              {isAdmin && (
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                  <Crown size={10} className="mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentPage('home')} 
                className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
                  currentPage === 'home' ? 'text-foreground font-medium' : ''
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('library')} 
                className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
                  currentPage === 'library' ? 'text-foreground font-medium' : ''
                }`}
              >
                Content Library
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                About
              </button>
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
                  <Button size="sm" onClick={handleGetStarted}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Conditional Page Rendering */}
      {currentPage === 'library' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContentLibrary />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
            <Brain size={16} className="mr-2" />
            Powered by Advanced Generative AI
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Transform Content Creation with Generative AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            ContentFlow AI empowers creators with intelligent generative AI tools to create original, unique content at scale. 
            From ideation to publication, generate fresh content that's never been seen before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Start Creating Free
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Play size={20} className="mr-2" />
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lightning size={24} className="text-accent" />
                    ContentFlow AI Demo
                  </DialogTitle>
                  <DialogDescription>
                    See how ContentFlow AI generates high-quality content in seconds
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Demo Progress</span>
                      <span>{Math.round(demoProgress)}%</span>
                    </div>
                    <Progress value={demoProgress} className="h-2" />
                  </div>

                  {/* Demo Steps */}
                  <div className="space-y-4">
                    {demoSteps.map((step, index) => (
                      <Card key={index} className={`transition-all duration-500 ${
                        index <= demoStep ? 'border-primary bg-primary/5' : 'border-muted bg-muted/20'
                      }`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {index < demoStep ? (
                              <CheckCircle size={20} className="text-green-500" />
                            ) : index === demoStep ? (
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                            )}
                            Step {index + 1}: {step.title}
                          </CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </CardHeader>
                        {index <= demoStep && (
                          <CardContent>
                            {index === 3 ? (
                              <div className="bg-background p-4 rounded-lg border max-h-96 overflow-y-auto">
                                <div className="prose prose-sm max-w-none">
                                  {step.content.split('\n').map((line, lineIndex) => {
                                    if (line.startsWith('# ')) {
                                      return <h1 key={lineIndex} className="text-lg font-bold mb-3 text-foreground">{line.slice(2)}</h1>
                                    } else if (line.startsWith('## ')) {
                                      return <h2 key={lineIndex} className="text-base font-semibold mb-2 mt-4 text-foreground">{line.slice(3)}</h2>
                                    } else if (line.startsWith('**') && line.endsWith('**')) {
                                      return <p key={lineIndex} className="font-semibold mb-2 text-foreground">{line.slice(2, -2)}</p>
                                    } else if (line.trim()) {
                                      return <p key={lineIndex} className="mb-2 text-muted-foreground">{line}</p>
                                    } else {
                                      return <br key={lineIndex} />
                                    }
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-mono">{step.content}</p>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>

                  {/* Demo Controls */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={startDemo} 
                      disabled={isGenerating}
                      className="text-lg px-8"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play size={20} className="mr-2" />
                          {demoStep === 0 ? 'Start Demo' : 'Restart Demo'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Demo Content Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Lightning size={24} className="text-accent" />
                Generative AI Content Creation Platform
              </CardTitle>
              <CardDescription>
                Create original content and videos with intelligent generative AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText size={16} />
                    Generative Content
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video size={16} />
                    AI Video Creation
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4 mt-6">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter your topic: 'sustainable technology trends'" 
                      className="flex-1"
                      value={inputTopic}
                      onChange={(e) => setInputTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && generateMainContent()}
                    />
                    <Button 
                      onClick={generateMainContent}
                      disabled={isMainGenerating || !inputTopic.trim()}
                    >
                      {isMainGenerating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Brain size={16} className="mr-1" />
                          Generate Original Content
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-left min-h-[200px]">
                    {isMainGenerating ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Generating original content with AI...</span>
                        </div>
                      </div>
                    ) : generatedContent ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Brain size={16} className="text-primary" />
                            AI-Generated Content:
                          </p>
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-xs">
                            <Lightning size={12} className="mr-1" />
                            Freshly Generated
                          </Badge>
                        </div>
                        <div className="bg-background p-4 rounded-lg border max-h-96 overflow-y-auto">
                          <div className="prose prose-sm max-w-none">
                            {generatedContent.split('\n').map((line, lineIndex) => {
                              if (line.startsWith('# ')) {
                                return <h1 key={lineIndex} className="text-lg font-bold mb-3 text-foreground">{line.slice(2)}</h1>
                              } else if (line.startsWith('## ')) {
                                return <h2 key={lineIndex} className="text-base font-semibold mb-2 mt-4 text-foreground">{line.slice(3)}</h2>
                              } else if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={lineIndex} className="font-semibold mb-2 text-foreground">{line.slice(2, -2)}</p>
                              } else if (line.trim()) {
                                return <p key={lineIndex} className="mb-2 text-muted-foreground">{line}</p>
                              } else {
                                return <br key={lineIndex} />
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">🤖 AI-Generated Content Preview:</p>
                          <p className="text-foreground italic">
                            "Sustainable technology is reshaping industries worldwide, from renewable energy solutions 
                            to eco-friendly manufacturing processes. As businesses prioritize environmental responsibility..."
                          </p>
                          <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-2">
                            <Brain size={14} className="text-primary" />
                            Enter a topic above to generate real AI-powered content
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="video" className="mt-6">
                  <VideoCreationHub />
                  
                  {/* Demo Section for Video Creation */}
                  <Card className="mt-6 border-2 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play size={20} className="text-accent" />
                        Try Video Script Generation Demo
                      </CardTitle>
                      <CardDescription>
                        See how our AI creates professional marketing video scripts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={startDemo}
                        variant="outline"
                        className="w-full border-accent text-accent hover:bg-accent/10"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin mr-2" />
                            Running Demo...
                          </>
                        ) : (
                          <>
                            <Sparkle size={16} className="mr-2" />
                            Generate Demo Marketing Script
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, optimize, and scale your content strategy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Brain size={48} className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Generative AI Content Creation</CardTitle>
                <CardDescription>
                  Generate original blog posts, social media content, headlines, and copy with advanced generative AI models that create unique content from scratch
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Target size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>SEO Optimization</CardTitle>
                <CardDescription>
                  Optimize content for search engines with keyword analysis and readability scoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Clock size={48} className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Workflow Management</CardTitle>
                <CardDescription>
                  Organize projects with content calendars, collaboration tools, and task tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <ChartBar size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track content performance and get AI-powered insights for optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Users size={48} className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together seamlessly with real-time editing and approval workflows
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Video size={48} className="text-primary group-hover:scale-110 transition-transform" />
                  <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                    Premium
                  </Badge>
                </div>
                <CardTitle>Generative AI Video Creation</CardTitle>
                <CardDescription>
                  Transform scripts into professional videos with generative AI-powered video creation that produces original visual content and narratives
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Content & Video Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators using ContentFlow AI to scale content production and create professional videos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleStartFreeTrial}>
              Start Free Trial
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" onClick={handleScheduleDemo}>
              <Phone size={20} className="mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your content creation needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Perfect for individual creators</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    50 AI generations/month
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Basic SEO optimization
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Email support
                  </div>
                </div>
                <Button className="w-full" onClick={handleStartFreeTrial}>Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <CardDescription>For growing businesses and teams</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    500 AI generations/month
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Video script generation
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Advanced SEO tools
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Team collaboration
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Priority support
                  </div>
                </div>
                <Button className="w-full" onClick={handleStartFreeTrial}>Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Unlimited generations
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    AI video generation
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Custom AI models
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Advanced analytics
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    Dedicated support
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleScheduleDemo}>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">About ContentFlow AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing content creation with cutting-edge AI technology, 
              empowering creators and businesses to scale their content strategies efficiently.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground text-lg">
                ContentFlow AI was founded with a simple mission: to democratize high-quality generative content creation. 
                We believe that everyone should have access to powerful generative AI tools that can create original, 
                unique content to help them tell their stories, share their expertise, and connect with their audiences.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">500K+</div>
                  <div className="text-muted-foreground">Content Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">50+</div>
                  <div className="text-muted-foreground">Languages</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Brain size={24} className="text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Advanced Generative AI Models</h4>
                    <p className="text-muted-foreground">
                      Our proprietary generative AI models are trained on diverse, high-quality content to ensure 
                      exceptional, original output across all content types with no repetition or templating.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target size={24} className="text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">SEO-First Approach</h4>
                    <p className="text-muted-foreground">
                      Every piece of content is optimized for search engines from the ground up, 
                      helping you rank higher and reach more audiences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users size={24} className="text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Built for Teams</h4>
                    <p className="text-muted-foreground">
                      Collaborative features and workflow management tools designed to help 
                      teams work together seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain size={24} weight="bold" className="text-primary" />
                <span className="font-bold">ContentFlow AI</span>
              </div>
              <p className="text-muted-foreground">
                Intelligent generative content creation platform powered by advanced AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-muted-foreground">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => toast.info("API documentation coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  API
                </button>
                <button 
                  onClick={() => toast.info("Integrations page coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Integrations
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  About
                </button>
                <button 
                  onClick={() => toast.info("Blog coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Blog
                </button>
                <button 
                  onClick={() => toast.info("Careers page coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Careers
                </button>
                <button 
                  onClick={() => toast.info("Contact form coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-muted-foreground">
                <button 
                  onClick={() => toast.info("Help Center coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Help Center
                </button>
                <button 
                  onClick={() => toast.info("Documentation coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Documentation
                </button>
                <button 
                  onClick={() => toast.info("Community coming soon!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Community
                </button>
                <button 
                  onClick={() => toast.info("All systems operational!")} 
                  className="block hover:text-foreground transition-colors cursor-pointer"
                >
                  Status
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-muted-foreground">
            <div>© 2024 ContentFlow AI. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
        </>
      )}
    </div>
  )
}

// Main App component with AuthProvider and Error Boundary
function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo)
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App