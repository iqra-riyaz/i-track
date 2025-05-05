'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalendarTracker from '@/components/CalendarTracker';
import { motion } from 'framer-motion';
import BackgroundAnimation from '@/components/BackgroundAnimation';

export default function CalendarPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage on client side
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldUseDarkMode);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen bg-lightbg dark:bg-darkbg relative pb-20 rounded-3xl">
      <BackgroundAnimation />
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button 
          onClick={toggleTheme}
          className="glass p-2 sm:p-2.5 rounded-full hover:scale-110 transition-transform shadow-sm hover:shadow-md"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Header with Navigation */}
      <motion.header 
        className="backdrop-blur-sm bg-white/5 dark:bg-gray-800/5 shadow-sm rounded-xl py-4 sm:py-6 px-4 sm:px-6 mb-4 sm:mb-6 mx-auto max-w-6xl w-[95%] mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center h-10 px-4 sm:px-5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 text-gray-700 dark:text-gray-200 transition-all duration-300 shadow-sm hover:shadow min-w-[120px] sm:min-w-[140px] backdrop-blur-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-sm sm:text-base whitespace-nowrap">Back</span>
          </Link>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center flex-grow">Daily Calendar Tracker</h1>
          
          {/* Spacer div to balance the header */}
          <div className="w-[120px] sm:w-[140px] hidden sm:block"></div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-[95%]">
        <CalendarTracker />
      </main>

      {/* Footer */}
      <motion.footer 
        className="py-4 sm:py-6 text-center text-gray-600 dark:text-gray-400 absolute bottom-0 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-xs sm:text-sm">Made with ❤️ by Iqra Riyaz</p>
      </motion.footer>
    </div>
  );
} 