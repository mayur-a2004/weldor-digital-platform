import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, FileText } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black text-white select-none aspect-[16/9] flex items-center">
      {/* Background Video - Complete Full Frame 16:9 Fit Without Any Cropping */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/videos/hero_bg.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle, soft neutral gradient only on text side for crisp legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content - Clean, High Impact & Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 md:py-10 lg:py-16 relative z-20 w-full">
        <div className="max-w-3xl space-y-2 sm:space-y-4 lg:space-y-6 animate-fade-in-up">
          
          {/* Main Headline */}
          <h1 className="text-base xs:text-lg sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Manufacturer of <br className="hidden sm:inline" />
            <span className="text-white">Welding and Cutting Consumables</span>
          </h1>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 pt-1 sm:pt-2">
            <button 
              onClick={() => setActiveView('public-products')}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3.5 rounded-lg sm:rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] sm:text-xs lg:text-sm tracking-wide shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 transition-all flex items-center gap-1.5 sm:gap-2 group cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => setActiveView('public-rfq')}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3.5 rounded-lg sm:rounded-xl border border-white/25 hover:border-white/50 bg-black/40 hover:bg-black/60 text-white font-semibold text-[11px] sm:text-xs lg:text-sm backdrop-blur-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
              <span>Request RFQ</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
