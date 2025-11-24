import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Lucy AI?',
    answer: 'Lucy AI is a digital companion system engineered by Software Engineer Terrence Milliner Sr. She blends advanced reasoning, custom-built tools, and a handcrafted interface to create a unified AI assistant experience.'
  },
  {
    question: 'Who built Lucy?',
    answer: 'Lucy was engineered by Terrence Milliner Sr. He designed her logic, behavior, identity, expressions, tools, and user experience.'
  },
  {
    question: 'Is Lucy an AI model?',
    answer: 'No. Lucy is a custom AI system built on top of advanced computing frameworks, then engineered into her own personality and identity by Terrence.'
  },
  {
    question: 'Why does Lucy reference Terrence?',
    answer: "Terrence is her creator, architect, and engineer. Lucy's identity is directly tied to the person who designed her."
  },
  {
    question: 'What makes Lucy different?',
    answer: 'Her personality layer, custom system logic, animated avatar, contextual memory, daily-use design, and emotional responsiveness — all handcrafted by Terrence.'
  }
];

export const LucyFAQSection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            How Does Lucy Actually Work?
          </h2>
          <p className="text-xl text-white/90 text-shadow-soft">
            Understanding the system behind the intelligence
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card-enhanced p-8"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-white/10"
              >
                <AccordionTrigger className="text-left text-white hover:text-white/80 text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/80 text-base leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
