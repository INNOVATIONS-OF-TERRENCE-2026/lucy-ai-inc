import { useState } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, Sparkles, Instagram, Twitter, Video, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CreatorStudio = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [contentType, setContentType] = useState<'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'hashtags'>('instagram');

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const prompts = {
        instagram: `Create an engaging Instagram caption for: ${topic}. Include emojis, call-to-action, and 3-5 relevant hashtags.`,
        twitter: `Create a viral Twitter thread (5-7 tweets) about: ${topic}. Make it educational and engaging.`,
        tiktok: `Create a TikTok script with hook, body, and CTA for: ${topic}. Include on-screen text suggestions.`,
        youtube: `Create a YouTube Shorts script (under 60 seconds) about: ${topic}. Include hook, value, and strong CTA.`,
        hashtags: `Generate 20 trending hashtags for: ${topic}. Mix popular and niche tags.`
      };

      const { data, error } = await supabase.functions.invoke('chat-stream', {
        body: {
          messages: [
            { role: 'user', content: prompts[contentType] }
          ],
          stream: false
        }
      });

      if (error) throw error;

      setOutput(data.content || 'No content generated');
      toast.success('Content generated!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const contentTypes = [
    { id: 'instagram' as const, name: 'Instagram Caption', icon: Instagram },
    { id: 'twitter' as const, name: 'Twitter Thread', icon: Twitter },
    { id: 'tiktok' as const, name: 'TikTok Script', icon: Video },
    { id: 'youtube' as const, name: 'YouTube Short', icon: Video },
    { id: 'hashtags' as const, name: 'Trending Hashtags', icon: Hash }
  ];

  return (
    <>
      <SEOHead 
        title="Creator Studio - Lucy AI | AI Social Media Content Generator"
        description="Generate viral social media content with Lucy AI. Create Instagram captions, Twitter threads, TikTok scripts, YouTube shorts, and trending hashtags in seconds."
        keywords="AI content generator, social media AI, Instagram caption generator, Twitter thread generator, TikTok script, YouTube shorts, hashtag generator, viral content AI"
        url="https://lucylounge.org/creator-studio"
        canonical="https://lucylounge.org/creator-studio"
      />
      
      <div className="min-h-screen relative overflow-hidden">
        <CosmicBackground />

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-muted/20 border border-border/30"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h1 className="text-5xl font-bold mb-4">Creator Studio</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Generate viral social media content with Lucy AI's advanced intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 p-6 bg-card/80 backdrop-blur-lg">
                <h2 className="text-xl font-bold mb-4">Content Type</h2>
                <div className="space-y-2">
                  {contentTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={contentType === type.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setContentType(type.id)}
                    >
                      <type.icon className="w-4 h-4 mr-2" />
                      {type.name}
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="lg:col-span-2 p-6 bg-card/80 backdrop-blur-lg">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic or Idea</label>
                    <Textarea
                      placeholder="e.g., How AI is transforming business in 2025"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={generateContent}
                    disabled={loading}
                    size="lg"
                    variant="gradient"
                    className="w-full"
                  >
                    {loading ? 'Generating...' : 'Generate Content'}
                  </Button>

                  {output && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Generated Content</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-6 whitespace-pre-wrap">
                        {output}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-card/80 backdrop-blur-lg">
                <div className="text-4xl font-bold text-accent mb-2">10M+</div>
                <div className="text-sm text-muted-foreground">Content Pieces Generated</div>
              </Card>
              <Card className="p-6 text-center bg-card/80 backdrop-blur-lg">
                <div className="text-4xl font-bold text-accent mb-2">500K+</div>
                <div className="text-sm text-muted-foreground">Creators Using Lucy</div>
              </Card>
              <Card className="p-6 text-center bg-card/80 backdrop-blur-lg">
                <div className="text-4xl font-bold text-accent mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </Card>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default CreatorStudio;