import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import ChatButton from '@/components/ChatButton';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  const [showLoading, setShowLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoadedBefore');
    if (hasLoaded) {
      setShowLoading(false);
      setHasShownLoading(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem('hasLoadedBefore', 'true');
    setShowLoading(false);
    setHasShownLoading(true);
  };

  if (!hasShownLoading && showLoading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
        
        :root {
          --bg-primary: #0A0E1A;
          --bg-secondary: #111827;
          --bg-card: #1F2937;
          --accent-primary: #FFD700;
          --accent-glow: rgba(255, 215, 0, 0.3);
          --text-primary: #FFFFFF;
          --text-secondary: #94A3B8;
          --border-color: #374151;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        body {
          background: linear-gradient(135deg, #0A0E1A 0%, #111827 50%, #1F2937 100%);
          background-attachment: fixed;
        }
        
        /* Premium Background Effects */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        main {
          position: relative;
          z-index: 1;
        }
        
        /* Override colors with premium palette */
        .bg-neutral-950 { 
          background: linear-gradient(135deg, #0A0E1A 0%, #111827 100%) !important;
        }
        .bg-neutral-900 { 
          background: rgba(31, 41, 55, 0.8) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.1);
        }
        .bg-neutral-800 { 
          background: rgba(55, 65, 81, 0.6) !important;
          backdrop-filter: blur(8px);
        }
        .border-neutral-800,
        .border-neutral-700 { 
          border-color: rgba(255, 215, 0, 0.15) !important;
        }
        .text-neutral-400 { color: var(--text-secondary) !important; }
        .text-neutral-300,
        .text-white { color: var(--text-primary) !important; }
        
        /* Premium Accent Colors */
        .bg-amber-500,
        .bg-amber-400 { 
          background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%) !important;
          box-shadow: 0 4px 20px var(--accent-glow);
          position: relative;
          overflow: hidden;
        }
        .bg-amber-500::before,
        .bg-amber-400::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .bg-amber-500:hover::before,
        .bg-amber-400:hover::before {
          left: 100%;
        }
        .hover\\:bg-amber-400:hover,
        .hover\\:bg-amber-300:hover { 
          background: linear-gradient(135deg, #FFC700 0%, #FFB700 100%) !important;
          box-shadow: 0 6px 30px rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
        }
        .text-amber-500,
        .text-amber-400 { 
          color: #FFD700 !important;
          text-shadow: 0 0 20px var(--accent-glow);
        }
        .hover\\:text-amber-400:hover,
        .hover\\:text-amber-300:hover { 
          color: #FFE44D !important;
        }
        .border-amber-500 { 
          border-color: #FFD700 !important;
          box-shadow: 0 0 15px var(--accent-glow);
        }
        
        /* Premium Cards */
        .bg-white {
          background: rgba(31, 41, 55, 0.95) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 215, 0, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        /* Premium Buttons */
        button, .button, a[class*="Button"] {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          letter-spacing: 0.025em;
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
          font-weight: 700;
        }
        
        /* Premium Inputs */
        input, textarea, select {
          background: rgba(31, 41, 55, 0.8) !important;
          border: 1px solid rgba(255, 215, 0, 0.2) !important;
          transition: all 0.3s ease;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #FFD700 !important;
          box-shadow: 0 0 0 3px var(--accent-glow) !important;
          outline: none !important;
        }
        
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Premium Shadows */
        .shadow-lg {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
        }
        
        /* Hover Effects */
        a, button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Image Overlay Effects */
        img {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatButton />
      <Toaster />
      </div>
      );
      }