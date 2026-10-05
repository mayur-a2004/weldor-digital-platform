import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Scale } from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const { compareList, isCompareOpen, setIsCompareOpen, toggleCompare, setActiveView } = useApp();

  // Escape key handler & scroll lock for compare modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCompareOpen(false);
      }
    };
    if (isCompareOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isCompareOpen]);

  if (!isCompareOpen || compareList.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 md:p-8 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCompareOpen(false);
      }}
    >
      {/* Fixed Floating Screen Close Button (Always visible on screen, never scrolls away) */}
      <button 
        type="button"
        onClick={() => setIsCompareOpen(false)}
        aria-label="Close Comparison Tray"
        title="Close Modal (Esc)"
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[120] p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-rose-600 text-white shadow-2xl border border-slate-700 hover:border-rose-500 transition-all flex items-center gap-2 cursor-pointer group"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        <span className="text-xs font-mono font-bold hidden sm:inline">CLOSE</span>
      </button>

      <div className="bg-white border border-slate-300 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 my-4 sm:my-8">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Product Technical Comparison Tray ({compareList.length} Items)
            </h2>
          </div>

          <button 
            onClick={() => setIsCompareOpen(false)}
            className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50 font-mono">
                <th className="p-3 border border-slate-200 text-slate-700 font-bold w-40">TECHNICAL ATTR</th>
                {compareList.map(p => (
                  <th key={p.id} className="p-3 border border-slate-200 text-slate-900 font-bold min-w-[200px]">
                    <div className="space-y-2">
                      <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg bg-slate-100 border border-slate-200" />
                      <p className="text-orange-700 text-xs font-mono">{p.sku}</p>
                      <p className="text-sm font-heading">{p.name}</p>
                      <button
                        onClick={() => toggleCompare(p)}
                        className="text-[11px] text-rose-600 hover:underline font-mono font-bold"
                      >
                        Remove Component
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Category</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-medium">{p.category}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Min Order Qty</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{p.minOrderQty} PCS</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Lead Time</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-mono font-bold text-orange-700">{p.standardLeadTimeDays} Days</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Certifications</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200 font-medium">{(p.certifications || []).join(', ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-700 font-bold bg-slate-50">Commercial RFQ</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3 border border-slate-200">
                    <button
                      onClick={() => {
                        setIsCompareOpen(false);
                        setActiveView('public-rfq');
                      }}
                      className="btn-primary text-xs w-full justify-center shadow-sm"
                    >
                      Request Quote
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
