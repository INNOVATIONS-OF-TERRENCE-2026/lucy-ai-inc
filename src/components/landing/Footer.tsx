import { LucyAvatar } from '@/components/avatar/LucyAvatar';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LucyAvatar size="sm" />
              <span className="text-2xl font-bold text-white">Lucy AI</span>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Beyond Intelligence. An advanced AI assistant system designed and architected by Software Engineer Terrence Milliner Sr., powered by state-of-the-art AI models.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/lucyai" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/lucyai" className="text-white/70 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/lucyai" className="text-white/70 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@lucy-ai.app" className="text-white/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-white/70 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/tools" className="text-white/70 hover:text-white transition-colors">Tools</Link></li>
              <li><Link to="/chat" className="text-white/70 hover:text-white transition-colors">Try Free</Link></li>
              <li><Link to="/analytics" className="text-white/70 hover:text-white transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/launch" className="text-white/70 hover:text-white transition-colors">Launch</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <p className="text-white/60 text-sm">
              © {currentYear} Lucy AI. Designed and architected by Software Engineer Terrence Milliner Sr. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
          
          {/* Short About Section */}
          <div className="pt-6 border-t border-white/10">
            <div className="max-w-3xl mx-auto text-center">
              <h4 className="text-white font-semibold mb-3">About Lucy AI</h4>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Lucy AI is a next-generation digital companion engineered by Software Engineer 
                Terrence Milliner Sr. — designed to feel personal, helpful, and alive.
              </p>
              <Link 
                to="/about" 
                className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Learn more about Lucy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
