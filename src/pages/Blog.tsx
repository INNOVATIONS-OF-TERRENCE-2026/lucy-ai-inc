import { SEOHead } from '@/components/seo/SEOHead';
import { StructuredData } from '@/components/seo/StructuredData';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      slug: 'introducing-lucy-ai',
      title: 'Introducing Lucy AI: Beyond Intelligence',
      excerpt: 'Meet Lucy AI, your advanced AI assistant with reasoning, vision, memory, and creativity.',
      date: '2024-01-20',
      readTime: '5 min read',
      category: 'Product',
      image: '/lucy-og-image.png'
    },
    {
      slug: 'advanced-reasoning-engine',
      title: 'How Lucy AI\'s Reasoning Engine Works',
      excerpt: 'Deep dive into our multi-step chain-of-thought analysis system that powers complex problem solving.',
      date: '2024-01-18',
      readTime: '8 min read',
      category: 'Technology',
      image: '/lucy-og-image.png'
    },
    {
      slug: 'multimodal-ai-capabilities',
      title: 'Vision and Multimodal AI: The Future is Here',
      excerpt: 'Learn how Lucy AI analyzes images, videos, and documents with cutting-edge AI technology.',
      date: '2024-01-15',
      readTime: '6 min read',
      category: 'Features',
      image: '/lucy-og-image.png'
    },
    {
      slug: 'building-with-lucy',
      title: 'Building AI-Powered Applications with Lucy',
      excerpt: 'A developer guide to integrating Lucy AI into your workflow with code execution and API access.',
      date: '2024-01-12',
      readTime: '10 min read',
      category: 'Developer',
      image: '/lucy-og-image.png'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Blog - Lucy AI | AI Insights, Tutorials, and Updates"
        description="Stay updated with Lucy AI's latest features, AI technology insights, tutorials, and product updates. Learn how to get the most out of your AI assistant."
        keywords="Lucy AI blog, AI insights, AI tutorials, AI technology, product updates, AI news"
        url="https://lucylounge.org/blog"
        canonical="https://lucylounge.org/blog"
      />
      <StructuredData 
        type="Blog"
        name="Lucy AI Blog"
        description="AI insights, product updates, and tutorials"
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
              Lucy AI Blog
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 text-shadow-soft">
              AI insights, product updates, and tutorials
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {blogPosts.map((post, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden bg-card/80 backdrop-blur-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <Badge className="mb-3">{post.category}</Badge>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto glass-card-enhanced p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/80 mb-6">
                Subscribe to our newsletter for the latest AI insights and product updates
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60"
                />
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Blog;
