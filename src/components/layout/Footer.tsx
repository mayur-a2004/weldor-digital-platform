import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  ArrowRight,
  MessageSquare,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-900 pt-10 sm:pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top CTA Banner in Footer with Rich Background & Attractive Color */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-[#182333] to-slate-950 border border-slate-800 text-white p-6 sm:p-8 mb-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">

          {/* Background Industrial Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            style={{ backgroundImage: `url('/images/banners/hero_welding_plant.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              B2B MANUFACTURING PARTNER
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-3 tracking-tight">
              Have a Custom Engineering Drawing or Component Requirement?
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Our Jamnagar engineering team evaluates CAD drawings within 2 hours. Get prototype samples, 3D STEP models, and direct factory volume pricing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              onClick={() => setActiveView('public-rfq')}
              className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-600/40 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <span>Upload CAD Drawing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Engineering%20Team', '_blank');
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-xs sm:text-sm backdrop-blur flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Sales</span>
            </button>
          </div>
        </div>

        {/* 4 Balanced Columns Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-200">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/weldor-logo.png"
                alt="Weldor"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              ISO 9001:2015 certified manufacturer of Welding and Cutting Consumables
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-orange-800 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> ISO 9001:2015
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> MSME ZED Silver
              </span>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Product Divisions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors text-left">
                  MIG / CO2 & TIG Consumables
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors text-left">
                  Plasma & Gas Cutting Consumables
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors text-left">
                  Presser Gas Regulators
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-products')} className="hover:text-orange-600 transition-colors text-left">
                  Leser Welding & Cutting Consumables
                </button>
              </li>

            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              <li>
                <button onClick={() => setActiveView('public-home')} className="hover:text-orange-600 transition-colors text-left">
                  Company Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-about')} className="hover:text-orange-600 transition-colors text-left">
                  About Us & Legacy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-contact')} className="hover:text-orange-600 transition-colors text-left">
                  Contact Us & Plant Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-gallery')} className="hover:text-orange-600 transition-colors text-left">
                  Media & Factory Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public-rfq')} className="hover:text-orange-600 transition-colors text-left">
                  Instant Factory RFQ Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Plant Headquarters
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="tel:+918780098088" className="hover:text-orange-600 font-mono font-semibold">+91-87800 98088</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <a href="mailto:brm@weldorindustries.com" className="hover:text-orange-600 font-mono">brm@weldorindustries.com</a>
              </li>
              <li className="pt-0.5">
                <a
                  href="https://www.google.com/maps/place/Weldor+by+Earth+Metal+Industries/@22.4145771,70.059849,17z/data=!3m1!4b1!4m6!3m5!1s0x39576b0f8c29599d:0x4b5181f8c3ddc48!8m2!3d22.4145771!4d70.059849!16s%2Fg%2F11fj_75ywj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold underline"
                >
                  <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & CRM Internal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4 font-semibold">
          <p>© {new Date().getFullYear()} Weldor by Earth Metal Industries. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Supply</span>

            {/* Direct Internal Link to CRM / Admin Portal */}
            <button
              onClick={() => setActiveView('crm-dashboard')}
              className="text-orange-700 hover:text-orange-800 flex items-center gap-1 font-mono font-bold hover:underline"
              title="Employee & Sales Portal Access"
            >
              <Lock className="w-3.5 h-3.5 text-orange-600" /> Sales CRM Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
