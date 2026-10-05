import React, { useState, useEffect } from 'react';
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
  Compass,
  Download,
  Eye,
  X,
  FileText
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useApp();
  const [selectedCertModal, setSelectedCertModal] = useState<{
    title: string;
    authority: string;
    regNo: string;
    scope: string;
    image: string;
    pdfUrl: string;
  } | null>(null);

  // Escape key handler & scroll lock for certificate modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCertModal(null);
      }
    };
    if (selectedCertModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCertModal]);

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
      
      {/* 1. TOP HERO SECTION (Matching Image 2 with Real Industrial Background & Exact Preserved Text) */}
      <section className="relative bg-[#0d131d] text-white py-24 sm:py-32 overflow-hidden border-b border-slate-800">
        {/* Real Industrial High-Resolution Plant Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/banners/hero_welding_plant.jpg')` }}
        />
        {/* Cinematic Vignette & Precision Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d131d] via-[#0d131d]/90 to-[#0d131d]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d131d] via-transparent to-[#0d131d]/50 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-xs">
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

      {/* 2. COMPANY VALUES SECTION (Aesthetic, Premium Engineering Redesign - Image 3) */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Authentic Zeiss 3D CMM Quality Lab with Industrial Frame */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 aspect-[4/5] flex items-center justify-center">
              <img 
                src="/images/quality_inspection_lab.jpg" 
                alt="Zeiss 3D CMM Metrology Quality Lab" 
                onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

              {/* Top Industrial Stamp */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-slate-900/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700 backdrop-blur-md shadow-sm">
                  PLANT: JAMNAGAR, GUJARAT
                </span>
              </div>
              
              {/* Bottom Calibrated Quality Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-orange-400 font-mono text-xs font-bold uppercase">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    <span>Metrology Assured</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    ±0.005mm
                  </span>
                </div>
                <p className="font-heading font-bold text-sm text-slate-100">
                  100% Dimensional Accuracy Tested on Zeiss 3D CMM
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Calibrated to ISO 9001:2015 & European Welding Standards
                </p>
              </div>
            </div>
          </div>

          {/* Right: Company Values Grid with Polished Industrial Aesthetics */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>OUR PHILOSOPHY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
                Company Values
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Our bedrock operating principles ensure consistent high-volume delivery for Tier-1 automotive and heavy fabrication OEMs worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {companyValues.map((val, idx) => {
                const IconComp = val.icon;
                const indexNumber = `0${idx + 1}`;

                return (
                  <div 
                    key={idx} 
                    className="p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/70 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500 transition-all duration-300 space-y-3.5 relative overflow-hidden group"
                  >
                    {/* Top Right Monospace Index */}
                    <span className="absolute top-5 right-5 font-mono text-xl font-black text-slate-300 group-hover:text-orange-400/70 transition-colors">
                      {indexNumber}
                    </span>

                    <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200/90 text-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
                      <IconComp className="w-5 h-5 transition-colors" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-heading group-hover:text-orange-600 transition-colors">
                        {val.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-medium">
                        {val.desc}
                      </p>
                    </div>

                    {/* Bottom subtle accent line */}
                    <div className="h-0.5 w-8 bg-orange-500/0 group-hover:w-full group-hover:bg-orange-500/80 transition-all duration-500 rounded-full" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. FOUNDER'S MESSAGE SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 relative overflow-hidden">
        {/* Subtle ambient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Label */}
          <div className="flex items-center gap-2 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-mono font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              FOUNDER'S MESSAGE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left: Founder Photo Card */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
              <div className="relative group w-full max-w-sm mx-auto lg:mx-0">
                {/* Orange glow accent behind photo */}
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600 rounded-3xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Photo Frame — Professional executive framing */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-[#F5F3EE]">
                  <img
                    src="/images/kevin_dholariya_founder.jpg"
                    alt="Kevin Dholariya – Founder & Managing Director, Weldor by Earth Metal Industries"
                    className="w-full h-auto object-cover block group-hover:scale-[1.02] transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }}
                  />

                  {/* Name badge below photo */}
                  <div className="px-5 py-4 bg-white border-t border-slate-100">
                    <p className="font-extrabold text-slate-900 font-heading text-lg leading-tight">Kevin Dholariya</p>
                    <p className="text-xs text-orange-600 font-semibold mt-1">Founder & Managing Director</p>
                    <p className="text-xs text-slate-500 mt-0.5">Weldor · Jamnagar, Gujarat</p>
                  </div>
                </div>

                {/* Floating credibility badge */}
                <div className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white">
                  Est. 2011
                </div>
              </div>
            </div>

            {/* Right: Message Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Large quote mark */}
              <div className="text-orange-500/25 font-serif text-[120px] leading-none select-none -mb-10 -mt-4" aria-hidden="true">"</div>

              <div className="space-y-5 relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                  Crafted With Purpose,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Delivered With Pride.</span>
                </h2>

                <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-normal">
                  <p>
                    When I founded Earth Metal Industries in 2011, I had one clear goal — to build a company where every component we manufacture would be a reflection of our integrity and craftsmanship. In an industry where precision is everything, we chose to invest in people, technology, and processes that could consistently deliver excellence.
                  </p>
                  <p>
                    Today, <strong className="text-slate-900">Weldor</strong> stands as a trusted OEM partner to leading welding and industrial fabrication companies across India and international markets. Our advanced Swiss CNC machining facility in Jamnagar, our ISO 9001:2015 certified quality lab, and our team of dedicated engineers are the backbone of that trust.
                  </p>
                  <p>
                    We don't just manufacture parts — we engineer reliability. Every MIG torch, every gas regulator, every precision consumable that leaves our plant carries our commitment to zero defects, on-time delivery, and long-term customer success.
                  </p>
                </div>

                {/* Signature block */}
                <div className="pt-4 border-t border-slate-200 flex items-center gap-4">
                  <div>
                    <p className="font-extrabold text-slate-900 text-base font-heading">Kevin Dholariya</p>
                    <p className="text-xs text-orange-600 font-semibold">Founder & Managing Director</p>
                    <p className="text-xs text-slate-500">Earth Metal Industries · Jamnagar, Gujarat</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ISO 9001:2015 Certified
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                      <Award className="w-3.5 h-3.5" /> 15+ Years of Excellence
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES SPOTLIGHT (Matching Image 3 Dark Stage) */}
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
            
            {/* Spotlight 1: Gas Regulators & Pressure Equipment */}
            <div 
              onClick={() => setActiveView('public-products')}
              className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="h-48 sm:h-52 rounded-2xl bg-slate-950 flex items-center justify-center mb-6 overflow-hidden border border-slate-800 relative">
                <img 
                  src="/images/quality_inspection_lab.jpg" 
                  alt="Precision Gas Regulators & Inspection Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-600/90 text-white backdrop-blur shadow">
                  300 Bar Forged Brass
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>Gas Regulators & Control Valves</span>
                  <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Heavy forged brass dual-gauge gas pressure regulators, stainless steel diaphragms, and precision micro-adjustment valves for oxygen, argon, and LPG.
                </p>
              </div>
            </div>

            {/* Spotlight 2: Welding Components & Torches */}
            <div 
              onClick={() => setActiveView('public-products')}
              className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="h-48 sm:h-52 rounded-2xl bg-slate-950 flex items-center justify-center mb-6 overflow-hidden border border-slate-800 relative">
                <img 
                  src="/images/banners/hero_welding_torch.jpg" 
                  alt="Welding Components & Industrial Torches"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-600/90 text-white backdrop-blur shadow">
                  MIG, TIG & Plasma Range
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>Welding Torches & Consumables</span>
                  <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  High-conductivity CuCrZr contact tips, conical gas nozzles, ceramic diffusers, and heavy-duty 24KD/36KD & PANA style automated torches.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. OUR CERTIFICATIONS SECTION (Real TÜV SÜD ISO 9001:2015 & Govt. of India ZED Silver) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>ACCORDED ACCREDITATIONS & COMPLIANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Official Quality Certifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            Earth Metal Industries is certified by international and national accreditation bodies with complete metallurgical traceability and strict zero-defect quality systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Certificate 1: ISO 9001:2015 (TÜV SÜD South Asia) */}
          <div className="bg-white p-6 rounded-3xl border-2 border-orange-300 shadow-lg hover:shadow-2xl hover:border-orange-500 transition-all space-y-4 flex flex-col justify-between relative group">
            <div className="absolute -top-3 right-6 bg-orange-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
              PRIMARY QA STANDARD
            </div>
            
            <div className="space-y-4">
              <div 
                onClick={() => setSelectedCertModal({
                  title: "ISO 9001:2015 Quality Management System Certificate",
                  authority: "TÜV SÜD South Asia Private Limited",
                  regNo: "Earth Metal Industries (Plot 588, GIDC Phase 2, Dared, Jamnagar)",
                  scope: "Manufacturing and Supply of Ferrous and Non Ferrous Metal Machined Components",
                  image: "/certificates/iso_page_1.png",
                  pdfUrl: "/certificates/ISO_9001_2015_Certificate.pdf"
                })}
                className="h-64 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative cursor-pointer group"
              >
                <img 
                  src="/certificates/iso_page_1.png" 
                  alt="ISO 9001:2015 Certificate - TÜV SÜD"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-mono text-xs font-bold flex items-center gap-1 shadow">
                    <Eye className="w-3.5 h-3.5" /> View Certificate
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">
                  TÜV SÜD SOUTH ASIA
                </span>
                <h4 className="font-extrabold text-base text-slate-900 font-heading pt-1">
                  ISO 9001:2015 Registration
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Certified for Manufacturing & Supply of Ferrous and Non-Ferrous Metal Machined Components at Jamnagar plant.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span className="text-slate-500">Body: TÜV SÜD</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCertModal({
                    title: "ISO 9001:2015 Quality Management System Certificate",
                    authority: "TÜV SÜD South Asia Private Limited",
                    regNo: "Earth Metal Industries (Plot 588, GIDC Phase 2, Dared, Jamnagar)",
                    scope: "Manufacturing and Supply of Ferrous and Non Ferrous Metal Machined Components",
                    image: "/certificates/iso_page_1.png",
                    pdfUrl: "/certificates/ISO_9001_2015_Certificate.pdf"
                  })}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <a
                  href="/certificates/ISO_9001_2015_Certificate.pdf"
                  download="Weldor_ISO_9001_2015_Certificate.pdf"
                  className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            </div>
          </div>

          {/* Certificate 2: MSME Sustainable (ZED) Silver Certificate */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-orange-400 transition-all space-y-4 flex flex-col justify-between relative group">
            <div className="absolute -top-3 right-6 bg-slate-800 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
              GOVT. OF INDIA
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setSelectedCertModal({
                  title: "MSME Sustainable (ZED) Silver Quality Certificate",
                  authority: "Ministry of Micro, Small & Medium Enterprises, Govt. of India",
                  regNo: "UDYAM-GJ-10-0015947 | Cert: 25032026_466755",
                  scope: "Manufacture of Basic Metals & Precision Machined Components",
                  image: "/certificates/silver_page_1.png",
                  pdfUrl: "/certificates/Silver_Quality_Certificate.pdf"
                })}
                className="h-64 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative cursor-pointer group"
              >
                <img 
                  src="/certificates/silver_page_1.png" 
                  alt="MSME ZED Silver Certificate - Govt of India"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-mono text-xs font-bold flex items-center gap-1 shadow">
                    <Eye className="w-3.5 h-3.5" /> View Certificate
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase">
                  MINISTRY OF MSME (ZED)
                </span>
                <h4 className="font-extrabold text-base text-slate-900 font-heading pt-1">
                  MSME ZED Silver Rating
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sustainable Zero Defect Zero Effect manufacturing scheme awarded to Earth Metal Industries (UDYAM-GJ-10-0015947).
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span className="text-slate-500">Agency: Conformity India</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCertModal({
                    title: "MSME Sustainable (ZED) Silver Quality Certificate",
                    authority: "Ministry of Micro, Small & Medium Enterprises, Govt. of India",
                    regNo: "UDYAM-GJ-10-0015947 | Cert: 25032026_466755",
                    scope: "Manufacture of Basic Metals & Precision Machined Components",
                    image: "/certificates/silver_page_1.png",
                    pdfUrl: "/certificates/Silver_Quality_Certificate.pdf"
                  })}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <a
                  href="/certificates/Silver_Quality_Certificate.pdf"
                  download="Weldor_MSME_ZED_Silver_Certificate.pdf"
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            </div>
          </div>

          {/* Certificate 3: Material & Lab QA Dossier */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-orange-400 transition-all space-y-4 flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="h-64 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden relative flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/80 border border-orange-500/30 px-3 py-1 rounded-full uppercase mb-2">
                  EN 10204 TYPE 3.1
                </span>
                <h4 className="font-extrabold text-sm font-heading text-white">
                  Metallurgical & CMM Inspection Dossier
                </h4>
                <p className="text-[11px] text-slate-300 mt-2 line-clamp-3">
                  100% Spectrometry chemical composition report, hardness tests, and 3D coordinate measuring inspection with every dispatch batch.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                  LAB TESTING STANDARDS
                </span>
                <h4 className="font-extrabold text-base text-slate-900 font-heading pt-1">
                  Chemical & Physical QA Testing
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  IS 319, CW614N, CuCrZr raw material certification with hydrostatic burst pressure testing up to 700 Bar.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span className="text-slate-500">Traceable: Batch Wise</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tested
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/catalog/Weldor_Welding_Product_Catalog.pdf"
                  download="Weldor_Welding_Product_Catalog.pdf"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors col-span-2 text-center"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" /> Download Product Catalog
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. WELDOR BY EARTH METAL INDUSTRIES HIGHLIGHTS (With Proper Industrial Background) */}
      <section className="py-24 bg-slate-950 text-white border-y border-slate-800 relative overflow-hidden">
        
        {/* Proper Industrial Manufacturing Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none" 
          style={{ backgroundImage: `url('/images/banners/hero_welding_plant.jpg')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                PRECISION MANUFACTURING • JAMNAGAR
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white leading-tight tracking-tight">
                Weldor by Earth Metal Industries
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Operating out of Jamnagar, the brass and engineering hub of India, we provide end-to-end component engineering solutions. From raw alloy extrusion to CNC turning, milling, surface finishing, and assembly, our manufacturing plant delivers superior industrial quality to customers globally.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveView('public-contact')}
                  className="px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-orange-600/40 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Get in Touch With Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: 6 Highlight Blocks in Dark Glassmorphism */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {capabilities.map((cap, cIdx) => (
                <div 
                  key={cIdx} 
                  className="p-5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900/95 shadow-xl space-y-2 transition-all group"
                >
                  <h4 className="font-bold text-sm text-white font-heading flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                    <span>{cap.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
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

      {/* 8. DEDICATED OFFICIAL CERTIFICATE PREVIEW MODAL */}
      {selectedCertModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCertModal(null);
          }}
        >
          {/* Fixed Floating Screen Close Button (Always visible on screen, never scrolls away) */}
          <button 
            type="button"
            onClick={() => setSelectedCertModal(null)}
            aria-label="Close Certificate Preview"
            title="Close Modal (Esc)"
            className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[120] p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-rose-600 text-white shadow-2xl border border-slate-700 hover:border-rose-500 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-xs font-mono font-bold hidden sm:inline">CLOSE</span>
          </button>

          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-4 sm:my-8">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest block">
                  OFFICIAL ACCREDITATION PREVIEW
                </span>
                <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
                  {selectedCertModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertModal(null)}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Image View */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 bg-slate-100 rounded-2xl p-2 border border-slate-200 flex items-center justify-center">
                <img 
                  src={selectedCertModal.image} 
                  alt={selectedCertModal.title} 
                  className="max-h-[60vh] object-contain rounded-xl shadow-sm"
                />
              </div>

              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-orange-700 uppercase">Issuing Authority</span>
                  <p className="text-xs font-bold text-slate-900">{selectedCertModal.authority}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Registration / Certificate ID</span>
                  <p className="text-xs font-mono font-semibold text-slate-800">{selectedCertModal.regNo}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Certified Scope</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedCertModal.scope}</p>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedCertModal.pdfUrl}
                    download
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Original PDF Certificate</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
