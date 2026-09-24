import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Cpu, 
  Factory, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Wrench,
  Gauge,
  Flame,
  FileCheck2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Zap,
  Target,
  Users,
  Compass
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useApp();

  const googleMapsUrl = "https://www.google.com/maps/place/Weldor+by+Earth+Metal+Industries/@22.4145771,70.059849,17z/data=!3m1!4b1!4m6!3m5!1s0x39576b0f8c29599d:0x4b5181f8c3ddc48!8m2!3d22.4145771!4d70.059849!16s%2Fg%2F11fj_75ywj?hl=en-US&entry=ttu";
  const embedMapUrl = "https://maps.google.com/maps?q=22.4145771,70.059849&hl=en&z=16&output=embed";

  const companyValues = [
    {
      title: 'Precision Engineering',
      desc: 'Advanced multi-axis CNC turning and Swiss-type sliding head machines ensure tight micron-level tolerances on every production batch.',
      icon: Cpu,
    },
    {
      title: 'Innovation Driven',
      desc: 'Constantly investing in metallurgy research, custom alloy blends (IS 319, CW614N), and low-friction surface passivation coatings.',
      icon: Sparkles,
    },
    {
      title: 'Integrity in Every Weld',
      desc: '100% pneumatic leak testing, automated nitrogen hydrostatic validation up to 700 Bar, and zero-defect quality culture.',
      icon: ShieldCheck,
    },
    {
      title: 'Customer-Centric Approach',
      desc: 'Rapid 2-hour drawing review turnaround, rapid prototype dispatches, tailored B2B packaging, and dependable on-time delivery.',
      icon: Users,
    },
  ];

  const capabilities = [
    {
      title: 'High-Speed CNC Machining',
      desc: 'State-of-the-art Japanese CNC machines delivering high-speed precision repetition and micro-surface finishes.',
    },
    {
      title: 'Custom Engineering',
      desc: 'Tailored OEM manufacturing directly from 2D/3D CAD drawings (STEP, DWG, DXF) to exact customer specs.',
    },
    {
      title: 'Lean & Premium Brass',
      desc: 'Sourced from certified high-purity virgin copper and zinc alloys with complete metallurgical traceability.',
    },
    {
      title: 'Corrosion Resistance',
      desc: 'Specialized trivalent zinc, electroless nickel, and hard chrome coatings engineered for 1000+ hrs salt spray performance.',
    },
    {
      title: 'Quick Prototyping',
      desc: 'Rapid tooling and dedicated sample cells delivering pilot prototypes within 48 to 72 hours.',
    },
    {
      title: 'Strict Quality Control',
      desc: 'In-house coordinate measuring machines (CMM), optical profile projectors, and spectrometry verification.',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-900 font-sans">
      
      {/* 1. TOP HERO SECTION (Matching Image 3 Dark Architecture Aesthetic) */}
      <section className="relative bg-[#131b26] text-white py-24 sm:py-32 overflow-hidden border-b border-slate-800">
        {/* Perspective Geometric Architectural Grid / Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>ABOUT US</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-[1.1]">
              Built for Precision.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Driven by Progress.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              At <strong className="text-white font-semibold">Weldor by Earth Metal Industries</strong>, we engineer high precision Pneumatic, Hydraulic and Welding components with uncompromising quality, cutting-edge technology, and end-to-end custom manufacturing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveView('public-contact')}
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('public-products')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm font-mono border border-slate-700 transition-colors cursor-pointer"
              >
                Explore Product Catalog
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COMPANY VALUES SECTION (Matching Image 3 Layout) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Manufacturing / Inspection Lighting Visual Image */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/5] flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=900" 
                alt="Precision CNC Quality Inspection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Quality Assured</span>
                </div>
                <p className="font-heading font-bold text-sm">
                  100% Dimensional Accuracy Tested on 3D CMM
                </p>
              </div>
            </div>
          </div>

          {/* Right: Company Values Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block mb-1">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
                Company Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {companyValues.map((val, idx) => {
                const IconComp = val.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 font-heading">
                      {val.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES SPOTLIGHT (Matching Image 3 Dark Stage) */}
      <section className="py-16 bg-[#111923] text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block mb-1">
                MANUFACTURING DIVISIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Core Product Lines
              </h2>
            </div>

            <button
              onClick={() => setActiveView('public-products')}
              className="text-xs font-mono text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 cursor-pointer underline"
            >
              <span>View All 500+ Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Spotlight 1: Pneumatic & Hydraulic */}
            <div 
              onClick={() => setActiveView('public-products')}
              className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 overflow-hidden border border-slate-700/60">
                <img 
                  src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=700" 
                  alt="Pneumatic & Hydraulic Components"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-orange-400 transition-colors">
                    Pneumatic & Hydraulic →
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    Heavy-duty ISO pneumatic cylinders, high pressure 700 Bar hydraulic directional valves, quick connect couplings, and precision manifolds.
                  </p>
                </div>
              </div>
            </div>

            {/* Spotlight 2: Welding Components */}
            <div 
              onClick={() => setActiveView('public-products')}
              className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 overflow-hidden border border-slate-700/60">
                <img 
                  src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=700" 
                  alt="Welding Components & Torches"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-orange-400 transition-colors">
                    Welding Components →
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    High conductivity CuCrZr contact tips, conical gas nozzles, ceramic gas diffusers, and automated robotic MIG/TIG torch assemblies.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. OUR CERTIFICATIONS SECTION (Matching Image 3 Clean Presentation) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-orange-600 tracking-tight">
            Our Certifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Certified by national and international accreditation bodies for strict Quality Management Systems and Sustainable Manufacturing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Certificate 1: ZED Bronze MSME */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-orange-400 transition-all space-y-4">
            <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase mb-2">
                GOVT. OF INDIA MSME
              </span>
              <h4 className="font-extrabold text-base text-slate-900 font-heading">
                ZED Bronze Certified
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero Defect Zero Effect Manufacturing accreditation by Ministry of MSME.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 pt-1">
              <span>Status: Active</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>

          {/* Certificate 2: ISO 9001:2015 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-orange-300 shadow-md hover:shadow-xl hover:border-orange-500 transition-all space-y-4 relative">
            <div className="absolute -top-3 right-6 bg-orange-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
              PRIMARY STANDARD
            </div>
            <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full uppercase mb-2">
                QUALITY MANAGEMENT
              </span>
              <h4 className="font-extrabold text-base text-slate-900 font-heading">
                ISO 9001:2015 Registration
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Quality Management System certified for design, machining & distribution of industrial components.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 pt-1">
              <span>Audited Annually</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified
              </span>
            </div>
          </div>

          {/* Certificate 3: Material Test & Inspection Report */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-orange-400 transition-all space-y-4">
            <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-3">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full uppercase mb-2">
                LAB VERIFICATION
              </span>
              <h4 className="font-extrabold text-base text-slate-900 font-heading">
                Material & Inspection Reports
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                EN 10204 3.1 chemical spectrometry analysis and 3D CMM dimensional inspection certificate with every batch.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 pt-1">
              <span>Batch Traceable</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. WELDOR BY EARTH METAL INDUSTRIES HIGHLIGHTS (Matching Image 3) */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block">
                PRECISION MANUFACTURING
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 leading-tight">
                Weldor by Earth Metal Industries
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating out of Jamnagar, the brass and engineering hub of India, we provide end-to-end component engineering solutions. From raw alloy extrusion to CNC turning, milling, surface finishing, and assembly, our manufacturing plant delivers superior industrial quality to customers globally.
              </p>

              <button
                onClick={() => setActiveView('public-contact')}
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: 6 Highlight Blocks */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {capabilities.map((cap, cIdx) => (
                <div 
                  key={cIdx} 
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2 hover:bg-orange-50/40 hover:border-orange-300 transition-colors"
                >
                  <h4 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{cap.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA BANNER: "Let's Build Something Remarkable" (Matching Image 3) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#131b26] text-white border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-transparent pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Let's Build Something Remarkable
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ready to elevate your manufacturing with custom engineered components? Partner with Weldor today for fast quotes, prototype trials, and dependable mass production.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              onClick={() => setActiveView('public-rfq')}
              className="px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Upload CAD & Request Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('public-contact')}
              className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm font-mono border border-slate-700 transition-colors cursor-pointer"
            >
              Contact Our Sales Team
            </button>
          </div>
        </div>
      </section>

      {/* 7. PLANT LOCATION & GOOGLE MAPS SECTION */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-1">
                JAMNAGAR PLANT CAMPUS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                Facility Location & Visiting Us
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-sm shrink-0 w-fit"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Interactive Map Iframe */}
          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <iframe
              title="Weldor by Earth Metal Industries Google Map"
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

        </div>
      </section>

    </div>
  );
};
