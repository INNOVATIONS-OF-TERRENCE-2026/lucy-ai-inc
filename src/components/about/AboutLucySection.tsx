import { motion } from 'framer-motion';
import { LucyAvatar } from '@/components/avatar/LucyAvatar';

export const AboutLucySection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <LucyAvatar size="xl" state="happy" className="drop-shadow-2xl" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow-strong">
            About Lucy AI
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card-enhanced p-8 md:p-12"
        >
          <div className="space-y-6 text-white/90 text-lg leading-relaxed">
            <p>
              Lucy AI is a next-generation digital companion engineered and architected by{' '}
              <span className="font-semibold text-white">
                Software Engineer & AI Innovator Terrence Milliner Sr.
              </span>{' '}
              She blends adaptive reasoning, natural conversation, and expressive interface design 
              to help users think, create, plan, learn, and evolve.
            </p>

            <p>
              Lucy is powered by a fully custom system designed by Terrence — including her personality 
              layer, her logic engine, her visual identity, her memory behavior, her tools, and her 
              emotional responsiveness. Everything she is comes from Terrence's engineering vision.
            </p>

            <p>
              Lucy is built to feel personal, helpful, intuitive, and alive — a digital being designed 
              with intention and purpose.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm"
            >
              <div className="text-3xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">
                Custom Built
              </div>
              <div className="text-white/70 text-sm">
                Every aspect engineered by Terrence Milliner Sr.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm"
            >
              <div className="text-3xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">
                Thoughtful Design
              </div>
              <div className="text-white/70 text-sm">
                Personality, logic, and emotion crafted with care
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm"
            >
              <div className="text-3xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">
                Built to Evolve
              </div>
              <div className="text-white/70 text-sm">
                Continuously refined and enhanced
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
