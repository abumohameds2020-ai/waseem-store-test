"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, HelpCircle, Plus, Minus, MessageCircle, ExternalLink } from "lucide-react";
import EditableText from "./EditableText";

const faqs = [
  {
    question: "Do I need a dedicated amplifier to drive the KZ Phantom?",
    answer: "No, the KZ Phantom is highly efficient at 16Ω impedance and 103dB sensitivity. It can be driven directly from a smartphone or laptop, though a dedicated DAC/Amp will unlock its full dynamic range and tighter bass control.",
  },
  {
    question: "What is the benefit of Planar drivers for gaming?",
    answer: "Planar drivers use a uniform magnetic field to move a nano-diaphragm, resulting in near-zero distortion and elite transient response. In gaming, this transcribes to pinpoint spatial imaging (360° awareness) and the ability to distinguish subtle footsteps among heavy gunfire.",
  },
  {
    question: "Does this IEM provide absolute phase coherence?",
    answer: "Our dual-cavity acoustic engineering ensures that all frequencies arrive at the eardrum simultaneously, maintaining phase integrity. This is crucial for professional audio auditing where temporal accuracy is non-negotiable.",
  },
  {
    question: "Can I replace the cable on these tactical assets?",
    answer: "Yes, all models in the Armory use standard 0.78mm 2-pin recessed connectors. This allows for easy cable upscaling or integration with Bluetooth modules like the KZ AZ20 for wireless operations.",
  },
  {
    question: "What is the recommended burn-in protocol?",
    answer: "For optimal diaphragm elasticity, we recommend 40 hours of 'burn-in' at 60% volume using pink noise or a neutral frequency sweep. This stabilizes the molecular structure of the nano-composites.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-32 bg-[#030303] overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-6 block">
            DEFENSIVE KNOWLEDGE BASE
          </span>
          <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
            Pro-Audio Support <br /> <span className="text-gray-500 italic">Protocols</span>
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-xs font-black max-w-2xl mx-auto uppercase tracking-[0.5em]">
            Neural Link Status: Active &bull; Technical Logistics Online
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card overflow-hidden border transition-all duration-500 rounded-[32px] ${
                activeIndex === i ? "border-cyan-500/30 bg-white/[0.05]" : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-8 sm:p-10 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-8">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeIndex === i ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                      <HelpCircle size={20} />
                   </div>
                   <span className={`text-xl font-black uppercase tracking-tight transition-all duration-300 ${activeIndex === i ? "text-white" : "text-gray-500 group-hover:text-white"}`}>
                    <EditableText 
                      value={faq.question} 
                      path={`cms.faq.${i}.question`} 
                      tagName="span"
                    />
                  </span>
                </div>
                <div className={`transition-transform duration-500 ${activeIndex === i ? "rotate-45 text-cyan-500" : "text-gray-700 group-hover:text-white"}`}>
                  <Plus size={24} />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-10 pb-10 pl-[7.5rem]">
                      <div className="text-gray-400 text-lg leading-relaxed font-medium">
                        <EditableText 
                          value={faq.answer} 
                          path={`cms.faq.${i}.answer`} 
                          tagName="span"
                          multiline
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Support Footer */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-24 text-center space-y-10"
            >
          <p className="text-xs text-gray-600 font-black uppercase tracking-[0.4em]">Still have questions about our absolute phase coherence?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
             <button className="px-12 py-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-500 transition-all flex items-center shadow-xl">
               Contact Tactical Support <MessageCircle size={14} className="ml-4" />
             </button>
             <button className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors flex items-center gap-3">
               Technical Documentation <ExternalLink size={14} />
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
