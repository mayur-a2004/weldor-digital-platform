import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Scale, 
  Eye, 
  FileUp, 
  ChevronRight,
  Video as VideoIcon,
  Box,
  FileText,
  Images,
  Tag,
  Download
} from 'lucide-react';
import { getProductCardTheme } from '../../utils/productCardTheme';

export const PublicProductCatalog: React.FC = () => {
  const { 
    products, 
    categories, 
    setSelectedProduct, 
    toggleCompare, 
    compareList, 
    setActiveView,
    openCatalogModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sub-categories for currently selected category
  const activeCategoryObj = categories.find(c => c.name === selectedCategory);
  const availableSubCategories = activeCategoryObj?.subCategories || [];

  const filteredProducts = products.filter(p => {
    if (!p) return false;
    const query = searchQuery.trim().toLowerCase();
    
    // Search algorithm matches name, sku, modelNumber, description, and hidden SEO keywords
    const matchesSearch = !query || 
      (p.name || '').toLowerCase().includes(query) || 
      (p.sku || '').toLowerCase().includes(query) ||
      (p.modelNumber && p.modelNumber.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.description || '').toLowerCase().includes(query) ||
      (Array.isArray(p.seoKeywords) && p.seoKeywords.some(k => (k || '').toLowerCase().includes(query)));

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSubCat = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;
    const matchesInd = selectedIndustry === 'All' || (Array.isArray(p.industries) && p.industries.includes(selectedIndustry));
    const matchesStock = !inStockOnly || p.inStock;

    return matchesSearch && matchesCat && matchesSubCat && matchesInd && matchesStock;
  });

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 mb-2">
            <span className="cursor-pointer hover:text-orange-600 font-medium" onClick={() => setActiveView('public-home')}>Home</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-orange-700 font-bold">Amazon-Grade Industrial Catalog</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
                Industrial Product Catalog & Technical Search
              </h1>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                Click any product to inspect 3D STEP CAD models, multi-angle photos, HD demo video, and downloadable technical brochures.
              </p>
            </div>

            <button 
              onClick={() => setActiveView('public-rfq')}
              className="btn-primary text-xs shrink-0 shadow-md"
            >
              <FileUp className="w-4 h-4" /> Multi-Step Custom RFQ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Filter className="w-4 h-4 text-orange-600" /> Filter Components
                </span>
                {(selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedIndustry !== 'All' || searchQuery) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubCategory('All');
                      setSelectedIndustry('All');
                      setSearchQuery('');
                      setInStockOnly(false);
                    }}
                    className="text-[11px] font-mono text-orange-700 font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block">Product Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubCategory('All');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-between font-medium ${
                      selectedCategory === 'All' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] font-mono opacity-60">{products.length}</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubCategory('All');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-between font-medium ${
                        selectedCategory === cat.name ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] font-mono opacity-60">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Categories if any */}
              {availableSubCategories.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block">Sub-Category</label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedSubCategory('All')}
                      className={`w-full text-left px-3 py-1 rounded text-xs transition-colors ${
                        selectedSubCategory === 'All' ? 'bg-orange-100/70 text-orange-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All {selectedCategory}
                    </button>
                    {availableSubCategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSubCategory(sub)}
                        className={`w-full text-left px-3 py-1 rounded text-xs transition-colors ${
                          selectedSubCategory === sub ? 'bg-orange-100/70 text-orange-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Industries */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block">Industry Application</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-orange-600 font-semibold"
                >
                  <option value="All">All Industries</option>
                  <option value="Automotive">Automotive & EV</option>
                  <option value="Heavy Machinery">Heavy Machinery & Forging</option>
                  <option value="Aerospace">Aerospace & Defense</option>
                  <option value="Automation & Robotics">Automation & Robotics</option>
                  <option value="Oil & Gas">Oil & Gas / Refineries</option>
                </select>
              </div>

              {/* In Stock toggle */}
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="stockCheck"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="stockCheck" className="text-xs text-slate-800 font-semibold cursor-pointer select-none">
                  Standard Fast-Ship In-Stock
                </label>
              </div>

            </div>
          </aside>

          {/* Main Product Grid / List Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, ISO standards, SKU, bore size, pressure rating..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-orange-600 font-sans font-medium"
                />
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs font-mono text-slate-700 font-semibold">
                  Showing <strong>{filteredProducts.length}</strong> Products
                </span>

                {/* View toggle */}
                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded text-xs ${viewMode === 'grid' ? 'bg-orange-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded text-xs ${viewMode === 'list' ? 'bg-orange-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
                <p className="text-sm font-semibold">No products matched your search or filter criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSelectedSubCategory('All'); setSearchQuery(''); }}
                  className="text-xs font-mono text-orange-600 font-bold underline"
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => {
                  const isCompared = compareList.some(item => item.id === p.id);
                  const totalPhotos = 1 + (p.gallery?.length || 0);
                  const theme = getProductCardTheme(p.category);

                  return (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`group relative ${theme.cardBg} rounded-2xl border ${theme.border} overflow-hidden flex flex-col justify-between cursor-pointer shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                    >
                      {/* Subtle Glowing Top Accent Strip */}
                      <div className={`h-1 w-full bg-gradient-to-r ${theme.accentBar} opacity-80 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 z-10`} />

                      <div>
                        {/* Thumbnail & Ambient Radial Glow Canvas */}
                        <div className={`relative h-52 ${theme.canvasBg} overflow-hidden border-b ${theme.canvasBorder} flex items-center justify-center p-5`}>
                          {/* Radial Spotlight Glow */}
                          <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-tr ${theme.glow} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700`} />

                          <img 
                            src={p.image} 
                            alt={p.name} 
                            onError={(e) => {
                              e.currentTarget.src = '/catalog_pages/page_4.png';
                            }}
                            className="relative z-1 max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-xs" 
                          />
                          
                          {/* SKU & Brand */}
                          <span className="absolute top-3 left-3 z-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 font-bold border border-slate-200/90 shadow-2xs">
                            {p.sku}
                          </span>

                          {/* Media count pills */}
                          <div className="absolute bottom-2 left-2 z-2 flex items-center gap-1.5">
                            {totalPhotos > 1 && (
                              <span className="bg-slate-900/85 backdrop-blur text-white text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <Images className="w-3 h-3" /> {totalPhotos}
                              </span>
                            )}
                            {p.videoUrl && (
                              <span className="bg-orange-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <VideoIcon className="w-3 h-3" /> Video
                              </span>
                            )}
                            {p.cadDrawingUrl && (
                              <span className="bg-blue-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <Box className="w-3 h-3" /> 3D
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompare(p);
                            }}
                            title="Compare Product"
                            className={`absolute top-3 right-3 z-2 p-1.5 rounded-lg text-xs backdrop-blur shadow-2xs transition-all ${
                              isCompared ? 'bg-orange-600 text-white font-bold' : 'bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white border border-slate-200/90'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="p-4 sm:p-5 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${theme.badgeBg} truncate`}>
                              {p.category}
                            </span>
                            {p.subCategory && <span className="text-slate-500 font-normal truncate">/ {p.subCategory}</span>}
                          </div>

                          <h3 className={`text-base font-bold text-slate-900 font-heading ${theme.accentText} transition-colors line-clamp-1`}>
                            {p.name}
                          </h3>

                          {/* Pricing & MOQ */}
                          {(p.priceINR || p.priceUSD) && (
                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-sm font-extrabold font-mono text-slate-900">
                                ₹{(p.priceINR || (p.priceUSD ? p.priceUSD * 85 : 0)).toLocaleString('en-IN')}
                              </span>
                              {p.minOrderQty && <span className="text-[10px] font-mono text-slate-500">MOQ: {p.minOrderQty}</span>}
                            </div>
                          )}

                          {/* Bullet point or tagline */}
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {Array.isArray(p.bulletPoints) && p.bulletPoints[0] ? `• ${p.bulletPoints[0]}` : p.tagline}
                          </p>

                          {Array.isArray(p.specifications) && p.specifications.length > 0 && (
                            <div className={`pt-2 mt-2 border-t border-black/5 ${theme.specBg} rounded-lg p-2 flex flex-wrap gap-1.5 backdrop-blur-xs`}>
                              {p.specifications.slice(0, 2).map((s, i) => (
                                <span key={i} className="text-[10px] font-mono text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                                  <strong>{s.label}:</strong> {s.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`px-4 sm:px-5 py-3 border-t ${theme.footerBg} flex flex-wrap items-center justify-between gap-2`}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(p);
                          }}
                          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 font-mono transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" /> Specs & 3D
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCatalogModal({ product: p, resourceType: 'PRODUCT' });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 bg-white hover:bg-orange-50 transition-colors shadow-2xs"
                            title="Download Technical Catalog / Datasheet"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-600" />
                          </button>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(p);
                              setActiveView('public-rfq');
                            }}
                            className={`px-3 py-1.5 rounded-lg ${theme.btnBg} text-white text-xs font-mono font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer`}
                          >
                            Get Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => setSelectedProduct(p)} className="english-card p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:border-orange-400">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      onError={(e) => {
                        e.currentTarget.src = '/catalog_pages/page_4.png';
                      }}
                      className="w-32 h-24 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0" 
                    />
                    
                    <div className="flex-1 space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-orange-700 font-bold">{p.sku}</span>
                        <span className="text-[10px] text-slate-700 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{p.category}</span>
                        {p.subCategory && <span className="text-[10px] text-orange-700 font-mono bg-orange-50 px-2 py-0.5 rounded">{p.subCategory}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-orange-600">{p.name}</h3>
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">{p.description}</p>
                      
                      {/* Price & Lead time */}
                      <div className="flex items-center gap-4 text-xs font-mono pt-1">
                        {(p.priceINR || p.priceUSD) && (
                          <span className="font-bold text-slate-900">
                            ₹{(p.priceINR || (p.priceUSD ? p.priceUSD * 85 : 0)).toLocaleString('en-IN')}
                          </span>
                        )}
                        {p.standardLeadTimeDays && <span className="text-slate-500">Lead Time: {p.standardLeadTimeDays} days</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedProduct(p)}
                        className="btn-secondary text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-600" /> Specs
                      </button>

                      <button
                        onClick={() => openCatalogModal({ product: p, resourceType: 'PRODUCT' })}
                        className="btn-secondary text-xs text-orange-700 border-orange-300 hover:bg-orange-50"
                        title="Download Technical Catalog / Datasheet"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-600" /> Catalog
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveView('public-rfq');
                        }}
                        className="btn-primary text-xs"
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
