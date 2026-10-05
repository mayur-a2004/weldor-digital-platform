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
    <section className="relative overflow-hidden bg-black text-white min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] flex items-center select-none">
      {/* Background Video - Crystal Clear Full HD (No blur, no poster, 100% opacity) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source src="/videos/hero_bg.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle, soft neutral gradient only on text side for crisp legibility without blurring video */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Hero Content - Clean & High Impact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-20 w-full">
        <div className="max-w-3xl space-y-6 animate-fade-in-up">
          
          {/* Main Headline - Single clean line as requested */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">
            Manufacturer of <br className="hidden sm:inline" />
            <span className="text-white">Welding and Cutting Consumables</span>
          </h1>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button 
              onClick={() => setActiveView('public-products')}
              className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => setActiveView('public-rfq')}
              className="px-6 py-3.5 rounded-xl border border-white/25 hover:border-white/50 bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Request RFQ</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
