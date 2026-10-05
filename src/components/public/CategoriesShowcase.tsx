import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Zap, 
  Droplets, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_WELDOR_CATEGORIES } from '../../config/catalogData';

export const CategoriesShowcase: React.FC = () => {
  const { categories, products, setActiveView } = useApp();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  // Fallback to official categories if empty
  const activeCategories = (categories && categories.length > 0) ? categories : OFFICIAL_WELDOR_CATEGORIES;

  // Helper for category metadata, icons, and theme accents
  const getCategoryMeta = (catName: string, iconName?: string) => {
    const name = (catName || '').toLowerCase();
    
    if (name.includes('mig') || name.includes('tig') || name.includes('torch') || iconName === 'Flame') {
      return {
        icon: <Flame className="w-5 h-5 text-orange-600" />,
        bgBadge: 'bg-orange-50 text-orange-700 border-orange-200',
        cardBorder: 'hover:border-orange-500',
        accentBar: 'bg-orange-500',
        divisionCode: 'DIV-01 • WELDING TORCHES',
        previewImage: '/catalog_pages/page_4.png',
        features: ['250A - 500A Duty Cycle', 'Air & Water Cooled', 'Euro Connector']
      };
    }
    if (name.includes('plasma') || name.includes('cutting') || iconName === 'Zap') {
      return {
        icon: <Zap className="w-5 h-5 text-amber-600" />,
        bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        cardBorder: 'hover:border-amber-500',
        accentBar: 'bg-amber-500',
        divisionCode: 'DIV-02 • CUTTING SYSTEMS',
        previewImage: '/catalog_pages/page_6.png',
        features: ['CNC & Manual Torches', 'Up to 300mm Cutting', 'PNME / ANME']
      };
    }
    if (name.includes('regulator') || name.includes('gas') || iconName === 'Droplets') {
      return {
        icon: <Droplets className="w-5 h-5 text-blue-600" />,
        bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
        cardBorder: 'hover:border-blue-500',
        accentBar: 'bg-blue-500',
        divisionCode: 'DIV-03 • PRESSURE CONTROL',
        previewImage: '/catalog_pages/page_9.png',
        features: ['300 Bar Forged Brass', 'Zero Leak Diaphragm', 'IS / BSPP Standards']
      };
    }
    if (name.includes('consumable') || name.includes('tip') || iconName === 'Cpu') {
      return {
        icon: <Cpu className="w-5 h-5 text-emerald-600" />,
        bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cardBorder: 'hover:border-emerald-500',
        accentBar: 'bg-emerald-500',
        divisionCode: 'DIV-04 • CONSUMABLES & SPARES',
        previewImage: '/catalog_pages/page_10.png',
        features: ['CuCrZr Contact Tips', 'Conical Gas Nozzles', 'Precision CNC Machined']
      };
    }
    return {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      cardBorder: 'hover:border-indigo-500',
      accentBar: 'bg-indigo-500',
      divisionCode: 'DIV-05 • PRECISION HARDWARE',
      previewImage: '/catalog_pages/page_1.png',
      features: ['ISO 9001:2015 Tested', '100% Quality Inspected', 'Direct Factory Supply']
    };
  };

  const updateScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = 320; // approximate card width + gap
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIdx(Math.min(idx, activeCategories.length - 1));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [activeCategories.length]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const amount = 340;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-white via-slate-50/70 to-[#FAF9F6] border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Left Content & Right Slider Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>Section 04 — Product Divisions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              Manufacturing Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Swipe or slide through our precision-engineered welding, cutting, and gas regulation divisions.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-slate-500 hidden md:inline-block">
              {activeCategories.length} Divisions
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollByAmount('left')}
                disabled={!canScrollLeft}
                aria-label="Previous Category"
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollLeft 
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-sm cursor-pointer' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollByAmount('right')}
                disabled={!canScrollRight}
                aria-label="Next Category"
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollRight 
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-sm cursor-pointer' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Slider Track */}
        <div 
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2 px-1 -mx-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeCategories.map((cat, idx) => {
            const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
            const meta = getCategoryMeta(cat.name, cat.iconName);

            return (
              <div 
                key={cat.id || idx}
                onClick={() => setActiveView('public-products')}
                className={`w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group relative`}
              >
                {/* Top Accent Strip */}
                <div className={`h-1 w-full ${meta.accentBar}`} />

                {/* Card Top: Thumbnail + Division Pill */}
                <div className="relative h-36 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img 
                    src={cat.image || meta.previewImage} 
                    alt={cat.name} 
                    onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  {/* Division Badge & SKU Count */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/95 text-slate-900 shadow-xs border border-slate-200">
                      {meta.divisionCode.split('•')[0].trim()}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-600 text-white shadow-xs">
                      {count > 0 ? `${count} SKUs` : `${cat.productCount || 4} SKUs`}
                    </span>
                  </div>

                  {/* Title on Image overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="text-sm font-bold text-white font-heading leading-tight truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body: Compact Features & Description */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'Heavy-duty industrial manufacturing components engineered to strict ISO 9001 standards.'}
                  </p>

                  {/* Technical Spec Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {meta.features.slice(0, 2).map((feat, fIdx) => (
                      <span 
                        key={fIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Jamnagar Plant
                    </span>
                    <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Progress Bar / Dots indicator for Mobile */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {activeCategories.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!sliderRef.current) return;
                sliderRef.current.scrollTo({
                  left: i * 320,
                  behavior: 'smooth'
                });
              }}
              aria-label={`Slide to category ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIdx === i ? 'w-6 bg-orange-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
