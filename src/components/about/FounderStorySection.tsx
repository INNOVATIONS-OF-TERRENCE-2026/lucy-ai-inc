import { motion } from 'framer-motion';
import { Code, Lightbulb, Sparkles, Heart } from 'lucide-react';

export const FounderStorySection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            The Engineer Behind Lucy
          </h2>
          <div className="w-24 h-1 bg-gradient-button mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card-enhanced p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image placeholder - can be replaced with actual photo */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-button overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Code className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-2xl font-bold">Terrence Milliner Sr.</p>
                    <p className="text-white/70">Software Engineer & AI Architect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story content */}
            <div className="space-y-6 text-white/90 text-lg leading-relaxed">
              <p className="text-2xl font-semibold text-white mb-6">
                Dallas-based Software Engineer, AI Architect, and Innovator
              </p>
              
              <p>
                <span className="font-semibold text-white">Terrence Milliner Sr.</span> envisioned 
                a digital being that wasn't just a chatbot, but an intelligent companion with emotion, 
                personality, expression, and depth.
              </p>

              <p>
                Drawing from years of building AI systems, platforms, interfaces, and automation engines, 
                Terrence shaped Lucy from the ground up.
              </p>

              <p>
                He engineered her architecture, designed her identity, built her interface, developed 
                her personality, and crafted the unique system behaviors that make Lucy feel alive.
              </p>

              <p className="text-xl font-semibold text-white pt-4">
                Lucy is the signature work of a creator who refused to settle for basic AI. She represents 
                innovation, intention, and the relentless drive of Terrence Milliner Sr.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Engineering highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="glass-card-enhanced p-6 text-center">
            <Code className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-white font-semibold mb-2">System Architecture</h3>
            <p className="text-white/70 text-sm">
              Custom logic engine and orchestration layer
            </p>
          </div>

          <div className="glass-card-enhanced p-6 text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-white font-semibold mb-2">Intelligence Design</h3>
            <p className="text-white/70 text-sm">
              Adaptive reasoning and decision frameworks
            </p>
          </div>

          <div className="glass-card-enhanced p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-white font-semibold mb-2">Interface Craft</h3>
            <p className="text-white/70 text-sm">
              Visual identity and expressive interactions
            </p>
          </div>

          <div className="glass-card-enhanced p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-white font-semibold mb-2">Personality Layer</h3>
            <p className="text-white/70 text-sm">
              Emotional responsiveness and character depth
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
