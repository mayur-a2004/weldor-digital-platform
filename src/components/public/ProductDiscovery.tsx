import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ArrowRight, 
  Eye, 
  Scale, 
  Sparkles, 
  Layers, 
  Wind, 
  Droplets, 
  Cpu, 
  Flame, 
  Zap, 
  Box,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import type { Product } from '../../types';
import { getProductCardTheme } from '../../utils/productCardTheme';

export const ProductDiscovery: React.FC = () => {
  const { 
    products, 
    categories, 
    setActiveView, 
    setSelectedProduct, 
    toggleCompare, 
    compareList, 
    openCatalogModal 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  const industriesList = ['Automotive', 'Heavy Machinery', 'Aerospace', 'Automation & Robotics', 'Oil & Gas'];

  // Helper to render dynamic icon for category tab
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wind': return <Wind className="w-3.5 h-3.5" />;
      case 'Droplets': return <Droplets className="w-3.5 h-3.5" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  // Filter products by search, category tab, and industry
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p || (p.status && p.status === 'Archived')) return false;
      
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        (p.name || '').toLowerCase().includes(q) || 
        (p.sku || '').toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q) ||
        (p.modelNumber && p.modelNumber.toLowerCase().includes(q)) ||
        (Array.isArray(p.seoKeywords) && p.seoKeywords.some(k => (k || '').toLowerCase().includes(q)));

      const matchesCategory = selectedCategoryTab === 'All' || 
        p.category === selectedCategoryTab || 
        p.categoryId === selectedCategoryTab;

      const matchesIndustry = selectedIndustry === 'All' || 
        (Array.isArray(p.industries) && p.industries.includes(selectedIndustry));

      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [products, searchTerm, selectedCategoryTab, selectedIndustry]);

  // HOMEPAGE DISPLAY LIMIT: 4 PRODUCTS PER ROW (4-4 BALANCED GRID)
  const MAX_HOMEPAGE_PRODUCTS = 8;
  const displayedProducts = useMemo(() => {
    // Prioritize products marked featured: true, then remaining
    const sorted = [...filteredProducts].sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });
    return sorted.slice(0, MAX_HOMEPAGE_PRODUCTS);
  }, [filteredProducts]);

  return (
    <section id="homepage-product-showcase" className="py-10 sm:py-14 bg-gradient-to-b from-[#FAF9F6] via-white to-slate-50/60 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="tech-label text-[10px]">Section 03 — Product Catalog</span>
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-orange-600" /> Precision Engineered
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Industrial Welding & Gas Control Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Heavy-duty torches, 300 Bar gas regulators, and precision CNC consumables engineered for extreme industrial duty cycles.
            </p>
          </div>

          <button 
            onClick={() => setActiveView('public-products')}
            className="btn-secondary text-xs self-start md:self-auto shadow-xs flex items-center gap-1.5 py-2.5 px-4 font-bold shrink-0 cursor-pointer"
          >
            <span>View All ({products.length}+ Items)</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
          </button>
        </div>

        {/* Minimalist Aesthetic Category Filter Tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {/* All Tab */}
            <button
              onClick={() => setSelectedCategoryTab('All')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategoryTab === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({products.length})</span>
            </button>

            {/* Dynamic Category Tabs */}
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id || p.category === cat.name).length;
              const isSelected = selectedCategoryTab === cat.name || selectedCategoryTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Industry Quick Filter Bar */}
        <div className="bg-white p-3 rounded-2xl mb-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SKU, torch model, gas regulator, or technical specification..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 font-medium placeholder-slate-400"
            />
          </div>

          {/* Industry Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Applications</option>
              {industriesList.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Quick Counter */}
          <div className="text-[11px] font-mono font-bold text-slate-500 whitespace-nowrap px-2">
            Showing <strong className="text-orange-600">{displayedProducts.length}</strong> of {filteredProducts.length}
          </div>
        </div>

        {/* Product Cards Grid (4 Columns Balanced Grid) */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Box className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
            <p className="text-xs text-slate-600">
              Try adjusting your search query or select another category tab above.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryTab('All');
                setSelectedIndustry('All');
              }}
              className="btn-secondary text-xs px-4 py-2 cursor-pointer font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedProducts.map((product) => {
              const isCompared = compareList.some(p => p.id === product.id);
              const theme = getProductCardTheme(product.category);

              return (
                <div 
                  key={product.id}
                  className={`group relative ${theme.cardBg} rounded-2xl border ${theme.border} transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs hover:-translate-y-1`}
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Subtle Glowing Top Accent Strip */}
                  <div className={`h-1 w-full bg-gradient-to-r ${theme.accentBar} opacity-80 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 z-10`} />

                  <div>
                    {/* Clean Product Visual Canvas with Illuminated Radial Glow */}
                    <div className={`relative h-48 sm:h-52 ${theme.canvasBg} p-5 flex items-center justify-center overflow-hidden border-b ${theme.canvasBorder}`}>
                      {/* Ambient Radial Spotlight Glow */}
                      <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${theme.glow} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700`} />

                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => {
                          e.currentTarget.src = '/catalog_pages/page_4.png';
                        }}
                        className="relative z-1 max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-xs" 
                      />
                      
                      {/* Floating Minimalist SKU Pill */}
                      <span className="absolute top-3 left-3 z-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200/90 shadow-2xs">
                        {product.sku}
                      </span>

                      {/* Floating Quick Action (Compare) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(product);
                        }}
                        title={isCompared ? "Remove from comparison" : "Add to comparison"}
                        className={`absolute top-3 right-3 z-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCompared 
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs' 
                            : 'bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white border-slate-200/90 shadow-2xs'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Card Body Information */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${theme.badgeBg} truncate`}>
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="text-[10px] font-mono font-bold text-amber-700 flex items-center gap-0.5 shrink-0">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm sm:text-base font-bold font-heading text-slate-900 ${theme.accentText} transition-colors line-clamp-1 leading-snug`}>
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1 font-normal">
                        {product.tagline || product.description}
                      </p>

                      {/* Clean Technical Specs Strip on Soft Backdrop */}
                      {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                        <div className={`pt-2 mt-2 border-t border-black/5 ${theme.specBg} rounded-lg p-2 grid grid-cols-2 gap-2 text-[11px] font-mono backdrop-blur-xs`}>
                          {product.specifications.slice(0, 2).map((spec, i) => (
                            <div key={i} className="min-w-0">
                              <span className="text-[10px] text-slate-500 block uppercase tracking-wide truncate">
                                {spec.label}
                              </span>
                              <span className="text-slate-900 font-bold truncate block">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clean Unified Card Footer */}
                  <div className={`px-4 sm:px-5 py-3 border-t ${theme.footerBg} flex items-center justify-between`}>
                    <span className="text-xs font-mono font-bold text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5 transition-colors">
                      <span>Specs & 3D</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setActiveView('public-rfq');
                      }}
                      className={`px-3 py-1.5 rounded-lg ${theme.btnBg} text-xs font-mono font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer`}
                    >
                      Get Quote
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Minimalist Corporate Bottom Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold font-heading text-white">
                Looking for Custom Engineering Drawings or Bulk OEM Supply?
              </h4>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                Inspect 3D STEP CAD models, material certificates, and factory lead times across all {products.length}+ products.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('public-products')}
            className="btn-primary text-xs py-2.5 px-5 shadow-sm flex items-center gap-2 shrink-0 font-bold cursor-pointer"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
