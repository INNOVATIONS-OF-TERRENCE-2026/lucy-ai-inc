import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Mail, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

export const ShareButtons = ({ 
  url = 'https://lucylounge.org',
  title = 'Lucy AI - Beyond Intelligence',
  description = 'Experience the future of AI conversation'
}: ShareButtonsProps) => {
  
  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="border-border/30 hover:bg-muted/20"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="border-border/30 hover:bg-muted/20"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        className="border-border/30 hover:bg-muted/20"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareViaEmail}
        className="border-border/30 hover:bg-muted/20"
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="border-border/30 hover:bg-muted/20"
      >
        <Link2 className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
};