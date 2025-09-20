import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Clock, 
  Play, 
  Users, 
  Target,
  Sparkle,
  Download,
  Copy,
  TrendUp,
  Heart,
  ShoppingBag,
  Megaphone,
  Star,
  Lightning,
  Lightbulb,
  Trophy,
  Calendar
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
    objective?: string
    ctaElements?: string
  }>
  createdAt: string
  campaignType?: string
  keyMessages?: string[]
  marketingInsights?: {
    targetPainPoints?: string[]
    persuasionTechniques?: string[]
    brandingElements?: string
    estimatedEngagement?: 'low' | 'medium' | 'high'
    recommendedPlatforms?: string[]
  }
}

interface VideoScriptGeneratorProps {
  onCreateVideo?: (script: VideoScript) => void
}

interface CampaignTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'sales' | 'awareness' | 'engagement' | 'education'
  suggestedDuration: string
  suggestedTone: string
  promptTemplate: string
}

export function VideoScriptGenerator({ onCreateVideo }: VideoScriptGeneratorProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("60")
  const [audience, setAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [campaignType, setCampaignType] = useState("")
  const [productService, setProductService] = useState("")
  const [keyBenefits, setKeyBenefits] = useState("")
  const [callToAction, setCallToAction] = useState("")
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null)
  const [savedScripts, setSavedScripts] = useKV<VideoScript[]>("video-scripts", [])
  const [activeTab, setActiveTab] = useState("templates")

  // Platform recommendation logic
  const getPlatformRecommendations = (duration: number, category: string): string[] => {
    const platforms: string[] = []
    
    if (duration <= 15) platforms.push('TikTok', 'Instagram Reels')
    if (duration <= 60) platforms.push('YouTube Shorts', 'Twitter/X', 'LinkedIn')
    if (duration <= 120) platforms.push('Instagram', 'Facebook', 'YouTube')
    if (duration > 120) platforms.push('YouTube', 'Website', 'Email Marketing')
    
    if (category === 'sales') platforms.push('Landing Pages', 'Email Campaigns')
    if (category === 'education') platforms.push('YouTube', 'LinkedIn Learning')
    if (category === 'awareness') platforms.push('Social Media', 'Display Ads')
    
    return [...new Set(platforms)] // Remove duplicates
  }

  // Professional marketing campaign templates
  const campaignTemplates: CampaignTemplate[] = [
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Introduce new products with excitement and clear value propositions',
      icon: <Sparkle size={20} className="text-yellow-500" />,
      category: 'awareness',
      suggestedDuration: '60',
      suggestedTone: 'exciting',
      promptTemplate: 'Create a high-impact product launch video script that builds anticipation, clearly communicates unique value propositions, and drives early adoption. Focus on problem-solution fit and competitive advantages.'
    },
    {
      id: 'brand-story',
      name: 'Brand Storytelling',
      description: 'Share your brand\'s mission, values, and journey',
      icon: <Heart size={20} className="text-pink-500" />,
      category: 'awareness',
      suggestedDuration: '120',
      suggestedTone: 'inspirational',
      promptTemplate: 'Develop a compelling brand narrative that connects emotionally with viewers, communicates core values, and builds authentic connections. Include founder story, mission, and customer impact.'
    },
    {
      id: 'sales-conversion',
      name: 'Sales & Conversion',
      description: 'Drive immediate action and conversions',
      icon: <ShoppingBag size={20} className="text-green-500" />,
      category: 'sales',
      suggestedDuration: '45',
      suggestedTone: 'persuasive',
      promptTemplate: 'Create a high-converting sales script using proven frameworks (AIDA, PAS). Address pain points, present solutions, handle objections, and include compelling calls-to-action with urgency and scarcity.'
    },
    {
      id: 'social-proof',
      name: 'Social Proof & Testimonials',
      description: 'Leverage customer success stories and reviews',
      icon: <Star size={20} className="text-blue-500" />,
      category: 'sales',
      suggestedDuration: '90',
      suggestedTone: 'authentic',
      promptTemplate: 'Build a testimonial-focused script that showcases real customer transformations, specific results, and builds trust through authentic stories. Include before/after scenarios and quantifiable outcomes.'
    },
    {
      id: 'how-to-tutorial',
      name: 'How-To & Tutorial',
      description: 'Educational content that provides value to viewers',
      icon: <Lightbulb size={20} className="text-orange-500" />,
      category: 'education',
      suggestedDuration: '180',
      suggestedTone: 'educational',
      promptTemplate: 'Create a comprehensive step-by-step tutorial that provides genuine value while subtly showcasing your expertise and solutions. Focus on actionable insights and clear instructions.'
    },
    {
      id: 'comparison',
      name: 'Competitive Comparison',
      description: 'Highlight advantages over competitors',
      icon: <Trophy size={20} className="text-purple-500" />,
      category: 'sales',
      suggestedDuration: '75',
      suggestedTone: 'professional',
      promptTemplate: 'Develop a professional comparison script that objectively highlights competitive advantages without negative competitor mentions. Focus on unique benefits and superior value propositions.'
    },
    {
      id: 'behind-scenes',
      name: 'Behind The Scenes',
      description: 'Show the human side of your business',
      icon: <Users size={20} className="text-cyan-500" />,
      category: 'engagement',
      suggestedDuration: '90',
      suggestedTone: 'casual',
      promptTemplate: 'Create an authentic behind-the-scenes script that humanizes your brand, shows company culture, and builds personal connections with your audience through transparency and relatability.'
    },
    {
      id: 'announcement',
      name: 'Company Announcement',
      description: 'Share important company news and updates',
      icon: <Megaphone size={20} className="text-red-500" />,
      category: 'awareness',
      suggestedDuration: '60',
      suggestedTone: 'professional',
      promptTemplate: 'Craft a clear and engaging announcement that communicates important company news, explains impact on customers, and maintains positive brand perception during changes.'
    },
    {
      id: 'explainer-demo',
      name: 'Product Demo & Explainer',
      description: 'Showcase product features and benefits in action',
      icon: <Play size={20} className="text-green-600" />,
      category: 'education',
      suggestedDuration: '120',
      suggestedTone: 'educational',
      promptTemplate: 'Create a product demonstration script that clearly shows features, benefits, and use cases. Focus on solving customer problems and demonstrating value through practical examples.'
    },
    {
      id: 'recruitment',
      name: 'Recruitment & Hiring',
      description: 'Attract top talent with compelling company culture content',
      icon: <Users size={20} className="text-purple-600" />,
      category: 'awareness',
      suggestedDuration: '90',
      suggestedTone: 'inspirational',
      promptTemplate: 'Develop a recruitment-focused script that showcases company culture, growth opportunities, and mission. Appeal to top talent by highlighting unique benefits and career development.'
    },
    {
      id: 'event-promotion',
      name: 'Event Promotion',
      description: 'Drive registrations and attendance for events',
      icon: <Calendar size={20} className="text-orange-600" />,
      category: 'awareness',
      suggestedDuration: '60',
      suggestedTone: 'urgent',
      promptTemplate: 'Create an event promotion script that builds excitement, communicates value, and drives registration. Include speaker highlights, agenda benefits, and clear registration calls-to-action.'
    },
    {
      id: 'customer-success',
      name: 'Customer Success Story',
      description: 'Showcase customer transformations and results',
      icon: <TrendUp size={20} className="text-emerald-600" />,
      category: 'sales',
      suggestedDuration: '120',
      suggestedTone: 'authentic',
      promptTemplate: 'Build a customer success story that follows a narrative arc: challenge, solution, transformation. Include specific metrics, quotes, and before/after scenarios to build credibility.'
    }
  ]

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setDuration(template.suggestedDuration)
    setTone(template.suggestedTone)
    setCampaignType(template.id)
    setActiveTab("custom")
    toast.success(`${template.name} template selected!`, {
      description: "Form populated with recommended settings."
    })
  }

  const generateScript = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your video script")
      return
    }

    setIsGenerating(true)
    
    try {
      // Get selected template for enhanced prompting
      const selectedTemplate = campaignTemplates.find(t => t.id === campaignType)
      
      // Enhanced prompt for professional marketing campaigns
      const prompt = spark.llmPrompt`Generate a professional marketing video script optimized for ${selectedTemplate ? selectedTemplate.category : 'general marketing'} campaigns.

**Campaign Requirements:**
Topic: ${topic}
Campaign Type: ${selectedTemplate ? selectedTemplate.name : 'Custom Campaign'}
Duration: ${duration} seconds
Target Audience: ${audience || "General business audience"}
Tone: ${tone}
Marketing Objective: ${selectedTemplate ? selectedTemplate.category : 'conversion'}

**Product/Service Context:**
${productService ? `Product/Service: ${productService}` : ''}
${keyBenefits ? `Key Benefits/Features: ${keyBenefits}` : ''}
${callToAction ? `Primary Call-to-Action: ${callToAction}` : ''}

**Marketing Strategy:**
${selectedTemplate ? selectedTemplate.promptTemplate : 'Create a compelling marketing video script that drives engagement and conversions'}

**Professional Requirements:**
1. Follow proven marketing frameworks (AIDA, PAS, Problem-Solution)
2. Include psychological triggers and persuasion techniques
3. Optimize for the specified duration with natural pacing
4. Create compelling hooks that capture attention within 3 seconds
5. Address target audience pain points and desires
6. Include social proof elements where appropriate
7. Build clear value propositions throughout
8. End with strong, specific calls-to-action

**Script Structure Requirements:**
- Compelling title optimized for ${selectedTemplate ? selectedTemplate.category : 'marketing'}
- Attention-grabbing hook (first 3-5 seconds)
- 4-7 scenes distributed across ${duration} seconds
- Each scene must include:
  * Clear marketing objective (awareness/consideration/conversion)
  * Compelling dialogue with emotional triggers
  * Professional visual direction for video production
  * Strategic placement of key messages
  * Call-to-action elements where appropriate

**Content Guidelines:**
- Use active voice and action-oriented language
- Include specific benefits rather than features
- Address objections naturally within the script
- Create urgency and scarcity where appropriate for ${tone} tone
- Ensure consistent brand messaging throughout
- Optimize for ${selectedTemplate ? selectedTemplate.category : 'marketing'} goals

Format as JSON with this exact structure:
{
  "title": "Professional marketing video title optimized for engagement",
  "hook": "Compelling 3-5 second opening that immediately captures attention and addresses a key pain point or desire",
  "scenes": [
    {
      "title": "Descriptive scene name",
      "objective": "awareness|consideration|conversion",
      "description": "Clear description of what happens in this scene",
      "duration": "10s",
      "dialogue": "Compelling, persuasive dialogue that moves the viewer through the marketing funnel",
      "visuals": "Professional visual descriptions with specific camera angles, lighting, and production notes",
      "ctaElements": "Specific call-to-action elements, on-screen text, or interactive components"
    }
  ],
  "callToAction": "Strong, specific closing call-to-action with clear next steps",
  "keyMessages": ["Primary value proposition", "Key differentiator", "Emotional benefit"],
  "marketingNotes": {
    "targetPainPoints": ["Primary pain point addressed", "Secondary concern resolved"],
    "persuasionTechniques": ["Technique 1 used", "Technique 2 applied"],
    "brandingElements": "Key branding elements to emphasize"
  }
}`

      const response = await spark.llm(prompt, "gpt-4o", true)
      const scriptData = JSON.parse(response)
      
      // Create the enhanced video script object with professional marketing data
      const newScript: VideoScript = {
        id: Date.now().toString(),
        title: scriptData.title,
        topic,
        duration,
        audience: audience || "General business audience",
        tone,
        script: `${scriptData.hook}\n\n${scriptData.scenes.map((scene: any) => scene.dialogue).join('\n\n')}\n\n${scriptData.callToAction}`,
        scenes: scriptData.scenes.map((scene: any, index: number) => ({
          id: `scene-${index + 1}`,
          title: scene.title,
          description: scene.description,
          duration: scene.duration,
          dialogue: scene.dialogue,
          visuals: scene.visuals,
          objective: scene.objective || 'engagement',
          ctaElements: scene.ctaElements || ''
        })),
        createdAt: new Date().toISOString(),
        campaignType: selectedTemplate?.name || 'Custom Campaign',
        keyMessages: scriptData.keyMessages || [],
        marketingInsights: {
          targetPainPoints: scriptData.marketingNotes?.targetPainPoints || [],
          persuasionTechniques: scriptData.marketingNotes?.persuasionTechniques || [],
          brandingElements: scriptData.marketingNotes?.brandingElements || '',
          estimatedEngagement: selectedTemplate?.category === 'sales' ? 'high' : 
                             selectedTemplate?.category === 'awareness' ? 'medium' : 'high',
          recommendedPlatforms: getPlatformRecommendations(parseInt(duration), selectedTemplate?.category || 'awareness')
        }
      }

      setGeneratedScript(newScript)
      toast.success("Professional marketing script generated!", {
        description: `${selectedTemplate ? selectedTemplate.name : 'Custom'} campaign script ready for production.`
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

**Campaign Type:** ${generatedScript.campaignType || 'Custom'}
**Topic:** ${generatedScript.topic}
**Duration:** ${generatedScript.duration} seconds
**Target Audience:** ${generatedScript.audience}
**Tone:** ${generatedScript.tone}
**Created:** ${new Date(generatedScript.createdAt).toLocaleDateString()}

${generatedScript.keyMessages && generatedScript.keyMessages.length > 0 ? `
## Key Marketing Messages
${generatedScript.keyMessages.map(msg => `- ${msg}`).join('\n')}
` : ''}

## Complete Marketing Script
${generatedScript.script}

## Scene-by-Scene Production Guide
${generatedScript.scenes.map((scene, index) => `
### Scene ${index + 1}: ${scene.title}
**Duration:** ${scene.duration}
${scene.objective ? `**Marketing Objective:** ${scene.objective}` : ''}
**Description:** ${scene.description}

**Dialogue/Narration:**
${scene.dialogue}

**Visual Direction:**
${scene.visuals}

${scene.ctaElements ? `**Call-to-Action Elements:**
${scene.ctaElements}` : ''}
`).join('\n')}

---
*Generated by ContentFlow AI - Professional Marketing Video Script Generator*
`
    
    const blob = new Blob([scriptContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedScript.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-marketing-script.md`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Marketing script downloaded!", {
      description: "Complete production guide saved to your device."
    })
  }

  return (
    <div className="space-y-6">
      {/* Marketing Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning size={24} className="text-primary" />
            Professional Marketing Video Scripts
          </CardTitle>
          <CardDescription>
            Generate compelling video scripts optimized for different marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Campaign Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Script Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">Choose Your Marketing Campaign Type</h3>
                <p className="text-muted-foreground">Select a template optimized for your specific marketing goals</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {campaignTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary group relative overflow-hidden"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                          {template.icon}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs capitalize ${
                            template.category === 'sales' ? 'bg-green-100 text-green-800' :
                            template.category === 'awareness' ? 'bg-blue-100 text-blue-800' :
                            template.category === 'education' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors leading-tight">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 relative">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {template.suggestedDuration}s
                        </span>
                        <span className="capitalize font-medium">{template.suggestedTone}</span>
                      </div>
                      <div className="mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to use template →
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("custom")}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Create Custom Script
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              {/* Enhanced Generator Form */}
              <div className="space-y-6">
                {campaignType && (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      {campaignTemplates.find(t => t.id === campaignType)?.icon}
                      <h4 className="font-semibold text-primary">
                        {campaignTemplates.find(t => t.id === campaignType)?.name} Campaign
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaignTemplates.find(t => t.id === campaignType)?.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Video Topic / Campaign Message *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Launch our new eco-friendly product line"
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
                        <SelectItem value="15">15 seconds (TikTok/Instagram)</SelectItem>
                        <SelectItem value="30">30 seconds (Social Ads)</SelectItem>
                        <SelectItem value="60">1 minute (Standard)</SelectItem>
                        <SelectItem value="90">90 seconds (Detailed)</SelectItem>
                        <SelectItem value="120">2 minutes (Explainer)</SelectItem>
                        <SelectItem value="300">5 minutes (Tutorial)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Eco-conscious millennials, B2B decision makers"
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
                        <SelectItem value="professional">Professional & Authoritative</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="educational">Educational & Informative</SelectItem>
                        <SelectItem value="entertaining">Entertaining & Fun</SelectItem>
                        <SelectItem value="inspirational">Inspirational & Motivating</SelectItem>
                        <SelectItem value="urgent">Urgent & Action-Oriented</SelectItem>
                        <SelectItem value="authentic">Authentic & Personal</SelectItem>
                        <SelectItem value="persuasive">Persuasive & Sales-Focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Marketing-specific fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-service">Product/Service (Optional)</Label>
                    <Input
                      id="product-service"
                      placeholder="e.g., EcoClean All-Natural Detergent"
                      value={productService}
                      onChange={(e) => setProductService(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta">Desired Call-to-Action (Optional)</Label>
                    <Input
                      id="cta"
                      placeholder="e.g., Visit our website, Download the app"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benefits">Key Benefits/Features (Optional)</Label>
                  <Textarea
                    id="benefits"
                    placeholder="e.g., 100% natural ingredients, reduces plastic waste by 80%, saves money"
                    value={keyBenefits}
                    onChange={(e) => setKeyBenefits(e.target.value)}
                    rows={3}
                  />
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
                      Generating Marketing Script...
                    </>
                  ) : (
                    <>
                      <Sparkle size={20} className="mr-2" />
                      Generate Professional Marketing Script
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced Generated Script Display */}
      {generatedScript && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play size={20} className="text-accent" />
                  {generatedScript.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
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
                  {generatedScript.campaignType && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TrendUp size={14} />
                      {generatedScript.campaignType}
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
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
            {/* Marketing Insights */}
            {generatedScript.marketingInsights && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendUp size={18} className="text-primary" />
                  Marketing Performance Insights
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {generatedScript.marketingInsights.recommendedPlatforms && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">Recommended Platforms</h5>
                      <div className="flex flex-wrap gap-1">
                        {generatedScript.marketingInsights.recommendedPlatforms.map((platform, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">Engagement Prediction</h5>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        generatedScript.marketingInsights.estimatedEngagement === 'high' ? 'bg-green-500' :
                        generatedScript.marketingInsights.estimatedEngagement === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-sm capitalize font-medium">
                        {generatedScript.marketingInsights.estimatedEngagement} Engagement Expected
                      </span>
                    </div>
                  </div>
                </div>
                {generatedScript.marketingInsights.targetPainPoints && generatedScript.marketingInsights.targetPainPoints.length > 0 && (
                  <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">Target Pain Points Addressed</h5>
                    <div className="space-y-1">
                      {generatedScript.marketingInsights.targetPainPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Messages */}
            {generatedScript.keyMessages && generatedScript.keyMessages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-500" />
                  Key Marketing Messages
                </h4>
                <div className="grid md:grid-cols-3 gap-2">
                  {generatedScript.keyMessages.map((message, index) => (
                    <Badge key={index} variant="outline" className="p-2 text-center justify-center">
                      {message}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Full Script */}
            <div>
              <h4 className="font-semibold mb-2">Complete Marketing Script</h4>
              <div className="bg-muted p-4 rounded-lg">
                <div className="prose prose-sm max-w-none">
                  {generatedScript.script.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-foreground">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Enhanced Scene Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Scene-by-Scene Breakdown</h4>
              <div className="space-y-4">
                {generatedScript.scenes.map((scene, index) => (
                  <Card key={scene.id} className="border-l-4 border-l-accent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          Scene {index + 1}: {scene.title}
                          {scene.objective && (
                            <Badge variant="secondary" className="text-xs">
                              {scene.objective}
                            </Badge>
                          )}
                        </span>
                        <Badge variant="secondary">{scene.duration}</Badge>
                      </CardTitle>
                      <CardDescription>{scene.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Dialogue/Narration:</Label>
                        <p className="text-sm text-muted-foreground mt-1 bg-background p-3 rounded border">
                          {scene.dialogue}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Visual Direction:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{scene.visuals}</p>
                      </div>
                      {scene.ctaElements && (
                        <div>
                          <Label className="text-sm font-medium">Call-to-Action Elements:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{scene.ctaElements}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Saved Scripts */}
      {savedScripts && savedScripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video size={20} className="text-primary" />
              Script Library
            </CardTitle>
            <CardDescription>Your collection of professional marketing video scripts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedScripts.slice(0, 5).map((script) => (
                <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{script.title}</h4>
                      {script.campaignType && (
                        <Badge variant="secondary" className="text-xs">
                          {script.campaignType}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {script.topic} • {script.duration}s • {script.audience}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedScript(script)}
                    >
                      <Play size={14} className="mr-1" />
                      View
                    </Button>
                    {onCreateVideo && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-amber-600 border-amber-600 hover:bg-amber-50"
                        onClick={() => onCreateVideo(script)}
                      >
                        <Video size={14} className="mr-1" />
                        Create Video
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {savedScripts.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    And {savedScripts.length - 5} more scripts in your library
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}