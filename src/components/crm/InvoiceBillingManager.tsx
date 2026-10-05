import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Plus, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Building, 
  CreditCard, 
  Search, 
  Eye, 
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Percent,
  UserCheck,
  Truck,
  FileCheck,
  Sparkles,
  Calculator,
  Calendar,
  Pencil,
  Trash2
} from 'lucide-react';

export interface TaxInvoice {
  id: string;
  invoiceNumber: string;
  quotationRef?: string;
  poNumber?: string;
  poDate?: string;
  
  // Seller Info (Earth Metal Industries)
  seller: {
    companyName: string;
    address: string;
    gstin: string;
    pan: string;
    state: string;
    stateCode: string;
    email: string;
    phone: string;
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
  };

  // Buyer Info
  buyer: {
    companyName: string;
    contactName: string;
    billingAddress: string;
    shippingAddress: string;
    gstin: string;
    pan?: string;
    state: string;
    stateCode: string;
    email: string;
    phone: string;
  };

  // Tax Configuration
  taxType: 'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO';
  gstRatePct: number; // e.g. 18, 12, 28, 5

  // Agent / Broker Commission
  agent: {
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number; // % or fixed USD
    commissionAmountUSD: number;
  };

  // Line items
  items: Array<{
    id: string;
    description: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
    taxableAmountUSD: number;
    cgstAmountUSD: number;
    sgstAmountUSD: number;
    igstAmountUSD: number;
    totalUSD: number;
  }>;

  // Commercial Terms
  paymentTerms: string;
  deliveryTerms: string;
  dispatchThrough: string;
  destination: string;
  
  // Financial Summary
  subtotalUSD: number;
  totalDiscountUSD: number;
  taxableTotalUSD: number;
  cgstTotalUSD: number;
  sgstTotalUSD: number;
  igstTotalUSD: number;
  totalTaxUSD: number;
  freightCostUSD: number;
  packagingCostUSD: number;
  grandTotalUSD: number;
  grandTotalINR: number;
  status: 'Paid' | 'Pending Payment' | 'Dispatched' | 'Draft';
  issueDate: string;
  dueDate: string;
}

export const InvoiceBillingManager: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, showNotification, companySettings, inventory } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<TaxInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<TaxInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteInvoiceId, setConfirmDeleteInvoiceId] = useState<string | null>(null);

  // Dynamic Seller Information strictly sourced from Company Settings & Banking
  const currentSeller = React.useMemo(() => {
    // 1. Resolve registered & factory addresses from companySettings
    let regAddr = '';
    if (typeof companySettings?.registeredOfficeAddress === 'string') {
      regAddr = companySettings.registeredOfficeAddress;
    } else if (companySettings?.registeredOfficeAddress?.addressLine1) {
      const parts = [
        companySettings.registeredOfficeAddress.addressLine1,
        companySettings.registeredOfficeAddress.addressLine2,
        companySettings.registeredOfficeAddress.city,
        companySettings.registeredOfficeAddress.state,
      ].filter(Boolean);
      regAddr = parts.join(', ');
      if (companySettings.registeredOfficeAddress.pincode) {
        regAddr += ` - ${companySettings.registeredOfficeAddress.pincode}`;
      }
      if (companySettings.registeredOfficeAddress.country) {
        regAddr += `, ${companySettings.registeredOfficeAddress.country}`;
      }
    } else if (companySettings?.registeredOffice) {
      regAddr = companySettings.registeredOffice;
    }

    const factoryAddr = companySettings?.factoryPlantAddress || regAddr;

    // 2. Resolve Banking from primaryBank, top-level bank fields, or bankAccounts array
    const primaryBank = companySettings?.primaryBank || (companySettings?.bankAccounts && companySettings.bankAccounts[0]) || ({} as any);
    const resolvedBankName = primaryBank.bankName || companySettings?.bankName || '';
    const resolvedAccountNo = primaryBank.accountNumber || (primaryBank as any).accountNo || companySettings?.bankAccountNumber || '';
    const resolvedIfsc = (primaryBank.ifscCode || companySettings?.ifscCode || '').toUpperCase();
    const resolvedBranch = primaryBank.branch || companySettings?.bankBranch || '';

    // 3. Resolve Tax & Legal Identifiers
    const resolvedGstin = companySettings?.gstinNumber || companySettings?.gstin || '';
    const resolvedPan = companySettings?.panNumber || (companySettings as any)?.companyPan || (resolvedGstin.length >= 12 ? resolvedGstin.slice(2, 12) : '');
    const resolvedLegalName = companySettings?.legalEntityName || companySettings?.legalName || companySettings?.companyName || 'Weldor Industries';
    const resolvedState = companySettings?.state || (typeof companySettings?.registeredOfficeAddress === 'object' ? companySettings?.registeredOfficeAddress?.state : '') || 'Gujarat';
    const resolvedStateCode = companySettings?.stateCode || (resolvedGstin.length >= 2 && /^\d{2}$/.test(resolvedGstin.slice(0, 2)) ? resolvedGstin.slice(0, 2) : '24');
    const resolvedEmail = companySettings?.supportEmail || companySettings?.primaryEmail || '';
    const resolvedPhone = companySettings?.salesPhone || companySettings?.primaryPhone || '';

    return {
      companyName: resolvedLegalName,
      address: factoryAddr || regAddr || '',
      gstin: resolvedGstin,
      pan: resolvedPan,
      state: resolvedState,
      stateCode: resolvedStateCode,
      email: resolvedEmail,
      phone: resolvedPhone,
      bankName: resolvedBankName,
      accountNo: resolvedAccountNo,
      ifscCode: resolvedIfsc,
      branch: resolvedBranch
    };
  }, [companySettings]);

  // Form State
  const [formBuyer, setFormBuyer] = useState({
    companyName: '',
    contactName: '',
    billingAddress: '',
    shippingAddress: '',
    gstin: '',
    pan: '',
    state: 'Maharashtra',
    stateCode: '27',
    email: '',
    phone: '',
    poNumber: '',
    poDate: ''
  });

  const [formTaxType, setFormTaxType] = useState<'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO'>('INTER_STATE');
  const [formGstRatePct, setFormGstRatePct] = useState<number>(18);

  const [formAgent, setFormAgent] = useState({
    hasAgent: false,
    agentName: '',
    agentPhone: '',
    commissionType: 'PERCENT' as 'PERCENT' | 'FIXED',
    commissionRate: 2
  });

  const [formItems, setFormItems] = useState<Array<{
    description: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
  }>>([
    {
      description: 'ISO 15552 Heavy-Duty Pneumatic Cylinder',
      sku: 'WEL-PNC-63-200',
      hsnCode: '84123100',
      quantity: 20,
      unit: 'PCS',
      unitPriceUSD: 95,
      discountPct: 5
    }
  ]);

  const [formFreightUSD, setFormFreightUSD] = useState(150);
  const [formPackagingUSD, setFormPackagingUSD] = useState(50);
  const [formPaymentTerms, setFormPaymentTerms] = useState(companySettings?.defaultTerms?.paymentTerms || '50% Advance, Balance against Proforma Invoice');
  const [formDeliveryTerms, setFormDeliveryTerms] = useState(companySettings?.defaultTerms?.deliveryTerms || 'Ex-Works Jamnagar (7-10 Business Days)');
  const [formDispatchThrough, setFormDispatchThrough] = useState('Road Transport Cargo / Courier');
  const [formDestination, setFormDestination] = useState('Client Plant Location');

  // Synchronize commercial terms whenever defaultTerms in settings change
  React.useEffect(() => {
    if (companySettings?.defaultTerms) {
      if (companySettings.defaultTerms.paymentTerms) setFormPaymentTerms(companySettings.defaultTerms.paymentTerms);
      if (companySettings.defaultTerms.deliveryTerms) setFormDeliveryTerms(companySettings.defaultTerms.deliveryTerms);
    }
  }, [companySettings?.defaultTerms]);

  const handleAddItem = () => {
    setFormItems(prev => [
      ...prev,
      {
        description: '700 Bar Solenoid Hydraulic Directional Valve CETOP 3',
        sku: 'WEL-HYV-700B',
        hsnCode: '84812000',
        quantity: 5,
        unit: 'PCS',
        unitPriceUSD: 290,
        discountPct: 0
      }
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setFormItems(prev => prev.filter((_, i) => i !== idx));
  };

  const calculateFormFinancials = () => {
    let subtotalUSD = 0;
    let totalDiscountUSD = 0;

    const calculatedItems = formItems.map((item, idx) => {
      const rawTotal = item.quantity * item.unitPriceUSD;
      const discountAmt = rawTotal * ((item.discountPct || 0) / 100);
      const taxable = rawTotal - discountAmt;

      subtotalUSD += rawTotal;
      totalDiscountUSD += discountAmt;

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (formTaxType === 'INTRA_STATE') {
        cgst = taxable * ((formGstRatePct / 2) / 100);
        sgst = taxable * ((formGstRatePct / 2) / 100);
      } else if (formTaxType === 'INTER_STATE') {
        igst = taxable * (formGstRatePct / 100);
      }

      return {
        id: `item-${idx + 1}`,
        ...item,
        taxableAmountUSD: taxable,
        cgstAmountUSD: cgst,
        sgstAmountUSD: sgst,
        igstAmountUSD: igst,
        totalUSD: taxable + cgst + sgst + igst
      };
    });

    const taxableTotalUSD = subtotalUSD - totalDiscountUSD;
    let cgstTotalUSD = 0;
    let sgstTotalUSD = 0;
    let igstTotalUSD = 0;

    if (formTaxType === 'INTRA_STATE') {
      cgstTotalUSD = taxableTotalUSD * ((formGstRatePct / 2) / 100);
      sgstTotalUSD = taxableTotalUSD * ((formGstRatePct / 2) / 100);
    } else if (formTaxType === 'INTER_STATE') {
      igstTotalUSD = taxableTotalUSD * (formGstRatePct / 100);
    }

    const totalTaxUSD = cgstTotalUSD + sgstTotalUSD + igstTotalUSD;
    const grandTotalUSD = taxableTotalUSD + totalTaxUSD + Number(formFreightUSD) + Number(formPackagingUSD);
    const grandTotalINR = Math.round(grandTotalUSD * 85);

    let commissionAmountUSD = 0;
    if (formAgent.hasAgent) {
      commissionAmountUSD = formAgent.commissionType === 'PERCENT'
        ? (taxableTotalUSD * (formAgent.commissionRate / 100))
        : formAgent.commissionRate;
    }

    return {
      calculatedItems,
      subtotalUSD,
      totalDiscountUSD,
      taxableTotalUSD,
      cgstTotalUSD,
      sgstTotalUSD,
      igstTotalUSD,
      totalTaxUSD,
      grandTotalUSD,
      grandTotalINR,
      commissionAmountUSD
    };
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formBuyer.companyName) {
      showNotification('Buyer Company Name is required!', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const financials = calculateFormFinancials();

      const newInvoice: TaxInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `WEL-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        quotationRef: `WEL-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        poNumber: formBuyer.poNumber || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        poDate: formBuyer.poDate || new Date().toISOString().slice(0, 10),
        seller: currentSeller,
        buyer: {
          ...formBuyer,
          billingAddress: formBuyer.billingAddress || 'Industrial Park, Client Location',
          shippingAddress: formBuyer.shippingAddress || formBuyer.billingAddress || 'Plant Bay, Delivery Site'
        },
        taxType: formTaxType,
        gstRatePct: formGstRatePct,
        agent: {
          ...formAgent,
          commissionAmountUSD: financials.commissionAmountUSD
        },
        items: financials.calculatedItems,
        paymentTerms: formPaymentTerms,
        deliveryTerms: formDeliveryTerms,
        dispatchThrough: formDispatchThrough,
        destination: formDestination,
        subtotalUSD: financials.subtotalUSD,
        totalDiscountUSD: financials.totalDiscountUSD,
        taxableTotalUSD: financials.taxableTotalUSD,
        cgstTotalUSD: financials.cgstTotalUSD,
        sgstTotalUSD: financials.sgstTotalUSD,
        igstTotalUSD: financials.igstTotalUSD,
        totalTaxUSD: financials.totalTaxUSD,
        freightCostUSD: Number(formFreightUSD) || 0,
        packagingCostUSD: Number(formPackagingUSD) || 0,
        grandTotalUSD: financials.grandTotalUSD,
        grandTotalINR: financials.grandTotalINR,
        status: 'Pending Payment',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
      };

      addInvoice(newInvoice);
      setIsCreateModalOpen(false);
      showNotification(`Tax Invoice ${newInvoice.invoiceNumber} generated successfully!`, 'success');
      setActivePrintInvoice(newInvoice);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (inv: TaxInvoice) => {
    const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
    const safeTaxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
      ? inv.taxableTotalUSD
      : (inv.subtotalUSD && inv.subtotalUSD > 0
          ? inv.subtotalUSD - (inv.totalDiscountUSD || 0)
          : (inv.grandTotalUSD ? inv.grandTotalUSD / 1.18 : grandTotal / (85 * 1.18)));

    const safeItems = (inv.items && inv.items.length > 0)
      ? inv.items.map((it, idx) => ({
          id: it.id || `item-${Date.now()}-${idx}`,
          description: it.description || (it as any).productName || 'Industrial Automation Product',
          sku: it.sku || `WLD-ITEM-${idx + 1}`,
          hsnCode: it.hsnCode || '8481.80.30',
          quantity: it.quantity || 1,
          unit: it.unit || 'PCS',
          unitPriceUSD: it.unitPriceUSD || Math.round(safeTaxable),
          discountPct: it.discountPct || 0,
          taxableAmountUSD: it.taxableAmountUSD || 0,
          cgstAmountUSD: it.cgstAmountUSD || 0,
          sgstAmountUSD: it.sgstAmountUSD || 0,
          igstAmountUSD: it.igstAmountUSD || 0,
          totalUSD: it.totalUSD || 0
        }))
      : [{
          id: `item-${Date.now()}`,
          description: 'Industrial Precision Hydraulic / Pneumatic Equipment',
          sku: 'WLD-IND-01',
          hsnCode: '8481.80.30',
          quantity: 1,
          unit: 'PCS',
          unitPriceUSD: Math.round(safeTaxable),
          discountPct: 0,
          taxableAmountUSD: Math.round(safeTaxable),
          cgstAmountUSD: 0,
          sgstAmountUSD: 0,
          igstAmountUSD: Math.round(safeTaxable * 0.18),
          totalUSD: Math.round(safeTaxable * 1.18)
        }];

    setEditingInvoice({
      ...inv,
      poNumber: inv.poNumber || '',
      poDate: inv.poDate || new Date().toISOString().slice(0, 10),
      buyer: {
        companyName: inv.buyer?.companyName || '',
        contactName: inv.buyer?.contactName || '',
        billingAddress: inv.buyer?.billingAddress || '',
        shippingAddress: inv.buyer?.shippingAddress || '',
        gstin: inv.buyer?.gstin || '',
        pan: inv.buyer?.pan || '',
        state: inv.buyer?.state || 'Gujarat',
        stateCode: inv.buyer?.stateCode || '24',
        email: inv.buyer?.email || '',
        phone: inv.buyer?.phone || ''
      },
      items: safeItems,
      taxType: inv.taxType || 'INTER_STATE',
      gstRatePct: inv.gstRatePct || 18,
      agent: inv.agent || {
        hasAgent: false,
        agentName: '',
        agentPhone: '',
        commissionType: 'PERCENT',
        commissionRate: 0,
        commissionAmountUSD: 0
      },
      paymentTerms: inv.paymentTerms || '30% Advance, Balance against Proforma Invoice',
      deliveryTerms: inv.deliveryTerms || 'Ex-Works Jamnagar (7-10 Business Days)',
      dispatchThrough: inv.dispatchThrough || 'Road Transport Cargo / Courier',
      destination: inv.destination || 'Client Plant Site',
      freightCostUSD: inv.freightCostUSD || 0,
      packagingCostUSD: inv.packagingCostUSD || 0,
      status: inv.status || 'Pending Payment'
    });
  };

  const calculateEditFinancials = () => {
    if (!editingInvoice) return null;
    let subtotalUSD = 0;
    let totalDiscountUSD = 0;

    const calculatedItems = editingInvoice.items.map((item, idx) => {
      const rawTotal = (item.quantity || 0) * (item.unitPriceUSD || 0);
      const discountAmt = rawTotal * ((item.discountPct || 0) / 100);
      const taxable = rawTotal - discountAmt;
      subtotalUSD += rawTotal;
      totalDiscountUSD += discountAmt;

      let cgst = 0, sgst = 0, igst = 0;
      if (editingInvoice.taxType === 'INTRA_STATE') {
        cgst = taxable * ((editingInvoice.gstRatePct / 2) / 100);
        sgst = taxable * ((editingInvoice.gstRatePct / 2) / 100);
      } else if (editingInvoice.taxType === 'INTER_STATE') {
        igst = taxable * (editingInvoice.gstRatePct / 100);
      }

      return {
        ...item,
        id: item.id || `edit-item-${idx + 1}`,
        taxableAmountUSD: taxable,
        cgstAmountUSD: cgst,
        sgstAmountUSD: sgst,
        igstAmountUSD: igst,
        totalUSD: taxable + cgst + sgst + igst
      };
    });

    const taxableTotalUSD = subtotalUSD - totalDiscountUSD;
    let cgstTotalUSD = 0, sgstTotalUSD = 0, igstTotalUSD = 0;
    if (editingInvoice.taxType === 'INTRA_STATE') {
      cgstTotalUSD = taxableTotalUSD * ((editingInvoice.gstRatePct / 2) / 100);
      sgstTotalUSD = taxableTotalUSD * ((editingInvoice.gstRatePct / 2) / 100);
    } else if (editingInvoice.taxType === 'INTER_STATE') {
      igstTotalUSD = taxableTotalUSD * (editingInvoice.gstRatePct / 100);
    }

    const totalTaxUSD = cgstTotalUSD + sgstTotalUSD + igstTotalUSD;
    const grandTotalUSD = taxableTotalUSD + totalTaxUSD + Number(editingInvoice.freightCostUSD || 0) + Number(editingInvoice.packagingCostUSD || 0);
    const grandTotalINR = Math.round(grandTotalUSD * 85);

    return {
      calculatedItems,
      subtotalUSD,
      totalDiscountUSD,
      taxableTotalUSD,
      cgstTotalUSD,
      sgstTotalUSD,
      igstTotalUSD,
      totalTaxUSD,
      grandTotalUSD,
      grandTotalINR
    };
  };

  const handleSaveEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    if (!editingInvoice.buyer?.companyName) {
      showNotification('Buyer Company Name is required!', 'warning');
      return;
    }

    const fin = calculateEditFinancials();
    if (!fin) return;

    const updatedInvoice: TaxInvoice = {
      ...editingInvoice,
      items: fin.calculatedItems,
      subtotalUSD: fin.subtotalUSD,
      totalDiscountUSD: fin.totalDiscountUSD,
      taxableTotalUSD: fin.taxableTotalUSD,
      cgstTotalUSD: fin.cgstTotalUSD,
      sgstTotalUSD: fin.sgstTotalUSD,
      igstTotalUSD: fin.igstTotalUSD,
      totalTaxUSD: fin.totalTaxUSD,
      grandTotalUSD: fin.grandTotalUSD,
      grandTotalINR: fin.grandTotalINR
    };

    await updateInvoice(editingInvoice.id, updatedInvoice);
    setEditingInvoice(null);
    showNotification(`Tax Invoice ${updatedInvoice.invoiceNumber} updated successfully in database!`, 'success');
  };

  const filteredInvoices = React.useMemo(() => {
    const list = invoices || [];
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const deduped: TaxInvoice[] = [];

    for (const inv of list) {
      if (!inv || !inv.id) continue;
      const num = (inv.invoiceNumber || '').trim().toUpperCase();
      if (seenIds.has(inv.id)) continue;
      if (num && seenNumbers.has(num)) continue;
      seenIds.add(inv.id);
      if (num) seenNumbers.add(num);
      deduped.push(inv);
    }

    const q = (searchQuery || '').trim().toLowerCase();
    return deduped.filter(inv => {
      return !q ||
        (inv.buyer?.companyName || '').toLowerCase().includes(q) ||
        (inv.invoiceNumber || '').toLowerCase().includes(q) ||
        (inv.poNumber && inv.poNumber.toLowerCase().includes(q));
    });
  }, [invoices, searchQuery]);

  const previewFinancials = calculateFormFinancials();

  return (
    <div className="p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" /> B2B GST Tax Billing & Proforma Engine
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              CGST / SGST / IGST & Broker Commission Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading mt-2">
            Commercial Tax Invoices, GST Breakdown & Dispatch Hub
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Generate itemized tax invoices with CGST (9%) + SGST (9%) or IGST (18%), discount rules, sales agent commissions, complete seller & buyer company details, and banking dispatch notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/20 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New GST Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Tax Invoices Ledger ({filteredInvoices.length} invoices)
            </h3>
            <p className="text-xs text-slate-500">Official billing and proforma accounts register</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by buyer, invoice no, PO..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-72 focus:outline-hidden focus:border-orange-500 font-sans"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 font-mono text-slate-700">
              <tr>
                <th className="p-3">INVOICE & PO REF</th>
                <th className="p-3">BUYER COMPANY / GSTIN</th>
                <th className="p-3">TAX TYPE & RATE</th>
                <th className="p-3 text-right">TAXABLE VALUE</th>
                <th className="p-3 text-right">GST TAX TOTAL</th>
                <th className="p-3 text-right">GRAND TOTAL</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
                const taxableValue = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
                  ? Math.round(inv.taxableTotalUSD * 85)
                  : (inv.subtotalUSD && inv.subtotalUSD > 0
                      ? Math.round((inv.subtotalUSD - (inv.totalDiscountUSD || 0)) * 85)
                      : (inv.grandTotalUSD ? Math.round((inv.grandTotalUSD / (1 + (inv.gstRatePct || 18) / 100)) * 85) : Math.round(grandTotal / (1 + (inv.gstRatePct || 18) / 100))));
                const totalTax = (inv.totalTaxUSD && inv.totalTaxUSD > 0)
                  ? Math.round(inv.totalTaxUSD * 85)
                  : Math.max(0, grandTotal - taxableValue);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-bold text-orange-700 text-sm">{inv.invoiceNumber}</p>
                      <p className="text-slate-500 text-[11px] font-mono">PO: {inv.poNumber || 'N/A'}</p>
                      <p className="text-slate-400 text-[10px] font-mono">{inv.issueDate || 'Recent'}</p>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 text-sm block">{inv.buyer?.companyName || 'Buyer Company'}</strong>
                      <p className="text-slate-500 text-[11px] font-mono">
                        GSTIN: {inv.buyer?.gstin || 'Unregistered'} | State: {inv.buyer?.state || 'N/A'} ({inv.buyer?.stateCode || '00'})
                      </p>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {inv.taxType === 'INTRA_STATE' ? `CGST+SGST (${inv.gstRatePct || 18}%)` : `IGST (${inv.gstRatePct || 18}%)`}
                      </span>
                      {inv.agent?.hasAgent && (
                        <p className="text-[10px] text-amber-700 font-bold mt-0.5">
                          Broker: {inv.agent?.agentName} (₹{Math.round((inv.agent?.commissionAmountUSD || 0) * 85).toLocaleString('en-IN')})
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ₹{taxableValue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600 font-medium">
                      ₹{totalTax.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {inv.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePrintInvoice(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="View & Print Official GST Tax Invoice"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 font-mono font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Edit Tax Invoice Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {confirmDeleteInvoiceId === inv.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-lg">
                            <span className="text-[10px] text-rose-800 font-bold px-1 font-mono">Delete?</span>
                            <button
                              onClick={() => {
                                deleteInvoice(inv.id);
                                setConfirmDeleteInvoiceId(null);
                              }}
                              className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer hover:bg-rose-700 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteInvoiceId(null)}
                              className="px-1.5 py-0.5 rounded bg-white text-slate-700 text-[10px] cursor-pointer hover:bg-slate-100 border border-slate-200 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteInvoiceId(inv.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded uppercase">
                  GST 18% & Commercial Billing Engine
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Create Commercial GST Tax Invoice
                </h2>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-6">
              
              {/* 1. SELLER & BUYER COMPANY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Seller (Sourced Live from Company Settings) */}
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-900 uppercase">SELLER / SUPPLIER:</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">Live Company Settings</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{currentSeller.companyName || 'Company Name Not Configured'}</p>
                  <p className="text-slate-600">{currentSeller.address || 'Address not configured in Company Settings'}</p>
                  <p className="font-mono text-slate-700">
                    GSTIN: <strong>{currentSeller.gstin || 'Not Configured'}</strong> | PAN: <strong>{currentSeller.pan || 'N/A'}</strong> | State: <strong>{currentSeller.state} ({currentSeller.stateCode})</strong>
                  </p>
                  <p className="font-mono text-slate-700">
                    Bank: <strong>{currentSeller.bankName || 'Bank Not Configured'}</strong> {currentSeller.accountNo ? `(A/C: ${currentSeller.accountNo})` : ''} {currentSeller.ifscCode ? `| IFSC: ${currentSeller.ifscCode}` : ''}
                  </p>
                </div>

                {/* Buyer / Customer Info Form */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <span className="font-mono font-bold text-slate-800 uppercase block">BUYER / CONSIGNEE DETAILS:</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formBuyer.companyName}
                        onChange={e => setFormBuyer(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g. Apex Industrial Automation"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Contact Person</label>
                      <input
                        type="text"
                        value={formBuyer.contactName}
                        onChange={e => setFormBuyer(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="e.g. Manoj Sharma"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer GSTIN</label>
                      <input
                        type="text"
                        value={formBuyer.gstin}
                        onChange={e => setFormBuyer(prev => ({ ...prev, gstin: e.target.value }))}
                        placeholder="27AAACL1234F1Z8"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer State & Code</label>
                      <input
                        type="text"
                        value={formBuyer.state}
                        onChange={e => setFormBuyer(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Maharashtra (27)"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 font-bold block">Billing & Delivery Address</label>
                    <input
                      type="text"
                      value={formBuyer.billingAddress}
                      onChange={e => setFormBuyer(prev => ({ ...prev, billingAddress: e.target.value }))}
                      placeholder="Plot 44, GIDC Industrial Estate, Pune, Maharashtra"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer PO Number</label>
                      <input
                        type="text"
                        value={formBuyer.poNumber}
                        onChange={e => setFormBuyer(prev => ({ ...prev, poNumber: e.target.value }))}
                        placeholder="PO-2026-8812"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 font-bold block">Buyer Email / Phone</label>
                      <input
                        type="text"
                        value={formBuyer.email}
                        onChange={e => setFormBuyer(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="accounts@buyer.com / +91-9876543210"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. GST TAX TYPE & AGENT COMMISSION CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                
                {/* GST Tax Selector */}
                <div className="space-y-2">
                  <label className="font-mono font-bold text-slate-800 uppercase block">GST Tax Structure:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormTaxType('INTER_STATE')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'INTER_STATE' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      IGST (Inter-State)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTaxType('INTRA_STATE')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'INTRA_STATE' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      CGST + SGST (Gujarat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTaxType('EXPORT_ZERO')}
                      className={`p-2 rounded-lg border text-center font-mono font-bold cursor-pointer ${
                        formTaxType === 'EXPORT_ZERO' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      0% (Export LUT)
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-600 font-bold">Standard GST Rate:</span>
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setFormGstRatePct(rate)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                          formGstRatePct === rate ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Agent / Broker Commission */}
                <div className="space-y-2 border-l border-slate-200 pl-4">
                  <div className="flex items-center justify-between">
                    <label className="font-mono font-bold text-slate-800 uppercase">Sales Agent / Commission:</label>
                    <input
                      type="checkbox"
                      checked={formAgent.hasAgent}
                      onChange={e => setFormAgent(prev => ({ ...prev, hasAgent: e.target.checked }))}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  {formAgent.hasAgent ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Agent / Channel Partner Name"
                        value={formAgent.agentName}
                        onChange={e => setFormAgent(prev => ({ ...prev, agentName: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 block">Commission Rate (%)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={formAgent.commissionRate}
                            onChange={e => setFormAgent(prev => ({ ...prev, commissionRate: Number(e.target.value) || 0 }))}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 block">Est. Payout (₹)</label>
                          <input
                            type="text"
                            readOnly
                            value={`₹${Math.round(previewFinancials.commissionAmountUSD * 85).toLocaleString('en-IN')}`}
                            className="w-full px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-amber-800"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[11px]">No sales broker attached to this direct commercial deal.</p>
                  )}
                </div>

              </div>

              {/* 3. ITEMIZED PRODUCTS BILL */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-mono font-bold text-slate-800 uppercase">
                    Itemized Products Bill & HSN Codes ({formItems.length} lines)
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Quick Add from Inventory */}
                    {inventory && inventory.length > 0 && (
                      <select
                        onChange={(e) => {
                          const id = e.target.value;
                          if (!id) return;
                          const inv = inventory.find(i => i.id === id);
                          if (inv) {
                            setFormItems(prev => [
                              ...prev,
                              {
                                description: inv.name,
                                sku: inv.sku,
                                hsnCode: inv.hsnCode || '85159000',
                                quantity: 1,
                                unit: inv.unit || 'PCS',
                                unitPriceUSD: inv.unitPriceINR || Math.round(inv.unitPriceUSD * 87),
                                discountPct: 0
                              }
                            ]);
                          }
                          e.target.value = '';
                        }}
                        defaultValue=""
                        className="text-xs font-mono font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                      >
                        <option value="">⚡ + Add from Inventory Master...</option>
                        {inventory.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.currentStock <= 0 ? '🔴 OUT' : inv.currentStock <= inv.minStockAlert ? `🟡 LOW (${inv.currentStock})` : `🟢 (${inv.currentStock})`} {inv.sku} - {inv.name.slice(0, 32)}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Empty Row
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-500 font-mono block">Product Description</label>
                          {inventory && inventory.length > 0 && (
                            <select
                              onChange={e => {
                                const val = e.target.value;
                                if (!val) return;
                                const inv = inventory.find(i => i.id === val);
                                if (inv) {
                                  setFormItems(prev => {
                                    const copy = [...prev];
                                    copy[idx] = {
                                      ...copy[idx],
                                      description: inv.name,
                                      sku: inv.sku,
                                      hsnCode: inv.hsnCode || '85159000',
                                      unit: inv.unit || 'PCS',
                                      unitPriceUSD: inv.unitPriceINR || Math.round(inv.unitPriceUSD * 87)
                                    };
                                    return copy;
                                  });
                                }
                              }}
                              defaultValue=""
                              className="text-[9.5px] font-mono font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5 max-w-[170px]"
                            >
                              <option value="">Auto-fill item...</option>
                              {inventory.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                  {inv.sku} ({inv.currentStock} {inv.unit})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => {
                            const val = e.target.value;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], description: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                        {/* Live Stock Status Indicator */}
                        {(() => {
                          const matchedInv = inventory?.find(inv => 
                            (inv.sku && item.sku && inv.sku.trim().toUpperCase() === item.sku.trim().toUpperCase()) ||
                            (inv.name && item.description && inv.name.trim().toLowerCase() === item.description.trim().toLowerCase())
                          );
                          if (!matchedInv) return null;
                          const isOut = matchedInv.currentStock <= 0;
                          const isLow = !isOut && matchedInv.currentStock <= matchedInv.minStockAlert;
                          return (
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                              <span className={`px-1.5 py-0.2 rounded font-bold ${
                                isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isOut ? '🔴 Out of Stock (0 In-Hand)' : isLow ? `🟡 Low Stock (${matchedInv.currentStock} ${matchedInv.unit})` : `🟢 In Stock (${matchedInv.currentStock} ${matchedInv.unit})`}
                              </span>
                              <span className="text-slate-400 truncate max-w-[140px]">• {matchedInv.warehouseLocation || 'Jamnagar'}</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], hsnCode: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value) || 1;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], quantity: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], unitPriceUSD: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-slate-500 font-mono block">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setFormItems(prev => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], discountPct: val };
                              return copy;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINANCIAL SUMMARY & LOGISTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Freight / Shipping (₹)</label>
                      <input
                        type="number"
                        value={formFreightUSD}
                        onChange={e => setFormFreightUSD(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Packaging & Forwarding (₹)</label>
                      <input
                        type="number"
                        value={formPackagingUSD}
                        onChange={e => setFormPackagingUSD(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Payment Terms</label>
                    <input
                      type="text"
                      value={formPaymentTerms}
                      onChange={e => setFormPaymentTerms(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{Math.round(previewFinancials.subtotalUSD * 85).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-orange-700 font-bold">
                    <span>Discount:</span>
                    <span>-₹{Math.round(previewFinancials.totalDiscountUSD * 85).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-1">
                    <span>Taxable Amount:</span>
                    <span className="font-bold">₹{Math.round(previewFinancials.taxableTotalUSD * 85).toLocaleString('en-IN')}</span>
                  </div>
                  {formTaxType === 'INTRA_STATE' ? (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST ({formGstRatePct / 2}%):</span>
                        <span>₹{Math.round(previewFinancials.cgstTotalUSD * 85).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST ({formGstRatePct / 2}%):</span>
                        <span>₹{Math.round(previewFinancials.sgstTotalUSD * 85).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST ({formGstRatePct}%):</span>
                      <span>₹{Math.round(previewFinancials.igstTotalUSD * 85).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Freight & Packaging:</span>
                    <span>₹{Math.round((Number(formFreightUSD) + Number(formPackagingUSD)) * 85).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-black text-sm text-orange-700">
                    <span>Grand Total:</span>
                    <span>₹{(previewFinancials.grandTotalINR || Math.round(previewFinancials.grandTotalUSD * 85)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 shadow-orange-500/20 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Generate Official Tax Invoice</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT INVOICE MODAL */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8 max-h-[92vh] overflow-y-auto font-sans">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded uppercase">
                  Edit GST Commercial Invoice
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Modify Tax Invoice &mdash; <span className="font-mono text-orange-700">{editingInvoice.invoiceNumber}</span>
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setEditingInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInvoice} className="space-y-6">
              
              {/* Status & PO Bar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Payment / Realization Status</label>
                  <select
                    value={editingInvoice.status}
                    onChange={e => setEditingInvoice(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white"
                  >
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Paid">Paid / Received</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">PO Number Ref</label>
                  <input
                    type="text"
                    value={editingInvoice.poNumber || ''}
                    onChange={e => setEditingInvoice(prev => prev ? { ...prev, poNumber: e.target.value } : null)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                    placeholder="e.g. PO-88910"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">PO Date</label>
                  <input
                    type="date"
                    value={editingInvoice.poDate || ''}
                    onChange={e => setEditingInvoice(prev => prev ? { ...prev, poDate: e.target.value } : null)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* Buyer Information */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 text-xs">
                <h4 className="font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orange-600" /> Buyer & Consignee Master Record
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={editingInvoice.buyer?.companyName || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, companyName: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Contact Person</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.contactName || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, contactName: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.gstin || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, gstin: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">PAN Number</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.pan || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, pan: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">State</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.state || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, state: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">State Code (e.g. 24, 27)</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.stateCode || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, stateCode: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Billing Address</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.billingAddress || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, billingAddress: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Shipping / Delivery Address</label>
                    <input
                      type="text"
                      value={editingInvoice.buyer?.shippingAddress || ''}
                      onChange={e => setEditingInvoice(prev => prev ? {
                        ...prev,
                        buyer: { ...prev.buyer, shippingAddress: e.target.value }
                      } : null)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Type & GST % */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-600 block font-bold">Tax Regime Type</label>
                  <select
                    value={editingInvoice.taxType}
                    onChange={e => setEditingInvoice(prev => prev ? { ...prev, taxType: e.target.value as any } : null)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white"
                  >
                    <option value="INTER_STATE">Inter-State (IGST 18% - Across States)</option>
                    <option value="INTRA_STATE">Intra-State (CGST 9% + SGST 9% - Gujarat)</option>
                    <option value="EXPORT_ZERO">Export / SEZ (0% Zero Rated LUT Bond)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-600 block font-bold">GST Standard Rate %</label>
                  <select
                    value={editingInvoice.gstRatePct}
                    onChange={e => setEditingInvoice(prev => prev ? { ...prev, gstRatePct: Number(e.target.value) } : null)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white font-mono"
                  >
                    <option value="18">18% (Standard Engineering & Valves)</option>
                    <option value="12">12% (Concessional Industrial)</option>
                    <option value="28">28% (Luxury / High Pressure Systems)</option>
                    <option value="5">5% (Essential Raw Metals)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-bold text-slate-800 uppercase">
                    Itemized Product Lines ({editingInvoice.items?.length || 0} items)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInvoice(prev => prev ? {
                        ...prev,
                        items: [
                          ...prev.items,
                          {
                            id: `item-${Date.now()}`,
                            description: 'Heavy Duty Automation Component',
                            sku: `WLD-SKU-${prev.items.length + 1}`,
                            hsnCode: '8481.80.30',
                            quantity: 1,
                            unit: 'PCS',
                            unitPriceUSD: 100,
                            discountPct: 0,
                            taxableAmountUSD: 100,
                            cgstAmountUSD: 0,
                            sgstAmountUSD: 0,
                            igstAmountUSD: 18,
                            totalUSD: 118
                          }
                        ]
                      } : null);
                    }}
                    className="font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item Row
                  </button>
                </div>

                <div className="space-y-2">
                  {editingInvoice.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-500 font-mono block">Product Description</label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => {
                            const val = e.target.value;
                            setEditingInvoice(prev => {
                              if (!prev) return null;
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], description: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setEditingInvoice(prev => {
                              if (!prev) return null;
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], hsnCode: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Qty & Unit</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={e => {
                              const val = Math.max(1, Number(e.target.value) || 1);
                              setEditingInvoice(prev => {
                                if (!prev) return null;
                                const copy = [...prev.items];
                                copy[idx] = { ...copy[idx], quantity: val };
                                return { ...prev, items: copy };
                              });
                            }}
                            className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={item.unit || 'PCS'}
                            onChange={e => {
                              const val = e.target.value;
                              setEditingInvoice(prev => {
                                if (!prev) return null;
                                const copy = [...prev.items];
                                copy[idx] = { ...copy[idx], unit: val };
                                return { ...prev, items: copy };
                              });
                            }}
                            className="w-14 px-1.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Unit Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setEditingInvoice(prev => {
                              if (!prev) return null;
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], unitPriceUSD: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-slate-500 font-mono block">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setEditingInvoice(prev => {
                              if (!prev) return null;
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], discountPct: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {editingInvoice.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingInvoice(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== idx)
                                };
                              });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove Row"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics & Live Financial Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Freight / Shipping (₹)</label>
                      <input
                        type="number"
                        value={editingInvoice.freightCostUSD || 0}
                        onChange={e => setEditingInvoice(prev => prev ? { ...prev, freightCostUSD: Number(e.target.value) || 0 } : null)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-600 block">Packaging (₹)</label>
                      <input
                        type="number"
                        value={editingInvoice.packagingCostUSD || 0}
                        onChange={e => setEditingInvoice(prev => prev ? { ...prev, packagingCostUSD: Number(e.target.value) || 0 } : null)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Payment Terms</label>
                    <input
                      type="text"
                      value={editingInvoice.paymentTerms || ''}
                      onChange={e => setEditingInvoice(prev => prev ? { ...prev, paymentTerms: e.target.value } : null)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-600 block">Delivery Terms</label>
                    <input
                      type="text"
                      value={editingInvoice.deliveryTerms || ''}
                      onChange={e => setEditingInvoice(prev => prev ? { ...prev, deliveryTerms: e.target.value } : null)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Live Preview Card */}
                {(() => {
                  const fin = calculateEditFinancials();
                  if (!fin) return null;
                  return (
                    <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2 text-xs font-mono">
                      <span className="font-bold text-orange-950 uppercase text-[10px] tracking-wider block">
                        Live Calculated Totals
                      </span>
                      <div className="flex justify-between text-slate-600">
                        <span>Net Taxable Value:</span>
                        <strong className="text-slate-900">₹{Math.round(fin.taxableTotalUSD * 85).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST Tax Total ({editingInvoice.gstRatePct}%):</span>
                        <strong className="text-emerald-700 font-bold">₹{Math.round(fin.totalTaxUSD * 85).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Freight & Packaging:</span>
                        <strong>₹{Math.round(((editingInvoice.freightCostUSD || 0) + (editingInvoice.packagingCostUSD || 0)) * 85).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-orange-200 text-sm font-black text-orange-900">
                        <span>Grand Total (INR):</span>
                        <span>₹{fin.grandTotalINR.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Save &amp; Update Invoice</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PDF MODAL */}
      {activePrintInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden print:p-0 print:bg-white print:static print:inset-auto print:z-auto print:block">
          <div className="bg-white text-slate-900 max-w-4xl w-full max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 font-sans overflow-hidden relative print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none print:w-full print:block">
            
            {/* Modal Controls (Sticky Top Bar - Always Visible, Hidden in Print) */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0 z-20 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-900 font-mono text-xs font-bold uppercase tracking-wider">
                  Official GST Tax Invoice
                </span>
                <span className="text-xs font-mono text-slate-600 font-bold">{activePrintInvoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary text-xs py-2 px-3 sm:px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> <span>Print / Save as PDF</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setActivePrintInvoice(null)}
                  className="p-2 rounded-full bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Sheet */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-6 print:p-0 print:overflow-visible">

            {/* Document Header – live from companySettings via currentSeller */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <img src="/weldor-logo.png" alt="Weldor Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-heading leading-tight">
                      {currentSeller.companyName || activePrintInvoice.seller?.companyName || 'Company Name'}
                    </h2>
                    <p className="text-[10.5px] font-mono text-slate-600">Manufacturers of Precision Hydraulic & Pneumatic Automation</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 font-mono mt-2">{currentSeller.address || activePrintInvoice.seller?.address || ''}</p>
                <p className="text-xs text-slate-700 font-mono">
                  GSTIN: <strong>{currentSeller.gstin || activePrintInvoice.seller?.gstin || 'N/A'}</strong> | PAN: <strong>{currentSeller.pan || activePrintInvoice.seller?.pan || 'N/A'}</strong> | State: <strong>{currentSeller.state || activePrintInvoice.seller?.state || ''} ({currentSeller.stateCode || activePrintInvoice.seller?.stateCode || ''})</strong>
                </p>
                {(currentSeller.email || currentSeller.phone) && (
                  <p className="text-[10.5px] text-slate-600 font-mono">
                    {currentSeller.email && <span>Email: {currentSeller.email}</span>}{currentSeller.email && currentSeller.phone && ' | '}{currentSeller.phone && <span>Tel: {currentSeller.phone}</span>}
                  </p>
                )}
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded text-xs font-mono font-bold">
                  TAX INVOICE (GST)
                </span>
                <p className="text-sm font-black font-mono text-slate-900 mt-1">{activePrintInvoice.invoiceNumber}</p>
                <p className="text-xs text-slate-600 font-mono">Date: {activePrintInvoice.issueDate}</p>
                <p className="text-xs text-slate-600 font-mono">PO Ref: {activePrintInvoice.poNumber} ({activePrintInvoice.poDate})</p>
              </div>
            </div>

            {/* Buyer and Consignee Information */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl font-mono border border-slate-200">
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">BILLED & SHIPPED TO:</span>
                <p className="font-extrabold text-slate-900 text-sm">{activePrintInvoice.buyer?.companyName || 'Buyer Company'}</p>
                <p className="text-slate-700">Attn: {activePrintInvoice.buyer?.contactName}</p>
                <p className="text-slate-600">{activePrintInvoice.buyer?.billingAddress}</p>
                <p className="text-slate-800 font-bold">GSTIN: {activePrintInvoice.buyer?.gstin} | State: {activePrintInvoice.buyer?.state} ({activePrintInvoice.buyer?.stateCode})</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">PAYMENT & BANKING DETAILS:</span>
                <p>Bank Name: <strong className="text-slate-900">{currentSeller.bankName || activePrintInvoice.seller?.bankName || 'Bank Not Configured'}</strong></p>
                <p>A/C Number: <strong className="text-slate-900">{currentSeller.accountNo || activePrintInvoice.seller?.accountNo || 'Not Configured'}</strong></p>
                <p>IFSC: <strong className="text-slate-900">{currentSeller.ifscCode || activePrintInvoice.seller?.ifscCode || 'N/A'}</strong>{(currentSeller.branch || activePrintInvoice.seller?.branch) ? ` — ${currentSeller.branch || activePrintInvoice.seller?.branch}` : ''}</p>
                <p>Payment Terms: <strong className="text-slate-900">{activePrintInvoice.paymentTerms || companySettings?.defaultTerms?.paymentTerms || 'Standard Terms'}</strong></p>
                {activePrintInvoice.agent?.hasAgent && (
                  <p className="text-amber-800 font-bold">Channel Partner: {activePrintInvoice.agent.agentName}</p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-mono text-slate-800">
                <tr>
                  <th className="p-2.5 border border-slate-300">#</th>
                  <th className="p-2.5 border border-slate-300">Description of Goods</th>
                  <th className="p-2.5 border border-slate-300 font-mono">HSN</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Qty</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Rate (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Disc</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Taxable (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">GST (₹)</th>
                  <th className="p-2.5 border border-slate-300 text-right font-mono">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(activePrintInvoice.items || []).map((item, i) => {
                  const itemRate = Math.round((item.unitPriceUSD || 0) * 85);
                  const itemTaxable = (item.taxableAmountUSD && item.taxableAmountUSD > 0)
                    ? Math.round(item.taxableAmountUSD * 85)
                    : Math.round(item.quantity * itemRate * (1 - (item.discountPct || 0) / 100));
                  const itemTax = ((item.cgstAmountUSD || 0) + (item.sgstAmountUSD || 0) + (item.igstAmountUSD || 0)) > 0
                    ? Math.round(((item.cgstAmountUSD || 0) + (item.sgstAmountUSD || 0) + (item.igstAmountUSD || 0)) * 85)
                    : Math.round(itemTaxable * ((activePrintInvoice.gstRatePct || 18) / 100));
                  const itemTotal = (item.totalUSD && item.totalUSD > 0)
                    ? Math.round(item.totalUSD * 85)
                    : itemTaxable + itemTax;

                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 border border-slate-300 text-center font-mono">{i + 1}</td>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900">{item.description || (item as any).productName || 'Item'} ({item.sku || 'N/A'})</td>
                      <td className="p-2 border border-slate-300 font-mono text-slate-600">{item.hsnCode || '8481.80.30'}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{item.quantity} {item.unit || 'PCS'}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">₹{itemRate.toLocaleString('en-IN')}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono text-orange-700">{item.discountPct || 0}%</td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold">₹{itemTaxable.toLocaleString('en-IN')}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">₹{itemTax.toLocaleString('en-IN')}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-black text-slate-900">₹{itemTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Financial Summary & Bank Wire Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Bank Wire Details for Payment from System Settings */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs font-mono space-y-1.5">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                  BANK WIRE & PAYMENT DETAILS FOR REMITTANCE:
                </span>
                <p className="text-slate-800">Beneficiary: <strong className="text-slate-900">{currentSeller.companyName || activePrintInvoice.seller?.companyName}</strong></p>
                <p className="text-slate-800">Bank Name: <strong>{currentSeller.bankName || activePrintInvoice.seller?.bankName || 'Bank Not Configured'}</strong></p>
                <p className="text-slate-800">Account No: <strong className="text-slate-900">{currentSeller.accountNo || activePrintInvoice.seller?.accountNo || 'Not Configured'}</strong></p>
                <p className="text-slate-800">IFSC / RTGS Code: <strong className="text-slate-900">{currentSeller.ifscCode || activePrintInvoice.seller?.ifscCode || 'N/A'}</strong></p>
                <p className="text-slate-800">Branch: {currentSeller.branch || activePrintInvoice.seller?.branch || ''}</p>
                <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600 space-y-0.5">
                  <p>• Payment Terms: <strong>{activePrintInvoice.paymentTerms || companySettings?.defaultTerms?.paymentTerms || 'Standard Terms'}</strong></p>
                  <p>• Delivery Terms: <strong>{activePrintInvoice.deliveryTerms || companySettings?.defaultTerms?.deliveryTerms || 'Ex-Factory'}</strong></p>
                  {companySettings?.defaultTerms?.warrantyTerms && (
                    <p>• Warranty: <strong>{companySettings.defaultTerms.warrantyTerms}</strong></p>
                  )}
                  {companySettings?.defaultTerms?.generalTerms && (
                    <p>• Policy: <strong>{companySettings.defaultTerms.generalTerms}</strong></p>
                  )}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end">
                {(() => {
                  const viewGrandTotal = activePrintInvoice.grandTotalINR || Math.round((activePrintInvoice.grandTotalUSD || 0) * 85);
                  const viewTaxable = (activePrintInvoice.taxableTotalUSD && activePrintInvoice.taxableTotalUSD > 0)
                    ? Math.round(activePrintInvoice.taxableTotalUSD * 85)
                    : (activePrintInvoice.subtotalUSD && activePrintInvoice.subtotalUSD > 0
                        ? Math.round((activePrintInvoice.subtotalUSD - (activePrintInvoice.totalDiscountUSD || 0)) * 85)
                        : Math.round(viewGrandTotal / (1 + (activePrintInvoice.gstRatePct || 18) / 100)));
                  const viewTax = (activePrintInvoice.totalTaxUSD && activePrintInvoice.totalTaxUSD > 0)
                    ? Math.round(activePrintInvoice.totalTaxUSD * 85)
                    : Math.max(0, viewGrandTotal - viewTaxable);
                  const viewSubtotal = (activePrintInvoice.subtotalUSD && activePrintInvoice.subtotalUSD > 0)
                    ? Math.round(activePrintInvoice.subtotalUSD * 85)
                    : viewTaxable;

                  return (
                    <div className="w-full sm:w-80 space-y-1 text-xs font-mono text-right border border-slate-200 p-3 rounded-xl bg-slate-50">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-bold">₹{viewSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-orange-700 font-bold">
                        <span>Discount Total:</span>
                        <span>-₹{Math.round((activePrintInvoice.totalDiscountUSD || 0) * 85).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                        <span>Taxable Value:</span>
                        <span>₹{viewTaxable.toLocaleString('en-IN')}</span>
                      </div>
                      {activePrintInvoice.taxType === 'INTRA_STATE' ? (
                        <>
                          <div className="flex justify-between text-slate-600">
                            <span>CGST ({((activePrintInvoice.gstRatePct || 18) / 2)}%):</span>
                            <span>₹{Math.round(viewTax / 2).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>SGST ({((activePrintInvoice.gstRatePct || 18) / 2)}%):</span>
                            <span>₹{Math.round(viewTax / 2).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between text-slate-600">
                          <span>IGST ({activePrintInvoice.gstRatePct || 18}%):</span>
                          <span>₹{viewTax.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Freight &amp; Forwarding:</span>
                        <span>₹{Math.round(((activePrintInvoice.freightCostUSD || 0) + (activePrintInvoice.packagingCostUSD || 0)) * 85).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-black text-base text-orange-700">
                        <span>Grand Total (INR):</span>
                        <span>₹{viewGrandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end print:pt-16">
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <p>Terms: Standard ISO 9001:2015 Warranty Applicable</p>
                <p>Goods once sold subject to Jamnagar Jurisdiction</p>
              </div>

              <div className="text-center font-mono text-xs">
                <p className="border-t border-slate-400 pt-1 w-52 font-bold text-slate-900">For, {activePrintInvoice.seller?.companyName || currentSeller.companyName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Authorized Signatory / Accounts Division</p>
              </div>
            </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
