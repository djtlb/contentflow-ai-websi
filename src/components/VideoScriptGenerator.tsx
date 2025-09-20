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
  Trophy
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

  // Marketing campaign templates
  const campaignTemplates: CampaignTemplate[] = [
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Introduce new products with excitement and clear value propositions',
      icon: <Sparkle size={20} className="text-yellow-500" />,
      category: 'awareness',
      suggestedDuration: '60',
      suggestedTone: 'exciting',
      promptTemplate: 'Create a product launch video script that builds excitement and clearly communicates the unique value proposition'
    },
    {
      id: 'brand-story',
      name: 'Brand Storytelling',
      description: 'Share your brand\'s mission, values, and journey',
      icon: <Heart size={20} className="text-pink-500" />,
      category: 'awareness',
      suggestedDuration: '120',
      suggestedTone: 'inspirational',
      promptTemplate: 'Develop a compelling brand story that connects emotionally with viewers and communicates core values'
    },
    {
      id: 'sales-conversion',
      name: 'Sales & Conversion',
      description: 'Drive immediate action and conversions',
      icon: <ShoppingBag size={20} className="text-green-500" />,
      category: 'sales',
      suggestedDuration: '45',
      suggestedTone: 'persuasive',
      promptTemplate: 'Create a high-converting sales script that addresses pain points and drives immediate action'
    },
    {
      id: 'social-proof',
      name: 'Social Proof & Testimonials',
      description: 'Leverage customer success stories and reviews',
      icon: <Star size={20} className="text-blue-500" />,
      category: 'sales',
      suggestedDuration: '90',
      suggestedTone: 'authentic',
      promptTemplate: 'Build a testimonial-focused script that showcases real customer success and builds trust'
    },
    {
      id: 'how-to-tutorial',
      name: 'How-To & Tutorial',
      description: 'Educational content that provides value to viewers',
      icon: <Lightbulb size={20} className="text-orange-500" />,
      category: 'education',
      suggestedDuration: '180',
      suggestedTone: 'educational',
      promptTemplate: 'Create a step-by-step tutorial that educates viewers while subtly promoting your solution'
    },
    {
      id: 'comparison',
      name: 'Competitive Comparison',
      description: 'Highlight advantages over competitors',
      icon: <Trophy size={20} className="text-purple-500" />,
      category: 'sales',
      suggestedDuration: '75',
      suggestedTone: 'professional',
      promptTemplate: 'Develop a comparison script that professionally highlights competitive advantages'
    },
    {
      id: 'behind-scenes',
      name: 'Behind The Scenes',
      description: 'Show the human side of your business',
      icon: <Users size={20} className="text-cyan-500" />,
      category: 'engagement',
      suggestedDuration: '90',
      suggestedTone: 'casual',
      promptTemplate: 'Create an authentic behind-the-scenes script that humanizes your brand'
    },
    {
      id: 'announcement',
      name: 'Company Announcement',
      description: 'Share important company news and updates',
      icon: <Megaphone size={20} className="text-red-500" />,
      category: 'awareness',
      suggestedDuration: '60',
      suggestedTone: 'professional',
      promptTemplate: 'Craft a clear and engaging announcement that communicates important company news'
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
      
      // Enhanced prompt for marketing campaigns
      const prompt = spark.llmPrompt`Generate a comprehensive marketing video script with the following requirements:

**Campaign Details:**
Topic: ${topic}
Campaign Type: ${selectedTemplate ? selectedTemplate.name : 'Custom'}
Duration: ${duration} seconds
Target Audience: ${audience || "General audience"}
Tone: ${tone}

**Marketing Focus:**
${productService ? `Product/Service: ${productService}` : ''}
${keyBenefits ? `Key Benefits: ${keyBenefits}` : ''}
${callToAction ? `Desired Action: ${callToAction}` : ''}

**Template Context:**
${selectedTemplate ? selectedTemplate.promptTemplate : 'Create a compelling marketing video script'}

Create a marketing-focused video script with the following structure:
1. A compelling, attention-grabbing title
2. An engaging hook (first 3-5 seconds)
3. 4-6 scenes that fit within the ${duration} second duration
4. For each scene, provide:
   - Scene title
   - Marketing objective (awareness, consideration, conversion)
   - Description of what happens
   - Estimated duration (distribute across ${duration} seconds total)
   - Dialogue/narration text (compelling and persuasive)
   - Visual descriptions optimized for ${selectedTemplate ? selectedTemplate.category : 'marketing'} content
   - Call-to-action elements where appropriate

**Marketing Requirements:**
- Focus on customer benefits and value proposition
- Include emotional triggers appropriate for the target audience
- Maintain consistent brand messaging throughout
- Optimize for the specified campaign type
- Include clear next steps for viewers

The script should be professional, engaging, and designed to drive specific marketing outcomes.

Format the response as JSON with this structure:
{
  "title": "Compelling Marketing Video Title",
  "hook": "Attention-grabbing opening (3-5 seconds)",
  "scenes": [
    {
      "title": "Scene Name",
      "objective": "Marketing objective (awareness/consideration/conversion)",
      "description": "What happens in this scene",
      "duration": "10s",
      "dialogue": "Persuasive dialogue/narration for this scene",
      "visuals": "Marketing-optimized visual descriptions and camera directions",
      "ctaElements": "Any call-to-action elements in this scene"
    }
  ],
  "callToAction": "Strong closing call to action",
  "keyMessages": ["Main message 1", "Main message 2", "Main message 3"]
}`

      const response = await spark.llm(prompt, "gpt-4o", true)
      const scriptData = JSON.parse(response)
      
      // Create the enhanced video script object
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
          visuals: scene.visuals,
          objective: scene.objective || 'engagement',
          ctaElements: scene.ctaElements || ''
        })),
        createdAt: new Date().toISOString(),
        campaignType: selectedTemplate?.name || 'Custom',
        keyMessages: scriptData.keyMessages || []
      }

      setGeneratedScript(newScript)
      toast.success("Marketing video script generated!", {
        description: "Your professional marketing script is ready for production."
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
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {campaignTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        {template.icon}
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {template.suggestedDuration}s
                        </span>
                        <span className="capitalize">{template.suggestedTone}</span>
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