// import Globe from "./Globe";

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      
//       {/* 🌍 Globe */}
//       <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70">
//         <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px]">
//           <Globe />
//         </div>
//       </div>

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/60 z-[1]" />

//       {/* Content */}
//       <div className="z-10">
//         <h1 className="text-5xl font-bold">
//           Detect Crime with <br />
//           <span className="text-purple-400">AI Precision</span>
//         </h1>

//         <p className="mt-4 text-gray-400">
//           Build AI crime detection systems in minutes
//         </p>
//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import GlobeScene from './Globe';


function TypingText() {
  const fullText = ' Found anomalous activity with 94.7% confidence.';
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      const timeout = setTimeout(() => {
        setDisplayed('> Analyzing...');
        setPhase(1);
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (phase === 1) {
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setDisplayed('> Analyzing...' + fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setPhase(2);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div>
      <span className="text-cyan-400">{displayed}</span>
      {phase < 2 && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-cyan-400">▋</motion.span>}
    </div>
  );
}

// ─── Hero Section ───
function HeroSection() {
  const [typedInput, setTypedInput] = useState('');
  const targetText = 'create a counter contract...';
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      const timeout = setTimeout(() => setPhase(1), 800);
      return () => clearTimeout(timeout);
    }
    if (phase === 1) {
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setTypedInput(targetText.slice(0, idx));
        if (idx >= targetText.length) {
          clearInterval(interval);
          setPhase(2);
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0533] via-[#0f0520] to-[#0a0a0f] z-0" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
          
          {/* Left Side: Text + Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-purple-300 font-medium">AI-Powered Detection Engine </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Find CrimeHotspot</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                in Minutes 
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 mb-2 max-w-lg">
              CrimeAI Protect{' '}
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono text-sm">YOU</span>
              <span className="mx-2 text-gray-500">Understand Crime By One</span> 
              <span className="text-cyan-400 border-b-2 border-cyan-400/50">Click</span>
            </p>

            {/* Input Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8"
            >
              <div className="rounded-xl bg-[#111118] border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono ml-2">crimeai.dev</span>
                  <span className="ml-auto text-xs text-gray-600 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                  </span>
                </div>
                <div className="px-4 py-4 font-mono text-sm text-left min-h-[120px]">
                  <div className="text-gray-500 mb-2 flex items-start">
                    <span className="text-purple-400 mr-2 shrink-0">{'> '}</span>
                    <span className="text-gray-300">
                      {typedInput}
                      {phase < 2 && (
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-gray-300">▋</motion.span>
                      )}
                    </span>
                  </div>
                  {phase >= 2 && <TypingText />}
                </div>
                <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    {/* <span className="text-xs text-purple-300 font-mono">templates</span> */}
                  </div>
                  <span className="text-xs text-gray-600 font-mono">0 / 200</span>
                  <button className="ml-auto w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-start gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <span className="text-purple-400">λ</span> Find
                </span>
                <span className="text-gray-700">→</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <span className="text-yellow-400">⚡</span> Complaint
                </span>
                <span className="text-gray-700">→</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <span className="text-green-400">⛓</span> Understand
                </span>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-medium text-white transition-colors flex items-center gap-2">
                  Found Out Your Place 
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>
                </button>
                <button className="text-sm text-purple-400 hover:text-purple-300 border-b border-purple-400/30 pb-0.5">Read Our Docs</button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Globe */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <GlobeScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}


export default HeroSection;