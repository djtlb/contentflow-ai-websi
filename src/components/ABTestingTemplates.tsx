import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  TestTube, 
  Play, 
  ChartBar, 
  Target, 
  TrendUp, 
  Clock, 
  Users, 
  Eye,
  CursorClick,
  Lightning,
  Heart,
  Trophy,
  Lightbulb,
  CheckCircle,
  Copy,
  Download,
  Sparkle
} from "@phosphor-icons/react"
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

declare const spark: any

interface ABTestTemplate {
  id: string
  name: string
  category: string
  description: string
  approach: string
  targetAudience: string
  duration: string
  keyMetrics: string[]
  variations: {
    name: string
    description: string
    hook: string
    structure: string
    cta: string
    emotionalTrigger: string
    persuasionTechnique: string
  }[]
}

const predefinedTemplates: ABTestTemplate[] = [
  {
    id: 'emotion-vs-logic',
    name: 'Emotional vs. Logical Appeal',
    category: 'Persuasion Psychology',
    description: 'Test emotional storytelling against data-driven logical arguments',
    approach: 'Compare emotional resonance with rational decision-making triggers',
    targetAudience: 'B2B and B2C mixed demographics',
    duration: '60 seconds',
    keyMetrics: ['Click-through rate', 'Emotional engagement', 'Conversion rate', 'Time watched'],
    variations: [
      {
        name: 'Emotional Story (Version A)',
        description: 'Focus on customer success stories and emotional transformation',
        hook: 'Meet Sarah, who transformed her business in just 30 days...',
        structure: 'Story → Problem → Emotional transformation → Solution reveal → CTA',
        cta: 'Start your success story today',
        emotionalTrigger: 'Hope, aspiration, social proof',
        persuasionTechnique: 'Narrative transportation, social proof'
      },
      {
        name: 'Data-Driven Logic (Version B)',
        description: 'Emphasize statistics, ROI, and logical benefits',
        hook: '73% increase in productivity. 45% cost reduction. Proven results.',
        structure: 'Statistics → Problem → Data presentation → ROI demonstration → CTA',
        cta: 'See the numbers for yourself',
        emotionalTrigger: 'Trust, security, confidence',
        persuasionTechnique: 'Authority, evidence-based persuasion'
      }
    ]
  },
  {
    id: 'urgency-vs-value',
    name: 'Urgency vs. Value Proposition',
    category: 'Motivation Drivers',
    description: 'Compare time-sensitive offers with long-term value messaging',
    approach: 'Test scarcity/urgency against comprehensive value communication',
    targetAudience: 'Price-conscious consumers and business decision makers',
    duration: '45 seconds',
    keyMetrics: ['Immediate conversions', 'Cart abandonment', 'Long-term retention', 'Price sensitivity'],
    variations: [
      {
        name: 'Limited Time Urgency (Version A)',
        description: 'Create immediate action through scarcity and time pressure',
        hook: 'Only 48 hours left! Don\'t miss this exclusive opportunity...',
        structure: 'Urgency statement → Limited availability → Quick benefits → Countdown → CTA',
        cta: 'Claim your spot now - ends soon!',
        emotionalTrigger: 'FOMO, urgency, exclusivity',
        persuasionTechnique: 'Scarcity principle, loss aversion'
      },
      {
        name: 'Comprehensive Value (Version B)',
        description: 'Demonstrate long-term benefits and comprehensive value',
        hook: 'Discover why industry leaders choose us for lasting results...',
        structure: 'Value proposition → Multiple benefits → ROI demonstration → Testimonials → CTA',
        cta: 'Invest in your long-term success',
        emotionalTrigger: 'Security, growth, achievement',
        persuasionTechnique: 'Value-based selling, authority positioning'
      }
    ]
  },
  {
    id: 'problem-vs-solution',
    name: 'Problem-First vs. Solution-First',
    category: 'Content Structure',
    description: 'Test leading with pain points versus leading with solutions',
    approach: 'Compare problem agitation with immediate solution presentation',
    targetAudience: 'B2B software users and service seekers',
    duration: '75 seconds',
    keyMetrics: ['Problem recognition', 'Solution clarity', 'Engagement depth', 'Purchase intent'],
    variations: [
      {
        name: 'Problem Agitation (Version A)',
        description: 'Start by highlighting and amplifying existing pain points',
        hook: 'Tired of losing customers to slow response times?',
        structure: 'Problem identification → Pain amplification → Consequences → Solution reveal → CTA',
        cta: 'Stop losing customers today',
        emotionalTrigger: 'Frustration, urgency, relief',
        persuasionTechnique: 'Problem agitation, pain point focus'
      },
      {
        name: 'Solution Showcase (Version B)',
        description: 'Lead with the solution and its immediate benefits',
        hook: 'Respond to customers 10x faster with our AI-powered system...',
        structure: 'Solution presentation → Benefits demonstration → Use cases → Results → CTA',
        cta: 'Experience faster results now',
        emotionalTrigger: 'Excitement, possibility, efficiency',
        persuasionTechnique: 'Benefit-focused, solution orientation'
      }
    ]
  },
  {
    id: 'social-proof-types',
    name: 'Expert vs. Peer Social Proof',
    category: 'Social Validation',
    description: 'Compare authority endorsements with peer testimonials',
    approach: 'Test expert authority against relatable peer experiences',
    targetAudience: 'Professional services and consumer products',
    duration: '50 seconds',
    keyMetrics: ['Trust indicators', 'Credibility perception', 'Relatability score', 'Conversion lift'],
    variations: [
      {
        name: 'Expert Authority (Version A)',
        description: 'Feature industry experts, certifications, and professional endorsements',
        hook: 'Trusted by Fortune 500 CEOs and industry leaders worldwide...',
        structure: 'Expert endorsement → Credentials → Authority proof → Results → CTA',
        cta: 'Join the industry leaders',
        emotionalTrigger: 'Trust, prestige, authority',
        persuasionTechnique: 'Authority principle, expert positioning'
      },
      {
        name: 'Peer Testimonials (Version B)',
        description: 'Showcase relatable customer stories and peer experiences',
        hook: 'Real customers, real results - hear from people just like you...',
        structure: 'Peer introduction → Relatable challenges → Personal success → Community → CTA',
        cta: 'Join thousands like you',
        emotionalTrigger: 'Belonging, relatability, community',
        persuasionTechnique: 'Social proof, peer influence'
      }
    ]
  },
  {
    id: 'length-comparison',
    name: 'Short-Form vs. Long-Form',
    category: 'Content Length',
    description: 'Test concise messaging against detailed explanations',
    approach: 'Compare attention-grabbing brevity with comprehensive information',
    targetAudience: 'Multi-platform audiences with varying attention spans',
    duration: 'Variable (30s vs 90s)',
    keyMetrics: ['Completion rate', 'Information retention', 'Action rate', 'Platform performance'],
    variations: [
      {
        name: 'Quick Impact (Version A - 30s)',
        description: 'Deliver core message in high-impact, condensed format',
        hook: 'Transform your business in 3 simple steps...',
        structure: 'Hook → Core benefit → Quick proof → Immediate CTA',
        cta: 'Get started in 2 minutes',
        emotionalTrigger: 'Simplicity, speed, instant gratification',
        persuasionTechnique: 'Simplification, immediate value'
      },
      {
        name: 'Detailed Explanation (Version B - 90s)',
        description: 'Provide comprehensive information and build trust through detail',
        hook: 'Here\'s exactly how we help businesses like yours succeed...',
        structure: 'Detailed hook → Problem exploration → Solution explanation → Proof points → Detailed CTA',
        cta: 'Schedule a detailed consultation',
        emotionalTrigger: 'Understanding, confidence, thoroughness',
        persuasionTechnique: 'Information-based trust, detailed proof'
      }
    ]
  },
  {
    id: 'visual-style',
    name: 'Animated vs. Live Action',
    category: 'Visual Approach',
    description: 'Compare animated explanations with real person presentations',
    approach: 'Test visual engagement styles and authenticity perception',
    targetAudience: 'Tech-savvy and traditional audiences',
    duration: '60 seconds',
    keyMetrics: ['Visual engagement', 'Message clarity', 'Brand perception', 'Authenticity rating'],
    variations: [
      {
        name: 'Animated Explanation (Version A)',
        description: 'Use engaging animations to explain complex concepts simply',
        hook: 'Watch how our solution works in action...',
        structure: 'Animated hook → Visual problem demo → Animated solution → Results visualization → CTA',
        cta: 'See it in action for yourself',
        emotionalTrigger: 'Curiosity, clarity, engagement',
        persuasionTechnique: 'Visual learning, simplification'
      },
      {
        name: 'Personal Presentation (Version B)',
        description: 'Feature real people delivering authentic, personal messages',
        hook: 'Hi, I\'m [Name], and I want to share something important with you...',
        structure: 'Personal introduction → Authentic story → Direct communication → Personal guarantee → CTA',
        cta: 'Let me help you succeed',
        emotionalTrigger: 'Trust, authenticity, personal connection',
        persuasionTechnique: 'Personal authority, authenticity'
      }
    ]
  }
]

export function ABTestingTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ABTestTemplate | null>(null)
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    category: '',
    description: '',
    approach: '',
    targetAudience: '',
    duration: '',
    productName: '',
    keyBenefit: '',
    targetAction: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScripts, setGeneratedScripts] = useState<any>(null)
  const [savedTests, setSavedTests] = useKV<any[]>('ab-test-campaigns', [])

  const generateABTestScripts = async (template: ABTestTemplate, customInputs?: any) => {
    setIsGenerating(true)
    
    try {
      const productInfo = customInputs ? `
Product/Service: ${customInputs.productName}
Key Benefit: ${customInputs.keyBenefit}
Target Action: ${customInputs.targetAction}
` : 'Use the template context for product details'

      const prompt = spark.llmPrompt`Generate comprehensive A/B test video scripts based on this template:

Template: ${template.name}
Category: ${template.category}
Description: ${template.description}
Test Approach: ${template.approach}
Target Audience: ${template.targetAudience}
Duration: ${template.duration}

${productInfo}

Create two complete video scripts for A/B testing with these variations:

Variation A: ${template.variations[0].name}
- Description: ${template.variations[0].description}
- Hook Style: ${template.variations[0].hook}
- Structure: ${template.variations[0].structure}
- CTA Style: ${template.variations[0].cta}
- Emotional Trigger: ${template.variations[0].emotionalTrigger}
- Persuasion Technique: ${template.variations[0].persuasionTechnique}

Variation B: ${template.variations[1].name}
- Description: ${template.variations[1].description}
- Hook Style: ${template.variations[1].hook}
- Structure: ${template.variations[1].structure}
- CTA Style: ${template.variations[1].cta}
- Emotional Trigger: ${template.variations[1].emotionalTrigger}
- Persuasion Technique: ${template.variations[1].persuasionTechnique}

For each variation, create:
1. Complete video script with scene-by-scene breakdown
2. Key messaging points
3. Visual direction notes
4. Performance prediction
5. Recommended metrics to track
6. Expected audience reactions

Make the scripts professional, persuasive, and optimized for A/B testing insights.

Return as JSON:
{
  "testName": "Descriptive A/B test name",
  "testObjective": "What this test aims to discover",
  "expectedInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendedMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "variationA": {
    "name": "Version A name",
    "hypothesis": "What we expect this version to achieve",
    "fullScript": "Complete video script with timing",
    "keyMessages": ["Message 1", "Message 2"],
    "visualNotes": "Visual direction and production notes",
    "expectedPerformance": "Performance prediction",
    "audienceReaction": "Expected audience response"
  },
  "variationB": {
    "name": "Version B name", 
    "hypothesis": "What we expect this version to achieve",
    "fullScript": "Complete video script with timing",
    "keyMessages": ["Message 1", "Message 2"],
    "visualNotes": "Visual direction and production notes",
    "expectedPerformance": "Performance prediction",
    "audienceReaction": "Expected audience response"
  },
  "testingRecommendations": {
    "sampleSize": "Recommended audience size",
    "duration": "How long to run test",
    "platforms": ["Platform 1", "Platform 2"],
    "successCriteria": "How to determine winner"
  }
}`

      const response = await spark.llm(prompt, "gpt-4o", true)
      const scripts = JSON.parse(response)
      setGeneratedScripts(scripts)
      
      toast.success("A/B test scripts generated!", {
        description: "Professional video scripts ready for testing"
      })
    } catch (error) {
      console.error('A/B test generation failed:', error)
      toast.error("Generation failed", {
        description: "Please try again with different inputs"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveABTest = async (scripts: any) => {
    const testCampaign = {
      id: Date.now().toString(),
      name: scripts.testName,
      template: selectedTemplate?.name,
      createdAt: new Date().toISOString(),
      scripts: scripts,
      status: 'draft'
    }
    
    setSavedTests((current) => [...(current || []), testCampaign])
    toast.success("A/B test saved!", {
      description: "Campaign saved to your test library"
    })
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <TestTube size={24} className="text-accent" />
          A/B Testing Templates
        </h2>
        <p className="text-muted-foreground">
          Create data-driven video campaigns with professional A/B testing frameworks
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="custom">Custom A/B Test</TabsTrigger>
          <TabsTrigger value="saved">Saved Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {predefinedTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Target Audience:</span>
                        <p className="text-muted-foreground">{template.targetAudience}</p>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p className="text-muted-foreground">{template.duration}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">Key Metrics:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.keyMetrics.map((metric, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {template.variations.map((variation, idx) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">{variation.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{variation.description}</p>
                          <div className="space-y-1 text-xs">
                            <div><span className="font-medium">Hook:</span> {variation.hook}</div>
                            <div><span className="font-medium">Trigger:</span> {variation.emotionalTrigger}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Eye size={14} className="mr-1" />
                            Preview Template
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{template.name}</DialogTitle>
                            <DialogDescription>{template.description}</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Test Approach</Label>
                                <p className="text-sm text-muted-foreground">{template.approach}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Target Audience</Label>
                                <p className="text-sm text-muted-foreground">{template.targetAudience}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold">Test Variations</h3>
                              {template.variations.map((variation, idx) => (
                                <Card key={idx}>
                                  <CardHeader>
                                    <CardTitle className="text-base">{variation.name}</CardTitle>
                                    <CardDescription>{variation.description}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Hook Style:</span>
                                        <p className="text-muted-foreground italic">"{variation.hook}"</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">CTA Style:</span>
                                        <p className="text-muted-foreground italic">"{variation.cta}"</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Emotional Trigger:</span>
                                        <p className="text-muted-foreground">{variation.emotionalTrigger}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Persuasion Technique:</span>
                                        <p className="text-muted-foreground">{variation.persuasionTechnique}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">Content Structure:</span>
                                      <p className="text-muted-foreground text-sm">{variation.structure}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            <Button 
                              onClick={() => generateABTestScripts(template)}
                              disabled={isGenerating}
                              className="w-full"
                            >
                              {isGenerating ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Generating A/B Test Scripts...
                                </>
                              ) : (
                                <>
                                  <Sparkle size={16} className="mr-2" />
                                  Generate A/B Test Scripts
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm"
                        onClick={() => generateABTestScripts(template)}
                        disabled={isGenerating}
                      >
                        <Play size={14} className="mr-1" />
                        Generate Scripts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom A/B Test</CardTitle>
              <CardDescription>
                Design your own A/B testing approach with specific parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testName">Test Name</Label>
                  <Input 
                    id="testName"
                    placeholder="e.g., Feature vs Benefit Focus"
                    value={customTemplate.name}
                    onChange={(e) => setCustomTemplate(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={customTemplate.category} 
                    onValueChange={(value) => setCustomTemplate(prev => ({...prev, category: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persuasion">Persuasion Psychology</SelectItem>
                      <SelectItem value="content">Content Structure</SelectItem>
                      <SelectItem value="emotion">Emotional Triggers</SelectItem>
                      <SelectItem value="visual">Visual Approach</SelectItem>
                      <SelectItem value="timing">Timing & Duration</SelectItem>
                      <SelectItem value="cta">Call-to-Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Test Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe what this A/B test aims to discover..."
                  value={customTemplate.description}
                  onChange={(e) => setCustomTemplate(prev => ({...prev, description: e.target.value}))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="productName">Product/Service</Label>
                  <Input 
                    id="productName"
                    placeholder="Your product name"
                    value={customTemplate.productName}
                    onChange={(e) => setCustomTemplate(prev => ({...prev, productName: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="keyBenefit">Key Benefit</Label>
                  <Input 
                    id="keyBenefit"
                    placeholder="Main value proposition"
                    value={customTemplate.keyBenefit}
                    onChange={(e) => setCustomTemplate(prev => ({...prev, keyBenefit: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="targetAction">Target Action</Label>
                  <Input 
                    id="targetAction"
                    placeholder="Desired user action"
                    value={customTemplate.targetAction}
                    onChange={(e) => setCustomTemplate(prev => ({...prev, targetAction: e.target.value}))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input 
                    id="audience"
                    placeholder="e.g., B2B decision makers"
                    value={customTemplate.targetAudience}
                    onChange={(e) => setCustomTemplate(prev => ({...prev, targetAudience: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Video Duration</Label>
                  <Select 
                    value={customTemplate.duration} 
                    onValueChange={(value) => setCustomTemplate(prev => ({...prev, duration: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 seconds">30 seconds</SelectItem>
                      <SelectItem value="45 seconds">45 seconds</SelectItem>
                      <SelectItem value="60 seconds">60 seconds</SelectItem>
                      <SelectItem value="90 seconds">90 seconds</SelectItem>
                      <SelectItem value="120 seconds">2 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="approach">Testing Approach</Label>
                <Textarea 
                  id="approach"
                  placeholder="Describe how the two variations will differ (e.g., Version A focuses on problem agitation while Version B leads with solution benefits)"
                  value={customTemplate.approach}
                  onChange={(e) => setCustomTemplate(prev => ({...prev, approach: e.target.value}))}
                />
              </div>

              <Button 
                onClick={() => {
                  // Create a temporary template for custom generation
                  const customTestTemplate: ABTestTemplate = {
                    id: 'custom',
                    name: customTemplate.name || 'Custom A/B Test',
                    category: customTemplate.category || 'Custom',
                    description: customTemplate.description || 'Custom A/B test',
                    approach: customTemplate.approach || 'Custom testing approach',
                    targetAudience: customTemplate.targetAudience || 'Target audience',
                    duration: customTemplate.duration || '60 seconds',
                    keyMetrics: ['Conversion rate', 'Engagement', 'Click-through rate'],
                    variations: [
                      {
                        name: 'Version A',
                        description: 'First variation approach',
                        hook: 'Version A hook style',
                        structure: 'Version A structure',
                        cta: 'Version A call-to-action',
                        emotionalTrigger: 'Version A emotional approach',
                        persuasionTechnique: 'Version A persuasion method'
                      },
                      {
                        name: 'Version B',
                        description: 'Second variation approach',
                        hook: 'Version B hook style', 
                        structure: 'Version B structure',
                        cta: 'Version B call-to-action',
                        emotionalTrigger: 'Version B emotional approach',
                        persuasionTechnique: 'Version B persuasion method'
                      }
                    ]
                  }
                  generateABTestScripts(customTestTemplate, customTemplate)
                }}
                disabled={isGenerating || !customTemplate.name || !customTemplate.productName}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Custom A/B Test...
                  </>
                ) : (
                  <>
                    <TestTube size={16} className="mr-2" />
                    Generate Custom A/B Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedTests && savedTests.length > 0 ? (
            <div className="grid gap-4">
              {(savedTests || []).map((test: any) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <CardDescription>
                          Created {new Date(test.createdAt).toLocaleDateString()} • Template: {test.template}
                        </CardDescription>
                      </div>
                      <Badge variant={test.status === 'draft' ? 'secondary' : 'default'}>
                        {test.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye size={14} className="mr-1" />
                            View Scripts
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{test.scripts?.testName}</DialogTitle>
                            <DialogDescription>{test.scripts?.testObjective}</DialogDescription>
                          </DialogHeader>
                          {test.scripts && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base text-green-600">
                                      {test.scripts.variationA?.name}
                                    </CardTitle>
                                    <CardDescription>{test.scripts.variationA?.hypothesis}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <Label className="font-medium">Full Script:</Label>
                                      <div className="bg-muted p-3 rounded text-sm max-h-48 overflow-y-auto">
                                        {test.scripts.variationA?.fullScript}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Key Messages:</Label>
                                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                                        {test.scripts.variationA?.keyMessages?.map((msg: string, idx: number) => (
                                          <li key={idx}>{msg}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => copyToClipboard(test.scripts.variationA?.fullScript)}
                                    >
                                      <Copy size={12} className="mr-1" />
                                      Copy Script
                                    </Button>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base text-blue-600">
                                      {test.scripts.variationB?.name}
                                    </CardTitle>
                                    <CardDescription>{test.scripts.variationB?.hypothesis}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <Label className="font-medium">Full Script:</Label>
                                      <div className="bg-muted p-3 rounded text-sm max-h-48 overflow-y-auto">
                                        {test.scripts.variationB?.fullScript}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Key Messages:</Label>
                                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                                        {test.scripts.variationB?.keyMessages?.map((msg: string, idx: number) => (
                                          <li key={idx}>{msg}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => copyToClipboard(test.scripts.variationB?.fullScript)}
                                    >
                                      <Copy size={12} className="mr-1" />
                                      Copy Script
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>

                              {test.scripts.testingRecommendations && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">Testing Recommendations</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Sample Size:</span>
                                        <p className="text-muted-foreground">{test.scripts.testingRecommendations.sampleSize}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Test Duration:</span>
                                        <p className="text-muted-foreground">{test.scripts.testingRecommendations.duration}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Platforms:</span>
                                        <p className="text-muted-foreground">{test.scripts.testingRecommendations.platforms?.join(', ')}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Success Criteria:</span>
                                        <p className="text-muted-foreground">{test.scripts.testingRecommendations.successCriteria}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <ChartBar size={14} className="mr-1" />
                        View Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TestTube size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Saved A/B Tests</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first A/B test to start optimizing your video campaigns
                </p>
                <Button onClick={() => {
                  const tabsElement = document.querySelector('[value="templates"]') as HTMLButtonElement
                  if (tabsElement) tabsElement.click()
                }}>
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Generated Scripts Display */}
      {generatedScripts && (
        <Dialog open={!!generatedScripts} onOpenChange={() => setGeneratedScripts(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy size={24} className="text-accent" />
                {generatedScripts.testName}
              </DialogTitle>
              <DialogDescription>{generatedScripts.testObjective}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Test Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expected Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {generatedScripts.expectedInsights?.map((insight: string, idx: number) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Variations Comparison */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-green-600 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {generatedScripts.variationA?.name}
                    </CardTitle>
                    <CardDescription>{generatedScripts.variationA?.hypothesis}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Full Script:</Label>
                      <div className="bg-muted p-3 rounded text-sm max-h-64 overflow-y-auto">
                        {generatedScripts.variationA?.fullScript}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Key Messages:</Label>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {generatedScripts.variationA?.keyMessages?.map((msg: string, idx: number) => (
                          <li key={idx}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="font-medium">Expected Performance:</Label>
                      <p className="text-sm text-muted-foreground">{generatedScripts.variationA?.expectedPerformance}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(generatedScripts.variationA?.fullScript)}
                    >
                      <Copy size={12} className="mr-1" />
                      Copy Script A
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-blue-600 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {generatedScripts.variationB?.name}
                    </CardTitle>
                    <CardDescription>{generatedScripts.variationB?.hypothesis}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Full Script:</Label>
                      <div className="bg-muted p-3 rounded text-sm max-h-64 overflow-y-auto">
                        {generatedScripts.variationB?.fullScript}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Key Messages:</Label>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {generatedScripts.variationB?.keyMessages?.map((msg: string, idx: number) => (
                          <li key={idx}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="font-medium">Expected Performance:</Label>
                      <p className="text-sm text-muted-foreground">{generatedScripts.variationB?.expectedPerformance}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(generatedScripts.variationB?.fullScript)}
                    >
                      <Copy size={12} className="mr-1" />
                      Copy Script B
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Testing Recommendations */}
              {generatedScripts.testingRecommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Testing Setup & Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Sample Size:</span>
                        <p className="text-muted-foreground">{generatedScripts.testingRecommendations.sampleSize}</p>
                      </div>
                      <div>
                        <span className="font-medium">Test Duration:</span>
                        <p className="text-muted-foreground">{generatedScripts.testingRecommendations.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium">Recommended Platforms:</span>
                        <p className="text-muted-foreground">{generatedScripts.testingRecommendations.platforms?.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Success Criteria:</span>
                        <p className="text-muted-foreground">{generatedScripts.testingRecommendations.successCriteria}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => saveABTest(generatedScripts)}
                >
                  <Download size={16} className="mr-2" />
                  Save A/B Test
                </Button>
                <Button onClick={() => setGeneratedScripts(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}