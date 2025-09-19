import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Lightning, ChartBar, Users, ArrowRight, Sparkle, Target, Clock, TrendUp } from "@phosphor-icons/react"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain size={32} weight="bold" className="text-primary" />
              <span className="text-xl font-bold">ContentFlow AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkle size={16} className="mr-2" />
            Powered by Advanced AI
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Transform Your Content Creation Workflow
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            ContentFlow AI empowers creators with intelligent tools to generate, optimize, and manage content at scale. 
            From ideation to publication, streamline every step of your content journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Start Creating Free
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          
          {/* Demo Content Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Lightning size={24} className="text-accent" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate high-quality content in seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your topic: 'sustainable technology trends'" 
                  className="flex-1"
                />
                <Button>Generate</Button>
              </div>
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="text-sm text-muted-foreground mb-2">Generated Content Preview:</p>
                <p className="text-foreground">
                  "Sustainable technology is reshaping industries worldwide, from renewable energy solutions 
                  to eco-friendly manufacturing processes. As businesses prioritize environmental responsibility..."
                </p>
              </div>
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
                <CardTitle>AI Content Generation</CardTitle>
                <CardDescription>
                  Generate blog posts, social media content, headlines, and copy with advanced AI models
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

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <TrendUp size={48} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Stay ahead with AI-powered trend detection and content recommendations
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
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already using ContentFlow AI to scale their content production
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Schedule Demo
            </Button>
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
                Intelligent content creation platform powered by advanced AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
                <div>Integrations</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Status</div>
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
    </div>
  )
}

export default App