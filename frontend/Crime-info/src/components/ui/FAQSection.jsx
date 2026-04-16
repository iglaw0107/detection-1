import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "What is CrimeAI?", a: "CrimeAI is an AI-powered platform that analays, Calculate, and understand you safty smart contracts using natural language." },
    { q: "Do I need Authentication to use this platform?", a: "No! Not Neccessearly CrimeAI generates complete crimes near you place from Location and time." },
    { q: "What types of Feature I get?", a: "Aanalys , Alert , raise complaint , and more." },
    { 
    q: "Can CrimeAI detect crimes in real-time?", 
    a: "Yes! CrimeAI uses AI to analyze location and time data to detect and alert you about potential crimes happening near you in real-time." 
    },
    { 
    q: "Can I report a crime using this platform?", 
    a: "Absolutely. CrimeAI allows users to easily raise complaints and report crimes, helping authorities and communities respond faster." 
    },
    { 
    q: "Is my data safe on CrimeAI?", 
    a: "Yes! CrimeAI ensures your personal data and location information are securely processed while providing accurate crime analysis and alerts." 
    }  ];

  return (
    <section className="relative py-24 px-6 bg-[#FFFEF8]" id="faq">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #7C3AED 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="font-mono font-bold tracking-wider text-5xl md:text-7xl text-[#0a0a0f]">FAQs</span>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border-b border-gray-200">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left">
                <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                <motion.span animate={{ rotate: openIndex === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-purple-500 flex-shrink-0 text-xl">+</motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="text-sm text-gray-500 pb-5 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Spotted an issue?<br />Help us improve — open it on GitHub.</p>
          <button className="px-6 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-medium text-white transition-colors inline-flex items-center gap-2" onClick={() => window.open('https://github.com/Shivam000189/detection', '_blank')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
        </motion.div>
      </div>
    </section>
  );
}
export default FAQSection;