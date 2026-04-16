import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    navigation('/login')
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#navGrad)" />
            <path d="M2 17L12 22L22 17" stroke="url(#navGrad)" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12L12 17L22 12" stroke="url(#navGrad)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="navGrad" x1="2" y1="2" x2="22" y2="22">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-sm font-semibold tracking-widest text-white">CRIMEAI</span>
        </div>

        <div className="hidden md:flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-1 py-1">
          {['Features', 'FAQ', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          
          <button className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-medium text-white transition-colors flex items-center gap-2" onClick={handleClick}>
            Sign In
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}


export default Navbar;