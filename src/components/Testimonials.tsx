"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote, CheckCircle2, User, Terminal } from "lucide-react";
import EditableText from './EditableText';

const testimonials = [
  {
    name: "Waseem Abusaud",
    role: "Lead Consultant",
    quote: "The KZ Phantom represents a tectonic shift in the planar IEM landscape. The resolution-to-price ratio is simply unmatched.",
    rating: 5,
    tag: "CURATOR'S CHOICE",
  },
  {
    name: "Alex Reed",
    role: "Studio Engineer",
    quote: "Finally, a planar that doesn't require a nuclear reactor to drive. The clarity in the 4k-8k region is surgical.",
    rating: 5,
    tag: "VERIFIED EXPERT",
  },
  {
    name: "Sophia Chen",
    role: "Classical Violinist",
    quote: "The timbre of the strings is surprisingly natural for a planar. It captures the resonance of my instrument with remarkable fidelity.",
    rating: 5,
    tag: "AUDIOPHILE",
  }
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative py-40 bg-[#030303] overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-32"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
             <Terminal size={14} className="text-cyan-500" />
             <span className="text-[10px] font-black tracking-[0.6em] text-cyan-500 uppercase">
               <EditableText value="Intelligence Reports" path="cms.testimonials.label" />
             </span>
          </div>
          <h2 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-8 italic">
             <EditableText value="The Field" path="cms.testimonials.title_1" tagName="span" /> <br />
             <span className="text-gray-500 not-italic">
               <EditableText value="Reports" path="cms.testimonials.title_2" tagName="span" />
             </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed">
             <EditableText 
               value="Direct telemetry from the frontline. Verified experts and curators analyze the acoustic performance of the arsenal." 
               path="cms.testimonials.desc" 
               multiline
             />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-12 rounded-[48px] flex flex-col hover:border-cyan-500/30 transition-all duration-700 group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-cyan-500 text-cyan-500" />
                  ))}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-[8px] font-black text-cyan-500 tracking-widest uppercase">
                  {item.tag}
                </div>
              </div>

              <div className="relative mb-12">
                <Quote className="absolute -top-6 -left-6 text-white/5 w-16 h-16 -z-10" />
                <p className="text-white text-xl font-medium leading-relaxed tracking-tight relative z-10 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-auto flex items-center gap-6 pt-10 border-t border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <User size={24} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">{item.role}</p>
                </div>
                <CheckCircle2 size={16} className="text-cyan-500 ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
