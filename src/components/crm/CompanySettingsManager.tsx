import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CompanySettings } from '../../types';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save, 
  CheckCircle2, 
  FileText,
  Sliders,
  IndianRupee
} from 'lucide-react';

export const CompanySettingsManager: React.FC = () => {
  const { companySettings, updateCompanySettings, hasPermission } = useApp();

  const [formData, setFormData] = useState<CompanySettings>(() => ({
    companyName: companySettings?.companyName || 'Weldor by Earth Metal Industries',
    brandName: companySettings?.brandName || 'WELDOR',
    legalName: companySettings?.legalEntityName || companySettings?.legalName || 'Earth Metal Industries',
    legalEntityName: companySettings?.legalEntityName || companySettings?.legalName || 'Earth Metal Industries',
    cinNumber: companySettings?.cinNumber || 'U29299GJ2005PTC045890',
    gstin: companySettings?.gstinNumber || companySettings?.gstin || '24AABCE1234F1Z5',
    gstinNumber: companySettings?.gstinNumber || companySettings?.gstin || '24AABCE1234F1Z5',
    panNumber: companySettings?.panNumber || 'AABCE1234F',
    iecCode: companySettings?.iecCode || '0812345678',
    msmeRegistrationNo: companySettings?.msmeRegistrationNo || 'UDYAM-GJ-15-0012345',
    registeredOffice: companySettings?.registeredOffice || 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
    factoryPlantAddress: companySettings?.factoryPlantAddress || 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
    registeredOfficeAddress: companySettings?.registeredOfficeAddress || {
      addressLine1: 'Plot No. 588, G.I.D.C. Phase 2',
      addressLine2: 'Dared',
      city: 'Jamnagar',
      state: 'Gujarat',
      country: 'India',
      pincode: '361004'
    },
    primaryEmail: companySettings?.supportEmail || companySettings?.primaryEmail || 'brm@weldorindustries.com',
    supportEmail: companySettings?.supportEmail || companySettings?.primaryEmail || 'brm@weldorindustries.com',
    primaryPhone: companySettings?.salesPhone || companySettings?.primaryPhone || '+91-87800 98088',
    salesPhone: companySettings?.salesPhone || companySettings?.primaryPhone || '+91-87800 98088',
    websiteUrl: companySettings?.websiteUrl || 'https://weldorindustries.com',
    fiscalYear: companySettings?.fiscalYear || '2026-2027',
    bankAccounts: companySettings?.bankAccounts || [],
    primaryBank: companySettings?.primaryBank || {
      bankName: 'HDFC Bank Ltd',
      accountName: 'Earth Metal Industries',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      branch: 'Dared GIDC, Jamnagar'
    },
    defaultTerms: companySettings?.defaultTerms || {
      paymentTerms: '50% Advance against Proforma, Balance before Dispatch',
      deliveryTerms: 'Ex-Factory Jamnagar / Ready Dispatch within 7-10 Business Days',
      validityDays: 30,
      warrantyTerms: '12 Months replacement warranty against manufacturing defects',
      packagingTerms: 'Export Standard Heavy-Duty Wooden Case with VCI Bag',
      inspectionTerms: '100% In-House Hydrostatic & Flame Test with EN 10204 3.1 MTC',
      generalTerms: '1. GST @ 18% Extra as applicable.\n2. Freight, Transit Insurance, and Octroi extra at actuals.\n3. Goods once sold will not be taken back unless approved.\n4. All disputes are subject to Jamnagar (Gujarat) jurisdiction only.'
    },
    slaSettings: companySettings?.slaSettings || {
      leadResponseHours: 2,
      quoteApprovalThresholdUSD: 50000,
      autoAssignSalesLead: true,
      enableWhatsAppNotifications: true,
      enablePayrollReminderDays: 5
    }
  }));

  React.useEffect(() => {
    if (companySettings) {
      setFormData(prev => ({
        ...prev,
        ...companySettings,
        companyName: companySettings.companyName || prev.companyName,
        legalEntityName: companySettings.legalEntityName || companySettings.legalName || prev.legalEntityName,
        legalName: companySettings.legalEntityName || companySettings.legalName || prev.legalName,
        gstinNumber: companySettings.gstinNumber || companySettings.gstin || prev.gstinNumber,
        gstin: companySettings.gstinNumber || companySettings.gstin || prev.gstin,
        panNumber: companySettings.panNumber || prev.panNumber,
        cinNumber: companySettings.cinNumber || prev.cinNumber,
        iecCode: companySettings.iecCode || prev.iecCode,
        registeredOffice: companySettings.registeredOffice || prev.registeredOffice,
        factoryPlantAddress: companySettings.factoryPlantAddress || prev.factoryPlantAddress,
        supportEmail: companySettings.supportEmail || companySettings.primaryEmail || prev.supportEmail,
        primaryEmail: companySettings.supportEmail || companySettings.primaryEmail || prev.primaryEmail,
        salesPhone: companySettings.salesPhone || companySettings.primaryPhone || prev.salesPhone,
        primaryPhone: companySettings.salesPhone || companySettings.primaryPhone || prev.primaryPhone,
        fiscalYear: companySettings.fiscalYear || prev.fiscalYear,
        primaryBank: {
          ...prev.primaryBank,
          ...(companySettings.primaryBank || {}),
          bankName: companySettings.primaryBank?.bankName || prev.primaryBank?.bankName,
          accountName: companySettings.primaryBank?.accountName || companySettings.legalEntityName || prev.primaryBank?.accountName,
          accountNumber: companySettings.primaryBank?.accountNumber || prev.primaryBank?.accountNumber,
          ifscCode: companySettings.primaryBank?.ifscCode || prev.primaryBank?.ifscCode,
          branch: companySettings.primaryBank?.branch || prev.primaryBank?.branch,
        }
      }));
    }
  }, [companySettings]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanData: CompanySettings = {
      ...formData,
      legalName: formData.legalEntityName || formData.legalName,
      legalEntityName: formData.legalEntityName || formData.legalName,
      gstin: formData.gstinNumber || formData.gstin,
      gstinNumber: formData.gstinNumber || formData.gstin,
      primaryEmail: formData.supportEmail || formData.primaryEmail,
      supportEmail: formData.supportEmail || formData.primaryEmail,
      primaryPhone: formData.salesPhone || formData.primaryPhone,
      salesPhone: formData.salesPhone || formData.primaryPhone,
    };
    updateCompanySettings(cleanData);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>ENTERPRISE CONFIGURATION & STATUTORY SETUP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Company Profile & Banking Settings
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Configure legal entity numbers (GSTIN, CIN, IEC), corporate headquarters, factory plant locations, and primary bank accounts.
          </p>
        </div>

        {hasPermission('settings', 'edit') && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: Legal Entity & Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Legal Entity & Tax Registrations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Display Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Legal Entity Name</label>
              <input
                type="text"
                value={formData.legalEntityName}
                onChange={e => setFormData(prev => ({ ...prev, legalEntityName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstinNumber}
                onChange={e => setFormData(prev => ({ ...prev, gstinNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">Corporate CIN</label>
              <input
                type="text"
                value={formData.cinNumber}
                onChange={e => setFormData(prev => ({ ...prev, cinNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">Company PAN</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={e => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 font-sans">IEC (Import/Export Code)</label>
              <input
                type="text"
                value={formData.iecCode}
                onChange={e => setFormData(prev => ({ ...prev, iecCode: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Locations & Official Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Registered Office & Factory Plant Locations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Corporate Office</label>
              <textarea
                rows={3}
                value={formData.registeredOffice}
                onChange={e => setFormData(prev => ({ ...prev, registeredOffice: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturing Plant & Assembly Unit</label>
              <textarea
                rows={3}
                value={formData.factoryPlantAddress}
                onChange={e => setFormData(prev => ({ ...prev, factoryPlantAddress: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sales & Inquiry Phone Helpline</label>
              <input
                type="tel"
                value={formData.salesPhone}
                onChange={e => setFormData(prev => ({ ...prev, salesPhone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fiscal Year Cycle</label>
              <input
                type="text"
                value={formData.fiscalYear}
                onChange={e => setFormData(prev => ({ ...prev, fiscalYear: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Corporate Banking Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">Primary Corporate Bank Account (For Quotations & Invoicing)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.primaryBank.bankName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, bankName: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={formData.primaryBank.accountName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, accountName: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.primaryBank.accountNumber}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, accountNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.primaryBank.ifscCode}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...prev.primaryBank, ifscCode: e.target.value.toUpperCase() }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Bank Branch Address</label>
              <input
                type="text"
                value={formData.primaryBank?.branch || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  primaryBank: { ...(prev.primaryBank || {} as any), branch: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Standard Terms & Conditions (Auto-fills Invoices & Quotations) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Standard Commercial Terms & Conditions</h3>
              <p className="text-xs text-slate-500">These will be automatically pre-filled in every new Quotation and Tax Invoice so you do not have to retype them every time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Payment Terms</label>
              <input
                type="text"
                value={formData.defaultTerms?.paymentTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), paymentTerms: e.target.value }
                }))}
                placeholder="e.g. 50% Advance against Proforma, Balance before Dispatch"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Delivery & Dispatch Terms</label>
              <input
                type="text"
                value={formData.defaultTerms?.deliveryTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), deliveryTerms: e.target.value }
                }))}
                placeholder="e.g. Ex-Factory Jamnagar / Ready Dispatch in 7-10 Business Days"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quotation Validity (Days)</label>
              <input
                type="number"
                value={formData.defaultTerms?.validityDays || 30}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), validityDays: Number(e.target.value) || 30 }
                }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Warranty & Replacement Terms</label>
              <input
                type="text"
                value={formData.defaultTerms?.warrantyTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), warrantyTerms: e.target.value }
                }))}
                placeholder="e.g. 12 Months replacement warranty against manufacturing defects"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Packaging Details</label>
              <input
                type="text"
                value={formData.defaultTerms?.packagingTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), packagingTerms: e.target.value }
                }))}
                placeholder="e.g. Export Standard Heavy-Duty Wooden Case with VCI Bag"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Testing & QA Inspection Terms</label>
              <input
                type="text"
                value={formData.defaultTerms?.inspectionTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), inspectionTerms: e.target.value }
                }))}
                placeholder="e.g. 100% In-House Hydrostatic & Flame Test with EN 10204 3.1 MTC"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">General Statutory / Legal Terms (Printed on Bills & Invoices)</label>
              <textarea
                rows={4}
                value={formData.defaultTerms?.generalTerms || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  defaultTerms: { ...(prev.defaultTerms || {}), generalTerms: e.target.value }
                }))}
                placeholder="1. GST @ 18% Extra as applicable.&#10;2. Freight and Transit insurance extra at actuals.&#10;3. Goods once sold will not be taken back unless approved.&#10;4. Subject to Jamnagar (Gujarat) jurisdiction only."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-sans focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Enterprise Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
