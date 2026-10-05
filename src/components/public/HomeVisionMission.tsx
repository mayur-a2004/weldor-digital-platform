import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Target, Flame, ShieldCheck, Cpu, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomeVisionMission: React.FC = () => {
  const { setActiveView } = useApp();

  const pillars = [
    { icon: Cpu, text: 'Swiss CNC Precision Machining' },
    { icon: ShieldCheck, text: 'ISO 9001:2015 Certified Quality' },
    { icon: Flame, text: 'Zero-Leak Hydraulic Testing' },
    { icon: Users, text: 'Dedicated OEM Support Team' },
    { icon: CheckCircle2, text: '100% In-House Manufacturing' },
    { icon: CheckCircle2, text: 'Fast Prototype & Sample Dispatch' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-3">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Weldor by Earth Metal Industries
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            A precision manufacturing company from Jamnagar, Gujarat — engineering welding &amp; gas control components for industries across India and beyond.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Vision Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
                Our Vision
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
              To Be India&apos;s Most Trusted Welding Equipment Manufacturer
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We envision a future where Weldor is the first name every fabricator, OEM, and industrial plant trusts for precision welding torches, gas control equipment, and CNC-machined consumables — across India and global markets.
            </p>
            <div className="mt-6 h-0.5 w-10 bg-orange-500 rounded-full group-hover:w-full transition-all duration-500" />
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Our Mission
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
              Delivering Zero-Defect Components, On Time, Every Time
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our mission is to engineer and deliver precision-manufactured welding and gas control components with absolute consistency. Using advanced Swiss CNC technology, ISO 9001:2015 certified quality systems, and a customer-first culture, we ensure every component that leaves our Jamnagar plant meets the highest industrial standards.
            </p>
            <div className="mt-6 h-0.5 w-10 bg-slate-400 rounded-full group-hover:w-full transition-all duration-500" />
          </div>

        </div>

        {/* Core Commitments Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5 text-center">
            Our Core Commitments
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {pillars.map((p, i) => {
              const PIcon = p.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <PIcon className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 leading-snug">{p.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('public-about')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Read Full Company Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView('public-products')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 text-sm font-semibold transition-all cursor-pointer"
          >
            <span>Browse Our Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};