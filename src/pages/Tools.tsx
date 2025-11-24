import { SEOHead } from '@/components/seo/SEOHead';
import { StructuredData } from '@/components/seo/StructuredData';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, FileText, Globe, Image, Calculator, Code, Database, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Tools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    {
      id: 'pdf-extractor',
      name: 'PDF Text Extractor',
      description: 'Extract and analyze text from PDF documents',
      icon: FileText,
      category: 'Document',
      free: true
    },
    {
      id: 'website-summarizer',
      name: 'Website Summarizer',
      description: 'Fetch and summarize any website content',
      icon: Globe,
      category: 'Web',
      free: true
    },
    {
      id: 'image-caption',
      name: 'Image Captioning',
      description: 'Generate captions and analyze images',
      icon: Image,
      category: 'Vision',
      free: false
    },
    {
      id: 'calculator',
      name: 'Math Calculator',
      description: 'Evaluate mathematical expressions safely',
      icon: Calculator,
      category: 'Utility',
      free: true
    },
    {
      id: 'html-cleaner',
      name: 'HTML to Text',
      description: 'Clean HTML and extract plain text',
      icon: Code,
      category: 'Developer',
      free: true
    },
    {
      id: 'data-analyzer',
      name: 'Data Table Analyzer',
      description: 'Analyze CSV and structured data',
      icon: Database,
      category: 'Data',
      free: true
    },
    {
      id: 'code-runner',
      name: 'Code Executor',
      description: 'Run Python and JavaScript code securely',
      icon: Sparkles,
      category: 'Developer',
      free: false
    },
    {
      id: 'web-fetch',
      name: 'Safe Web Fetcher',
      description: 'Fetch and test web endpoints',
      icon: Globe,
      category: 'Developer',
      free: true
    }
  ];

  const categories = ['All', 'Document', 'Web', 'Vision', 'Utility', 'Developer', 'Data'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead 
        title="AI Tools - Lucy AI | Free AI-Powered Tools & Utilities"
        description="Access Lucy AI's suite of free AI tools: PDF reader, image analysis, code execution, web scraper, data analyzer, and more. Powered by advanced AI."
        keywords="free AI tools, AI utilities, PDF reader AI, image analysis AI, code execution online, web scraper AI, AI toolkit"
        image="/og-tools.png"
        url="https://lucylounge.org/tools"
        canonical="https://lucylounge.org/tools"
      />
      <StructuredData 
        type="CollectionPage"
        name="Lucy AI Tools"
        description="Internal AI tools powered by Lovable Cloud"
      />
      
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Hero Section */}
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow-strong">
              Lucy Tools
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 text-shadow-soft">
              Powerful internal tools powered by Lovable AI. No external APIs required.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={selectedCategory === category ? '' : 'border-white text-white hover:bg-white/10'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card 
                    key={tool.id}
                    className="p-6 bg-card/80 backdrop-blur-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate('/chat')}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={tool.free ? 'default' : 'secondary'}>
                        {tool.free ? 'Free' : 'Pro'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <Badge variant="outline">{tool.category}</Badge>
                  </Card>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/80 text-lg">No tools found matching your search</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto glass-card-enhanced p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Use Lucy Tools?
              </h2>
              <p className="text-white/80 mb-6">
                Access all tools directly in chat. Simply start a conversation and mention the tool you want to use.
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 font-semibold"
                onClick={() => navigate('/chat')}
              >
                Start Using Tools
              </Button>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Tools;
