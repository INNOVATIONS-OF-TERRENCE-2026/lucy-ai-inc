import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What makes Lucy AI different from other AI assistants?',
    answer: 'Lucy AI is a next-generation assistant system designed and architected by Software Engineer Terrence Milliner Sr. It combines advanced reasoning with multimodal capabilities, long-term memory, and real-world knowledge integration. We orchestrate multiple state-of-the-art AI models from leading providers to give you the best experience for each task.'
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Yes! We implement end-to-end encryption for sensitive conversations, provide complete data export/deletion tools, and never sell your data to third parties. You have full control over your privacy settings.'
  },
  {
    question: 'Can I use Lucy AI on mobile devices?',
    answer: 'Absolutely! Lucy AI works on all devices and can be installed as a Progressive Web App (PWA) on your phone for a native app experience with offline capabilities.'
  },
  {
    question: 'What powers Lucy AI?',
    answer: 'Lucy AI is designed and architected by Software Engineer Terrence Milliner Sr. The system orchestrates multiple advanced AI models from leading providers (including models from OpenAI, Google, and others) to deliver the best results for each type of task. The exact model selection adapts intelligently based on your needs.'
  },
  {
    question: 'Can I share my conversations?',
    answer: 'Yes! You can create secure shareable links for any conversation with optional password protection and expiration dates. Perfect for collaboration or showcasing interesting discussions.'
  },
  {
    question: 'Does Lucy AI work offline?',
    answer: 'The app can work offline for viewing past conversations and composing new messages, which will be sent once you\'re back online. Active AI generation requires an internet connection.'
  },
  {
    question: 'How does the referral program work?',
    answer: 'Every user gets a unique referral code. When someone signs up using your code, both you and your referral receive rewards such as Pro trial access and additional credits.'
  },
  {
    question: 'Can I integrate Lucy AI into my workflow?',
    answer: 'Yes! Pro and Team plans include API access and custom integrations. We also offer file uploads, code execution, and web search capabilities that integrate seamlessly into professional workflows.'
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/90 text-shadow-soft">
            Everything you need to know about Lucy AI
          </p>
        </div>

        <div className="glass-card-enhanced p-8">
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
        </div>
      </div>
    </section>
  );
};
