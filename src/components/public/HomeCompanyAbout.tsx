import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Award, 
  Globe2, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Factory,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const HomeCompanyAbout: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Subtle Ambient Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Corporate Brand Identity, Vision, and Highlights */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Micro Label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="tech-label text-[10px]">Section 02 — Corporate Overview</span>
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Factory className="w-3 h-3 text-orange-600" /> Jamnagar Manufacturing Hub
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
              Engineering Reliability Since 2011
            </h2>

            {/* Crisp Corporate Pitch */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Operating under parent group <strong>Earth Metal Industries</strong>, <span className="text-slate-900 font-semibold">Weldor</span> is India's trusted OEM manufacturer of precision MIG/TIG welding torches, heavy-duty forged brass gas regulators, and CNC consumables. Built with advanced Swiss sliding-head CNC technology, zero-leak testing, and ISO 9001:2015 quality standards for demanding industrial fabrication.
            </p>

            {/* 4 Crisp Key Statistics Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                <span className="text-xl sm:text-2xl font-black font-mono text-orange-600 block">15+</span>
                <span className="text-[11px] font-bold text-slate-800 block">Years Heritage</span>
                <span className="text-[10px] text-slate-600">Estd. 2011</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 block">Our</span>
                <span className="text-[11px] font-bold text-slate-800 block">Company</span>
                <span className="text-[10px] text-slate-600">Earth Metal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 block">100%</span>
                <span className="text-[11px] font-bold text-slate-800 block">In-House CNC</span>
                <span className="text-[10px] text-slate-600">Copper & Brass</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 block">ISO 9001</span>
                <span className="text-[11px] font-bold text-slate-800 block">Certified Lab</span>
                <span className="text-[10px] text-slate-600">CMM & Leak Tested</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('public-about')}
                className="btn-primary text-xs px-4 py-2.5 shadow-sm flex items-center gap-2 cursor-pointer font-bold"
              >
                <span>About Company & Plant Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('public-rfq')}
                className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>OEM & Bulk Quotation</span>
              </button>
            </div>

          </div>

          {/* Right Column: Visual Plant & Quality Presentation Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md group">
              {/* Plant Image */}
              <div className="h-60 sm:h-68 overflow-hidden relative">
                <img 
                  src="/images/banners/hero_welding_plant.jpg" 
                  alt="Weldor Jamnagar Manufacturing Plant" 
                  onError={(e) => { e.currentTarget.src = '/catalog_pages/page_1.png'; }}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                
                {/* Badge Top Left */}
                <div className="absolute top-3 left-3 bg-white/95 text-slate-900 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE MANUFACTURING UNIT</span>
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="p-4 sm:p-5 bg-white space-y-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">Earth Metal Industries Plant</span>
                  <span className="text-orange-700 font-bold">Jamnagar, Gujarat</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  State-of-the-art facility featuring multi-axis CNC turn-mill centres, automatic ultrasonic cleaning tanks, and calibrated CMM quality verification booths.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveView('public-about')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <span>Read Full Corporate Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
