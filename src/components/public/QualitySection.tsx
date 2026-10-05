import React from 'react';
import { ShieldCheck, Award, Microscope, CheckCircle2, ScanLine } from 'lucide-react';

export const QualitySection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-950 via-[#0B111E] to-slate-950 text-white border-y border-slate-800/80 relative overflow-hidden">
      
      {/* Background Ambient Mesh Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Quality Descriptions & Certification Badges */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Section 08 — Quality & Compliance</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Zero-Defect Standard & Verified Quality Control
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Every component manufactured at Weldor undergoes a multi-gate quality verification process. Raw material heats are verified via spectrometer analysis, CNC dimensions are checked via Zeiss CMM probes, and gas regulators & torches undergo 100% hydrostatic and pneumatic leak testing.
            </p>

            {/* 3 Verification Cards with Dark Glassmorphism */}
            <div className="space-y-4 pt-1">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 transition-all shadow-lg group">
                <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading group-hover:text-orange-400 transition-colors">
                    ISO 9001:2015 & AS9100D Certified
                  </h4>
                  <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
                    Audited quality management system with full raw material heat code traceability and melt cert verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all shadow-lg group">
                <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading group-hover:text-blue-400 transition-colors">
                    In-House Metallurgical & Corrosion Lab
                  </h4>
                  <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
                    1000-Hour ASTM B117 salt spray testing, alloy spectrometry, and micro-hardness verification up to 65 HRC.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-lg group">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading group-hover:text-emerald-400 transition-colors">
                    100% End-of-Line Pressure Hold Test
                  </h4>
                  <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
                    Zero nitrogen bubble leakage guaranteed on every gas regulator and torch before packaging and export.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Attractive High-Tech Quality Inspection Visual Card with Floating Glassmorphic Stats */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-5 sm:p-7 group bg-slate-950">
              
              {/* Background Quality Lab Photo with Smooth Zoom on Hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('/images/quality_inspection_lab.jpg')` }}
              />
              
              {/* Gradients: Vignette at the Top, Rich Dark Glass at the Bottom for High-Contrast Stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />

              {/* Top Header Floating Badges */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Zeiss Contura CMM 3D Probe</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/90 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-wide uppercase shadow-md">
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Active Metrology Lab</span>
                </div>
              </div>

              {/* Center Subtle Accent Callout */}
              <div className="relative z-10 py-4 sm:py-6">
                <div className="max-w-xs bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white/90 shadow-xl hidden sm:block">
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                    Continuous In-Process Inspection
                  </p>
                  <p className="text-xs text-slate-200 mt-1 leading-snug">
                    Coordinate measuring, optical profile projection, and hydrostatic burst-testing on 100% of critical gas equipment batches.
                  </p>
                </div>
              </div>

              {/* Bottom 4 Glassmorphism Metric Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3.5">
                
                {/* Stat 1 */}
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-3.5 sm:p-4 rounded-2xl text-center shadow-lg transition-all hover:border-orange-500/50 hover:bg-slate-900/95">
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-400">100%</p>
                  <p className="text-[11px] sm:text-xs font-mono text-white font-bold mt-0.5">Hydrostatic Tested</p>
                  <p className="text-[10px] text-slate-300 font-medium">Every valve & torch</p>
                </div>

                {/* Stat 2 */}
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-3.5 sm:p-4 rounded-2xl text-center shadow-lg transition-all hover:border-cyan-400/50 hover:bg-slate-900/95">
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-cyan-300 whitespace-nowrap">±0.005mm</p>
                  <p className="text-[11px] sm:text-xs font-mono text-white font-bold mt-0.5">CMM Machine Limit</p>
                  <p className="text-[10px] text-slate-300 font-medium">Zeiss 3D Probe Checked</p>
                </div>

                {/* Stat 3 */}
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-3.5 sm:p-4 rounded-2xl text-center shadow-lg transition-all hover:border-blue-400/50 hover:bg-slate-900/95">
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">1000 Hrs</p>
                  <p className="text-[11px] sm:text-xs font-mono text-white font-bold mt-0.5">Salt Spray Resistance</p>
                  <p className="text-[10px] text-slate-300 font-medium">ASTM B117 Lab Verified</p>
                </div>

                {/* Stat 4 */}
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/15 p-3.5 sm:p-4 rounded-2xl text-center shadow-lg transition-all hover:border-emerald-400/50 hover:bg-slate-900/95">
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-emerald-400 whitespace-nowrap">0.05 cc/m</p>
                  <p className="text-[11px] sm:text-xs font-mono text-white font-bold mt-0.5">Max Spool Leakage</p>
                  <p className="text-[10px] text-slate-300 font-medium">300 Bar Gas Rated</p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
