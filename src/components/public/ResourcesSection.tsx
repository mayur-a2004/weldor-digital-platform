import React from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileText } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const { openCatalogModal } = useApp();

  const resources: Array<{
    title: string;
    size: string;
    type: string;
    resourceType: 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
  }> = [
    { 
      title: 'Weldor Master B2B Component Catalog (2026)', 
      size: '14.8 MB', 
      type: 'PDF / E-Catalog',
      resourceType: 'MASTER_CATALOG'
    },
    { 
      title: '700 Bar Hydraulic Valves CAD 3D STEP Library', 
      size: '42.1 MB', 
      type: 'ZIP / 3D STEP',
      resourceType: 'VALVES_3D'
    },
    { 
      title: 'ISO 15552 Pneumatic Cylinder Dimensional Sheet', 
      size: '2.4 MB', 
      type: 'PDF / Blueprint',
      resourceType: 'CYLINDER_SHEET'
    },
    { 
      title: 'ISO 9001:2015 & AS9100D Certification Package', 
      size: '5.1 MB', 
      type: 'PDF / QA Dossier',
      resourceType: 'CERT_PACKAGE'
    },
  ];

  return (
    <section className="py-16 bg-[#F4F6F9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tech-label">Section 11 — Engineering Resources</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
              Technical Documents & CAD Downloads
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-xl font-medium">
              Download official Weldor product catalogs, 3D CAD STEP files, ISO certificates, and pressure test documentation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, i) => (
            <div 
              key={i}
              className="english-card p-6 rounded-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <FileText className="w-5 h-5" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 font-heading leading-snug">
                  {res.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-semibold">
                  <span>FORMAT: {res.type}</span>
                  <span>SIZE: {res.size}</span>
                </div>
              </div>

              <button
                onClick={() => openCatalogModal({ resourceType: res.resourceType, title: res.title })}
                className="w-full btn-secondary text-xs justify-center border-slate-300 shadow-sm font-bold"
              >
                <Download className="w-3.5 h-3.5 text-orange-600" /> Download Resource
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
