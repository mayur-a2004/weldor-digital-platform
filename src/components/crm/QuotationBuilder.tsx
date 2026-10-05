import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Printer, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Plus,
  Search,
  Eye,
  Percent,
  UserCheck,
  Truck,
  Sparkles,
  Calculator,
  Calendar,
  Send,
  FileCheck
} from 'lucide-react';
import { Quotation } from '../../types';

export interface CommercialQuotationData {
  id: string;
  quotationNumber: string;
  leadId?: string;
  
  // Seller Information (Earth Metal Industries)
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

  // Buyer Information
  buyer: {
    companyName: string;
    contactName: string;
    designation?: string;
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
  gstRatePct: number; // 18, 12, 5, 28

  // Sales Broker / Agent Commission
  agent: {
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number;
    commissionAmountUSD: number;
  };

  // Line items
  items: Array<{
    id: string;
    productName: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unit: string;
    unitPriceUSD: number;
    discountPct: number;
    taxableAmountUSD: number;
    totalUSD: number;
  }>;

  // Commercial Terms
  paymentTerms: string;
  deliveryTerms: string;
  validityDays: number;
  warrantyTerms: string;
  packagingTerms: string;
  inspectionTerms: string;

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
  
  status: 'Draft' | 'Pending Manager Approval' | 'Approved' | 'Sent to Customer' | 'Accepted' | 'Rejected';
  createdAt: string;
  expiryDate: string;
}


const loadQuotes = (): CommercialQuotationData[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('weldor_commercial_quotes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
};

const saveQuotes = (data: CommercialQuotationData[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('weldor_commercial_quotes', JSON.stringify(data));
    } catch (e) {}
  }
};

const adaptToCommercialQuotation = (q: any): CommercialQuotationData => {
  if (q.seller && q.buyer && Array.isArray(q.items)) {
    return q as CommercialQuotationData;
  }
  const companyName = q.companyName || q.buyer?.companyName || 'B2B Industrial Client';
  const contactName = q.contactName || q.buyer?.contactName || 'Procurement Incharge';
  const email = q.email || q.buyer?.email || 'procurement@client.com';
  const phone = q.buyer?.phone || '+91 98250 11223';
  const subtotalUSD = Number(q.subtotalUSD) || 0;
  const totalDiscountUSD = Number(q.totalDiscountUSD) || 0;
  const taxableTotalUSD = subtotalUSD - totalDiscountUSD;
  const taxTotalUSD = Number(q.taxTotalUSD) || (taxableTotalUSD * 0.18);
  const freightCostUSD = Number(q.freightCostUSD) || 0;
  const grandTotalUSD = Number(q.grandTotalUSD) || (taxableTotalUSD + taxTotalUSD + freightCostUSD);
  const grandTotalINR = Number(q.grandTotalINR) || Math.round(grandTotalUSD * 87.0);

  return {
    id: q.id,
    quotationNumber: q.quotationNumber,
    leadId: q.leadId,
    seller: q.seller || {
      companyName: '',
      address: '',
      gstin: '',
      pan: '',
      state: '',
      stateCode: '',
      email: '',
      phone: '',
      bankName: '',
      accountNo: '',
      ifscCode: '',
      branch: ''
    },
    buyer: {
      companyName,
      contactName,
      designation: 'Procurement Head',
      billingAddress: q.buyer?.billingAddress || 'G.I.D.C Industrial Area, India',
      shippingAddress: q.buyer?.shippingAddress || 'Plant Gate, Delivery Location',
      gstin: q.buyer?.gstin || '24AAACE1234P1ZV',
      state: q.buyer?.state || 'Gujarat',
      stateCode: q.buyer?.stateCode || '24',
      email,
      phone
    },
    taxType: q.taxType || 'INTER_STATE',
    gstRatePct: q.gstRatePct || 18,
    agent: q.agent || {
      hasAgent: false,
      agentName: '',
      agentPhone: '',
      commissionType: 'PERCENT',
      commissionRate: 0,
      commissionAmountUSD: 0
    },
    items: Array.isArray(q.items) ? q.items.map((item: any, idx: number) => ({
      id: item.id || `q-item-${idx + 1}`,
      productName: item.productName || 'Industrial Component',
      sku: item.sku || 'WEL-SPEC-01',
      hsnCode: item.hsnCode || '84123100',
      quantity: Number(item.quantity) || 1,
      unit: item.unit || 'PCS',
      unitPriceUSD: Number(item.unitPriceUSD) || 100,
      discountPct: Number(item.discountPercentage || item.discountPct) || 0,
      taxableAmountUSD: Number(item.totalPriceUSD || item.taxableAmountUSD) || (Number(item.quantity || 1) * Number(item.unitPriceUSD || 100)),
      totalUSD: Number(item.totalPriceUSD || item.totalUSD) || (Number(item.quantity || 1) * Number(item.unitPriceUSD || 100)),
    })) : [],
    paymentTerms: q.paymentTerms || '30% Advance, 70% against Shipping Documents',
    deliveryTerms: q.deliveryTerms || 'Ex-Factory Weldor Plant / FOB',
    validityDays: Number(q.validityDays) || 30,
    warrantyTerms: q.warrantyTerms || '18 Months replacement warranty against manufacturing defects',
    packagingTerms: q.packagingTerms || 'Seaworthy Fumigated Wooden Case with VCI Corrosion Bag',
    inspectionTerms: q.inspectionTerms || '100% Hydrostatic Test & EN 10204 3.1 Mill Certificate included',
    subtotalUSD,
    totalDiscountUSD,
    taxableTotalUSD,
    cgstTotalUSD: q.cgstTotalUSD || 0,
    sgstTotalUSD: q.sgstTotalUSD || 0,
    igstTotalUSD: q.igstTotalUSD || taxTotalUSD,
    totalTaxUSD: taxTotalUSD,
    freightCostUSD,
    packagingCostUSD: q.packagingCostUSD || 0,
    grandTotalUSD,
    grandTotalINR,
    status: (q.status as any) || 'Approved',
    createdAt: q.createdAt || new Date().toISOString(),
    expiryDate: q.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  };
};

export const QuotationBuilder: React.FC = () => {
  const { 
    quotations, 
    approveQuotation, 
    rejectQuotation, 
    deleteQuotation, 
    convertQuotationToOrder, 
    createQuotationFromLead,
    addCommercialQuotation,
    setActiveView, 
    showNotification, 
    currentRole,
    companySettings,
    orders,
    inventory,
    products
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteQuoteId, setConfirmDeleteQuoteId] = useState<string | null>(null);

  // Dynamic Seller Information strictly from Company Settings & Banking (no hardcoded defaults)
  const currentSeller = useMemo(() => {
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
      if (companySettings.registeredOfficeAddress.pincode) regAddr += ` - ${companySettings.registeredOfficeAddress.pincode}`;
      if (companySettings.registeredOfficeAddress.country) regAddr += `, ${companySettings.registeredOfficeAddress.country}`;
    } else if (companySettings?.registeredOffice) {
      regAddr = companySettings.registeredOffice;
    }
    const factoryAddr = companySettings?.factoryPlantAddress || regAddr;

    const primaryBank = companySettings?.primaryBank || (companySettings?.bankAccounts && companySettings.bankAccounts[0]) || ({} as any);
    const resolvedGstin = companySettings?.gstinNumber || companySettings?.gstin || '';
    const resolvedPan = companySettings?.panNumber || (resolvedGstin.length >= 12 ? resolvedGstin.slice(2, 12) : '');

    return {
      companyName: companySettings?.legalEntityName || companySettings?.legalName || companySettings?.companyName || '',
      address: factoryAddr || regAddr || '',
      gstin: resolvedGstin,
      pan: resolvedPan,
      state: companySettings?.state || (typeof companySettings?.registeredOfficeAddress === 'object' ? companySettings?.registeredOfficeAddress?.state : '') || '',
      stateCode: companySettings?.stateCode || (resolvedGstin.length >= 2 && /^\d{2}$/.test(resolvedGstin.slice(0, 2)) ? resolvedGstin.slice(0, 2) : ''),
      email: companySettings?.supportEmail || companySettings?.primaryEmail || '',
      phone: companySettings?.salesPhone || companySettings?.primaryPhone || '',
      bankName: primaryBank.bankName || companySettings?.bankName || '',
      accountNo: primaryBank.accountNumber || (primaryBank as any).accountNo || companySettings?.bankAccountNumber || '',
      ifscCode: (primaryBank.ifscCode || companySettings?.ifscCode || '').toUpperCase(),
      branch: primaryBank.branch || companySettings?.bankBranch || ''
    };
  }, [companySettings]);
  
  // Unified quotes list: syncs directly from AppContext.quotations (WAL + Backend Database) + local
  // Strictly deduplicated by both ID and Quotation Number to eliminate duplicate records
  const quotesList = useMemo<CommercialQuotationData[]>(() => {
    const fromContext = (quotations || []).map(adaptToCommercialQuotation);
    const fromLocal = loadQuotes();
    const mapById = new Map<string, CommercialQuotationData>();
    const seenNumbers = new Set<string>();

    fromContext.forEach(q => {
      if (q && q.id) {
        mapById.set(q.id, q);
        if (q.quotationNumber) seenNumbers.add(q.quotationNumber.trim().toUpperCase());
      }
    });

    fromLocal.forEach(q => {
      if (q && q.id && !mapById.has(q.id)) {
        const qNum = (q.quotationNumber || '').trim().toUpperCase();
        if (!qNum || !seenNumbers.has(qNum)) {
          mapById.set(q.id, q);
          if (qNum) seenNumbers.add(qNum);
        }
      }
    });

    const list = Array.from(mapById.values());
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  }, [quotations]);

  const [activePDFQuotation, setActivePDFQuotation] = useState<CommercialQuotationData | null>(null);
  const [filterMode, setFilterMode] = useState<'active' | 'approved' | 'sent' | 'rejected' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);

  // Form State for creating B2B Quotation
  const [buyerForm, setBuyerForm] = useState({
    companyName: '',
    contactName: '',
    designation: 'Procurement Head',
    billingAddress: '',
    shippingAddress: '',
    gstin: '',
    pan: '',
    state: 'Maharashtra',
    stateCode: '27',
    email: '',
    phone: '',
  });

  const [taxConfig, setTaxConfig] = useState<{
    taxType: 'INTRA_STATE' | 'INTER_STATE' | 'EXPORT_ZERO';
    gstRatePct: number;
  }>({
    taxType: 'INTER_STATE',
    gstRatePct: 18,
  });

  const [agentForm, setAgentForm] = useState<{
    hasAgent: boolean;
    agentName: string;
    agentPhone: string;
    commissionType: 'PERCENT' | 'FIXED';
    commissionRate: number;
  }>({
    hasAgent: false,
    agentName: '',
    agentPhone: '',
    commissionType: 'PERCENT',
    commissionRate: 2,
  });

  const [commercialTermsForm, setCommercialTermsForm] = useState({
    paymentTerms: companySettings?.defaultTerms?.paymentTerms || '50% Advance with PO, 50% against PI before dispatch',
    deliveryTerms: companySettings?.defaultTerms?.deliveryTerms || 'Ex-Works Jamnagar Factory (7-10 Business Days)',
    validityDays: companySettings?.defaultTerms?.validityDays || 30,
    warrantyTerms: companySettings?.defaultTerms?.warrantyTerms || '18 Months replacement warranty against manufacturing defects',
    packagingTerms: companySettings?.defaultTerms?.packagingTerms || 'Seaworthy Fumigated Wooden Case with VCI Corrosion Bag',
    inspectionTerms: companySettings?.defaultTerms?.inspectionTerms || '100% Hydrostatic Test & EN 10204 3.1 Mill Certificate included',
    freightCostUSD: 120,
    packagingCostUSD: 60,
  });

  // Sync terms whenever companySettings defaultTerms change
  React.useEffect(() => {
    if (companySettings?.defaultTerms) {
      setCommercialTermsForm(prev => ({
        ...prev,
        paymentTerms: companySettings.defaultTerms?.paymentTerms || prev.paymentTerms,
        deliveryTerms: companySettings.defaultTerms?.deliveryTerms || prev.deliveryTerms,
        validityDays: companySettings.defaultTerms?.validityDays || prev.validityDays,
        warrantyTerms: companySettings.defaultTerms?.warrantyTerms || prev.warrantyTerms,
        packagingTerms: companySettings.defaultTerms?.packagingTerms || prev.packagingTerms,
        inspectionTerms: companySettings.defaultTerms?.inspectionTerms || prev.inspectionTerms,
      }));
    }
  }, [companySettings?.defaultTerms]);

  const [lineItems, setLineItems] = useState([
    {
      productName: 'ISO 15552 Heavy-Duty Pneumatic Actuator Cylinder (Ø63mm x 200mm)',
      sku: 'WEL-PNC-63-200',
      hsnCode: '84123100',
      quantity: 20,
      unit: 'PCS',
      unitPriceUSD: 85,
      discountPct: 5,
    },
    {
      productName: '700 Bar Solenoid Directional Hydraulic Control Valve CETOP 3',
      sku: 'WEL-HYV-700B',
      hsnCode: '84812000',
      quantity: 5,
      unit: 'PCS',
      unitPriceUSD: 280,
      discountPct: 0,
    }
  ]);

  // Live Math Calculations
  const calculatedItems = lineItems.map((item, idx) => {
    const rawTotal = (item.quantity || 0) * (item.unitPriceUSD || 0);
    const discountAmt = rawTotal * ((item.discountPct || 0) / 100);
    const taxableAmt = rawTotal - discountAmt;
    return {
      ...item,
      id: `q-item-${idx + 1}`,
      rawTotal,
      discountAmt,
      taxableAmountUSD: taxableAmt,
      totalUSD: taxableAmt,
    };
  });

  const subtotalUSD = calculatedItems.reduce((acc, it) => acc + it.rawTotal, 0);
  const totalDiscountUSD = calculatedItems.reduce((acc, it) => acc + it.discountAmt, 0);
  const taxableTotalUSD = calculatedItems.reduce((acc, it) => acc + it.taxableAmountUSD, 0);

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;

  if (taxConfig.taxType === 'INTRA_STATE') {
    cgstRate = taxConfig.gstRatePct / 2;
    sgstRate = taxConfig.gstRatePct / 2;
  } else if (taxConfig.taxType === 'INTER_STATE') {
    igstRate = taxConfig.gstRatePct;
  }

  const cgstTotalUSD = taxableTotalUSD * (cgstRate / 100);
  const sgstTotalUSD = taxableTotalUSD * (sgstRate / 100);
  const igstTotalUSD = taxableTotalUSD * (igstRate / 100);
  const totalTaxUSD = cgstTotalUSD + sgstTotalUSD + igstTotalUSD;

  const grandTotalUSD = taxableTotalUSD + totalTaxUSD + (Number(commercialTermsForm.freightCostUSD) || 0) + (Number(commercialTermsForm.packagingCostUSD) || 0);
  const grandTotalINR = Math.round(grandTotalUSD * 87.0);

  let calculatedAgentCommissionUSD = 0;
  if (agentForm.hasAgent) {
    if (agentForm.commissionType === 'PERCENT') {
      calculatedAgentCommissionUSD = taxableTotalUSD * ((agentForm.commissionRate || 0) / 100);
    } else {
      calculatedAgentCommissionUSD = Number(agentForm.commissionRate) || 0;
    }
  }

  // Multi-Product Quick Picker state
  const [isMultiPickerOpen, setIsMultiPickerOpen] = useState(false);
  const [multiPickerSelected, setMultiPickerSelected] = useState<Record<string, { selected: boolean; quantity: number }>>({});
  const [multiPickerSearch, setMultiPickerSearch] = useState('');
  const [multiPickerCategory, setMultiPickerCategory] = useState('All');

  // Combined master products catalog for quotation picking
  const selectableCatalog = useMemo(() => {
    const list: Array<{
      id: string;
      sku: string;
      name: string;
      category: string;
      hsnCode: string;
      unit: string;
      unitPriceUSD: number;
      unitPriceINR: number;
      stock: number;
      isInternal: boolean;
    }> = [];

    // From Godown Inventory
    inventory.forEach(inv => {
      list.push({
        id: inv.id,
        sku: inv.sku,
        name: inv.name,
        category: inv.category || 'MIG Consumables & Spares',
        hsnCode: inv.hsnCode || '85159000',
        unit: inv.unit || 'PCS',
        unitPriceUSD: inv.unitPriceUSD || Math.round((inv.unitPriceINR || 0) / 85),
        unitPriceINR: inv.unitPriceINR || 0,
        stock: inv.currentStock || 0,
        isInternal: !inv.isPublic
      });
    });

    // From Website Products
    (products || []).forEach(p => {
      if (!list.some(i => i.sku.toUpperCase() === p.sku?.toUpperCase())) {
        list.push({
          id: p.id,
          sku: p.sku || `WLD-${p.id}`,
          name: p.name || (p as any).title || 'Precision Product',
          category: p.category || 'General',
          hsnCode: (p as any).hsnCode || '84123100',
          unit: 'PCS',
          unitPriceUSD: (p as any).priceUSD || Math.round(((p as any).priceINR || 0) / 85) || 120,
          unitPriceINR: (p as any).priceINR || ((p as any).priceUSD ? (p as any).priceUSD * 85 : 9500),
          stock: (p as any).stock || 50,
          isInternal: false
        });
      }
    });

    return list;
  }, [inventory, products]);

  const filteredPickerItems = useMemo(() => {
    return selectableCatalog.filter(item => {
      if (multiPickerCategory !== 'All' && item.category !== multiPickerCategory) return false;
      if (multiPickerSearch.trim()) {
        const q = multiPickerSearch.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.hsnCode.includes(q);
      }
      return true;
    });
  }, [selectableCatalog, multiPickerCategory, multiPickerSearch]);

  const pickerCategories = useMemo(() => {
    const set = new Set<string>();
    selectableCatalog.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set).sort();
  }, [selectableCatalog]);

  const handleInsertMultiProducts = () => {
    const selectedEntries = Object.entries(multiPickerSelected).filter(([_, val]) => val.selected);
    if (selectedEntries.length === 0) {
      showNotification('Please select at least one product to insert!', 'warning');
      return;
    }

    const newItems = selectedEntries.map(([id, val]) => {
      const item = selectableCatalog.find(i => i.id === id);
      return {
        productName: item?.name || 'Selected Component',
        sku: item?.sku || 'SKU-SELECTED',
        hsnCode: item?.hsnCode || '85159000',
        quantity: Math.max(1, val.quantity || 1),
        unit: item?.unit || 'PCS',
        unitPriceUSD: item?.unitPriceUSD || 100,
        discountPct: 0
      };
    });

    setLineItems(prev => [...prev, ...newItems]);
    showNotification(`⚡ Successfully added ${newItems.length} products to quotation!`, 'success');
    setMultiPickerSelected({});
    setIsMultiPickerOpen(false);
  };

  const handleAddItemRow = () => {
    setLineItems(prev => [
      ...prev,
      {
        productName: 'Custom 5-Axis CNC Precision Manifold Block AL7075',
        sku: 'WEL-CNC-MF-NEW',
        hsnCode: '84819090',
        quantity: 5,
        unit: 'PCS',
        unitPriceUSD: 195,
        discountPct: 0,
      }
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (lineItems.length <= 1) {
      showNotification('At least one product line item is required in the quotation!', 'warning');
      return;
    }
    setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const buyerCompany = (buyerForm.companyName || '').trim();
    if (!buyerCompany) {
      showNotification('Buyer Company Name is mandatory!', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newQuoteNumber = `WEL-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toISOString();
      const expiry = new Date(Date.now() + (commercialTermsForm.validityDays || 30) * 86400000).toISOString().split('T')[0];

      const newQuote: CommercialQuotationData = {
        id: `quote-${Date.now()}`,
        quotationNumber: newQuoteNumber,
        seller: currentSeller,
        buyer: {
          companyName: buyerForm.companyName,
          contactName: buyerForm.contactName || 'Procurement Incharge',
          designation: buyerForm.designation,
          billingAddress: buyerForm.billingAddress || 'Industrial Area, India',
          shippingAddress: buyerForm.shippingAddress || buyerForm.billingAddress || 'Factory Gate, India',
          gstin: buyerForm.gstin || '27AAACE1234P1ZV',
          pan: buyerForm.pan,
          state: buyerForm.state,
          stateCode: buyerForm.stateCode,
          email: buyerForm.email || 'procurement@client.com',
          phone: buyerForm.phone || '+91 98000 00000'
        },
        taxType: taxConfig.taxType,
        gstRatePct: taxConfig.gstRatePct,
        agent: {
          hasAgent: agentForm.hasAgent,
          agentName: agentForm.agentName,
          agentPhone: agentForm.agentPhone,
          commissionType: agentForm.commissionType,
          commissionRate: agentForm.commissionRate,
          commissionAmountUSD: calculatedAgentCommissionUSD
        },
        items: calculatedItems.map(item => ({
          id: item.id,
          productName: item.productName,
          sku: item.sku,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          unit: item.unit,
          unitPriceUSD: item.unitPriceUSD,
          discountPct: item.discountPct,
          taxableAmountUSD: item.taxableAmountUSD,
          totalUSD: item.totalUSD
        })),
        paymentTerms: commercialTermsForm.paymentTerms,
        deliveryTerms: commercialTermsForm.deliveryTerms,
        validityDays: commercialTermsForm.validityDays,
        warrantyTerms: commercialTermsForm.warrantyTerms,
        packagingTerms: commercialTermsForm.packagingTerms,
        inspectionTerms: commercialTermsForm.inspectionTerms,
        subtotalUSD,
        totalDiscountUSD,
        taxableTotalUSD,
        cgstTotalUSD,
        sgstTotalUSD,
        igstTotalUSD,
        totalTaxUSD,
        freightCostUSD: Number(commercialTermsForm.freightCostUSD) || 0,
        packagingCostUSD: Number(commercialTermsForm.packagingCostUSD) || 0,
        grandTotalUSD,
        grandTotalINR,
        status: 'Approved',
        createdAt: today,
        expiryDate: expiry
      };

      // Add quotation cleanly to WAL, Context state, and LocalStorage - avoids dual generation & duplicate records
      addCommercialQuotation(newQuote);

      setIsCreateQuoteModalOpen(false);
      setActivePDFQuotation(newQuote);
      showNotification(`Formal Quotation ${newQuoteNumber} generated successfully!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuotes = (quotesList || []).filter(q => {
    if (!q) return false;
    const query = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !query ||
      (q.quotationNumber || '').toLowerCase().includes(query) ||
      (q.buyer?.companyName || '').toLowerCase().includes(query) ||
      (q.buyer?.contactName && q.buyer.contactName.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (filterMode === 'active') return q.status !== 'Rejected';
    if (filterMode === 'approved') return q.status === 'Approved';
    if (filterMode === 'sent') return q.status === 'Sent to Customer';
    if (filterMode === 'rejected') return q.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              B2B COMMERCIAL QUOTATION ENGINE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Earth Metal Industries • Jamnagar
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-heading">
            Commercial Quotations & Proforma Costings
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl font-sans">
            Generate detailed B2B proposals with Seller & Buyer company credentials, itemized HSN codes, multi-tier GST (CGST/SGST/IGST), line discounts, and broker commission payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateQuoteModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Formal Quotation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total Active Quotes</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{quotesList.length}</span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% Verified</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total Quoted Value</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-orange-600 font-mono">
              ₹{quotesList.reduce((sum, q) => sum + (q.grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85)), 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-mono text-slate-400">INR</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Total GST Tax Quoted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-800 font-mono">
              ₹{Math.round(quotesList.reduce((sum, q) => sum + (q.totalTaxUSD || 0), 0) * 85).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">CGST+SGST/IGST</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Broker Commission Quoted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-purple-700 font-mono">
              ₹{Math.round(quotesList.reduce((sum, q) => sum + (q.agent?.commissionAmountUSD || 0), 0) * 85).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">Agent Payout</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by quote #, client company, contact..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['active', 'approved', 'sent', 'rejected', 'all'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 text-xs rounded-xl font-mono font-bold capitalize transition-all cursor-pointer ${
                filterMode === mode 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="font-bold text-slate-600">No commercial quotations found</p>
            <p className="text-xs">Click "Generate Formal Quotation" above to draft a detailed B2B quote with GST breakdown.</p>
          </div>
        ) : (
          filteredQuotes.map(quote => (
            <div 
              key={quote.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">{quote.quotationNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        quote.status === 'Sent to Customer' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'Accepted' ? 'bg-emerald-500 text-white' :
                        quote.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {quote.status}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {quote.taxType === 'INTRA_STATE' ? `Intra-State (CGST ${quote.gstRatePct/2}% + SGST ${quote.gstRatePct/2}%)` :
                         quote.taxType === 'INTER_STATE' ? `Inter-State (IGST ${quote.gstRatePct}%)` : 'Export Zero-Rated LUT'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {quote.buyer?.companyName || 'Unknown Buyer'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Attn: {quote.buyer?.contactName || 'N/A'} • GSTIN: <strong className="text-slate-700">{quote.buyer?.gstin || 'N/A'}</strong> • State: {quote.buyer?.state || 'N/A'} ({quote.buyer?.stateCode || '00'})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Grand Total (Incl. GST)</span>
                    <span className="text-lg font-mono font-black text-orange-600">
                      ₹{(quote.grandTotalINR || Math.round((quote.grandTotalUSD || 0) * 85)).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const linkedOrder = (orders || []).find(o => o.quotationId === quote.id);
                      if (linkedOrder) {
                        return (
                          <button
                            onClick={() => setActiveView('crm-orders')}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            title={`Order ${linkedOrder.orderNumber} already confirmed in Orders & Dispatch`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Order: {linkedOrder.orderNumber}</span>
                          </button>
                        );
                      }
                      return (
                        <button
                          onClick={() => {
                            convertQuotationToOrder(quote.id, quote);
                            setActiveView('crm-orders');
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Convert this quote into a confirmed Production Order"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Convert to Order</span>
                        </button>
                      );
                    })()}

                    <button
                      onClick={() => setActivePDFQuotation(quote)}
                      className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print PDF</span>
                    </button>

                    {confirmDeleteQuoteId === quote.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-lg">
                        <span className="text-[10px] text-rose-800 font-bold px-1 font-mono">Delete?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteQuotation(quote.id);
                            setConfirmDeleteQuoteId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer hover:bg-rose-700 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteQuoteId(null)}
                          className="px-1.5 py-0.5 rounded bg-white text-slate-700 text-[10px] cursor-pointer hover:bg-slate-100 border border-slate-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteQuoteId(quote.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Quotation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Summary & Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Itemized Products</span>
                  <p className="font-bold text-slate-800 mt-0.5">{(quote.items || []).length} Product Line Items</p>
                  <p className="text-slate-600 text-[11px] truncate">
                    {(quote.items || []).map(it => `${it.productName} (${it.quantity} ${it.unit})`).join(', ')}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Tax & Freight Calculation</span>
                  <p className="text-slate-700 mt-0.5">
                    Taxable: <strong className="text-slate-900">₹{Math.round((quote.taxableTotalUSD || 0) * 85).toLocaleString('en-IN')}</strong> | Tax: <strong className="text-emerald-700">₹{Math.round((quote.totalTaxUSD || 0) * 85).toLocaleString('en-IN')}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Freight: ₹{Math.round((quote.freightCostUSD || 0) * 85)} | Packaging: ₹{Math.round((quote.packagingCostUSD || 0) * 85)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Agent Commission / Sales Terms</span>
                  {quote.agent?.hasAgent ? (
                    <p className="text-purple-700 font-bold mt-0.5">
                      {quote.agent.agentName} ({quote.agent.commissionRate}% = ₹{Math.round(quote.agent.commissionAmountUSD * 85).toLocaleString('en-IN')})
                    </p>
                  ) : (
                    <p className="text-slate-500 mt-0.5">Direct Factory Sale (No Agent)</p>
                  )}
                  <p className="text-[11px] text-slate-500">Validity: {quote.validityDays} Days • Ex-Works Jamnagar</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Formal B2B Quotation PDF Modal */}
      {activePDFQuotation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden print:p-0 print:bg-white print:static print:inset-auto print:z-auto print:block">
          <div className="bg-white text-slate-900 max-w-4xl w-full max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 font-sans overflow-hidden relative print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none print:w-full print:block">
            
            {/* Modal Controls (Sticky Top Bar - Always Visible, Hidden in Print) */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0 z-20 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-900 font-mono text-xs font-bold uppercase tracking-wider">
                  Official B2B Commercial Quotation
                </span>
                <span className="text-xs font-mono text-slate-600 font-bold">{activePDFQuotation.quotationNumber}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {(() => {
                  const linkedPdfOrder = (orders || []).find(o => o.quotationId === activePDFQuotation.id);
                  if (linkedPdfOrder) {
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePDFQuotation(null);
                          setActiveView('crm-orders');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="View confirmed order in Orders Manager"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span>Order: {linkedPdfOrder.orderNumber}</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        convertQuotationToOrder(activePDFQuotation.id, activePDFQuotation);
                        setActivePDFQuotation(null);
                        setActiveView('crm-orders');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Convert this quotation into a production order and navigate to Orders Manager"
                    >
                      <Truck className="w-4 h-4" /> <span>Convert to Confirmed Order</span>
                    </button>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary text-xs py-2 px-3 sm:px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> <span>Print / Save as PDF</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setActivePDFQuotation(null)}
                  className="p-2 rounded-full bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Sheet */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-6 print:p-0 print:overflow-visible">
              {/* Document Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <img 
                      src="/weldor-logo.png" 
                      alt="Weldor Logo" 
                      className="h-12 w-auto object-contain" 
                    />
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                        {activePDFQuotation.seller.companyName}
                      </h2>
                      <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                        Precision Hydraulic, Pneumatic & CNC Components OEM Manufacturer
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-mono mt-1">{activePDFQuotation.seller.address}</p>
                  <div className="flex flex-wrap gap-x-4 text-xs text-slate-600 font-mono">
                    <span>GSTIN: <strong className="text-slate-900">{activePDFQuotation.seller.gstin}</strong></span>
                    <span>PAN: <strong className="text-slate-900">{activePDFQuotation.seller.pan}</strong></span>
                    <span>State: <strong className="text-slate-900">{activePDFQuotation.seller.state} (Code: {activePDFQuotation.seller.stateCode})</strong></span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">Email: {activePDFQuotation.seller.email} | Mobile: {activePDFQuotation.seller.phone}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block bg-orange-600 text-white font-mono font-bold px-3 py-1 rounded text-xs tracking-wider uppercase">
                    COMMERCIAL QUOTATION
                  </span>
                  <p className="text-sm font-black font-mono text-slate-900 mt-1">{activePDFQuotation.quotationNumber}</p>
                  <p className="text-xs text-slate-600 font-mono">Date: {new Date(activePDFQuotation.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-slate-600 font-mono">Valid Until: {activePDFQuotation.expiryDate}</p>
                </div>
              </div>

              {/* Buyer and Shipping Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">QUOTATION ISSUED TO (BUYER):</span>
                  <p className="font-bold text-slate-900 text-sm">{activePDFQuotation.buyer?.companyName || 'Buyer Company'}</p>
                  <p className="text-slate-700">Attn: <strong>{activePDFQuotation.buyer?.contactName || 'Procurement'}</strong> ({activePDFQuotation.buyer?.designation || 'Procurement Incharge'})</p>
                  <p className="text-slate-700">Billing Address: {activePDFQuotation.buyer?.billingAddress || 'N/A'}</p>
                  <p className="text-slate-700">GSTIN: <strong className="text-slate-900">{activePDFQuotation.buyer?.gstin || 'N/A'}</strong> | PAN: {activePDFQuotation.buyer?.pan || 'N/A'}</p>
                  <p className="text-slate-700">State: <strong className="text-slate-900">{activePDFQuotation.buyer?.state || 'N/A'} (State Code: {activePDFQuotation.buyer?.stateCode || '00'})</strong></p>
                  <p className="text-slate-700">Email: {activePDFQuotation.buyer?.email || 'N/A'} | Phone: {activePDFQuotation.buyer?.phone || 'N/A'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">DELIVERY & COMMERCIAL TERMS:</span>
                  <p className="text-slate-700">Ship To: {activePDFQuotation.buyer?.shippingAddress || activePDFQuotation.buyer?.billingAddress || 'N/A'}</p>
                  <p className="text-slate-700">Payment Terms: <strong className="text-slate-900">{activePDFQuotation.paymentTerms}</strong></p>
                  <p className="text-slate-700">Delivery Lead Time: <strong className="text-slate-900">{activePDFQuotation.deliveryTerms}</strong></p>
                  <p className="text-slate-700">Quote Validity: <strong className="text-slate-900">{activePDFQuotation.validityDays} Days</strong></p>
                  <p className="text-slate-700">Warranty: <strong className="text-slate-900">{activePDFQuotation.warrantyTerms}</strong></p>
                  {activePDFQuotation.agent?.hasAgent && (
                    <p className="text-purple-700 font-bold pt-1 border-t border-slate-200">
                      Channel Partner / Broker: {activePDFQuotation.agent.agentName}
                    </p>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-800 text-white font-mono text-[11px]">
                      <th className="p-2.5 border border-slate-400 text-center w-8">#</th>
                      <th className="p-2.5 border border-slate-400">Description of Goods</th>
                      <th className="p-2.5 border border-slate-400 text-center">HSN Code</th>
                      <th className="p-2.5 border border-slate-400 text-center">Qty</th>
                      <th className="p-2.5 border border-slate-400 text-right">Unit Rate (₹)</th>
                      <th className="p-2.5 border border-slate-400 text-center">Disc %</th>
                      <th className="p-2.5 border border-slate-400 text-right">Taxable Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {activePDFQuotation.items.map((item, idx) => {
                      const unitRate = Number(item.unitPriceUSD || (item as any).unitPrice || 0);
                      const qty = Number(item.quantity || 1);
                      const disc = Number(item.discountPct ?? (item as any).discountPercentage ?? 0);
                      const anyItem = item as any;
                      const rawTaxable = item.taxableAmountUSD != null && !isNaN(Number(item.taxableAmountUSD))
                        ? Number(item.taxableAmountUSD)
                        : (anyItem.totalPriceUSD != null && !isNaN(Number(anyItem.totalPriceUSD))
                            ? Number(anyItem.totalPriceUSD)
                            : (item.totalUSD != null && !isNaN(Number(item.totalUSD))
                                ? Number(item.totalUSD)
                                : (qty * unitRate * (1 - disc / 100))));
                      const taxableUSD = isNaN(rawTaxable) ? 0 : rawTaxable;

                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 border border-slate-300 text-center text-slate-500 font-bold">{idx + 1}</td>
                          <td className="p-2.5 border border-slate-300">
                            <p className="font-bold text-slate-900 font-sans">{item.productName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</p>
                          </td>
                          <td className="p-2.5 border border-slate-300 text-center text-slate-700 font-bold">{item.hsnCode || '8481.80.30'}</td>
                          <td className="p-2.5 border border-slate-300 text-center text-slate-800 font-bold">{qty} {item.unit || 'PCS'}</td>
                          <td className="p-2.5 border border-slate-300 text-right text-slate-800">₹{Math.round(unitRate * 85).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 border border-slate-300 text-center text-slate-600">{disc > 0 ? `${disc}%` : '-'}</td>
                          <td className="p-2.5 border border-slate-300 text-right font-bold text-slate-900">
                            ₹{Math.round(taxableUSD * 85).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary & Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Bank Wire Details for Advance Payment */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs font-mono space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    BANK WIRE & PAYMENT DETAILS FOR ADVANCE:
                  </span>
                  <p className="text-slate-800">Beneficiary: <strong className="text-slate-900">{activePDFQuotation.seller.companyName}</strong></p>
                  <p className="text-slate-800">Bank Name: <strong>{activePDFQuotation.seller.bankName}</strong></p>
                  <p className="text-slate-800">Account No: <strong className="text-slate-900">{activePDFQuotation.seller.accountNo}</strong></p>
                  <p className="text-slate-800">IFSC / RTGS Code: <strong className="text-slate-900">{activePDFQuotation.seller.ifscCode}</strong></p>
                  <p className="text-slate-800">Branch: {activePDFQuotation.seller.branch}</p>
                  <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600">
                    <p>• Material Testing: {activePDFQuotation.inspectionTerms}</p>
                    <p>• Packaging: {activePDFQuotation.packagingTerms}</p>
                  </div>
                </div>

                {/* Totals Table */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Gross Item Subtotal:</span>
                    <span className="text-slate-900 font-bold">₹{Math.round((activePDFQuotation.subtotalUSD || 0) * 85).toLocaleString('en-IN')}</span>
                  </div>
                  {(activePDFQuotation.totalDiscountUSD || 0) > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                      <span>Total Discount Savings:</span>
                      <span>- ₹{Math.round((activePDFQuotation.totalDiscountUSD || 0) * 85).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-bold">Taxable Amount:</span>
                    <span className="text-slate-900 font-bold">₹{Math.round((activePDFQuotation.taxableTotalUSD || activePDFQuotation.subtotalUSD || 0) * 85).toLocaleString('en-IN')}</span>
                  </div>

                  {/* GST Split */}
                  {activePDFQuotation.taxType === 'INTRA_STATE' && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                        <span>CGST ({((activePDFQuotation.gstRatePct || 18) / 2)}%):</span>
                        <span>₹{Math.round((activePDFQuotation.cgstTotalUSD || 0) * 85).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                        <span>SGST ({((activePDFQuotation.gstRatePct || 18) / 2)}%):</span>
                        <span>₹{Math.round((activePDFQuotation.sgstTotalUSD || 0) * 85).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}

                  {activePDFQuotation.taxType === 'INTER_STATE' && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                      <span>IGST ({activePDFQuotation.gstRatePct || 18}%):</span>
                      <span>₹{Math.round((activePDFQuotation.igstTotalUSD || 0) * 85).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {activePDFQuotation.taxType === 'EXPORT_ZERO' && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                      <span>Zero-Rated Export (LUT Scheme):</span>
                      <span>₹0</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Freight & Logistics:</span>
                    <span className="text-slate-900">₹{Math.round((activePDFQuotation.freightCostUSD || 0) * 85).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Export Packaging:</span>
                    <span className="text-slate-900">₹{Math.round((activePDFQuotation.packagingCostUSD || 0) * 85).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-orange-700">
                    <span>Grand Total (INR):</span>
                    <span>₹{(activePDFQuotation.grandTotalINR || Math.round((activePDFQuotation.grandTotalUSD || 0) * 85)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Signatures */}
              <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs font-mono text-slate-600">
                <div className="max-w-md text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-bold text-slate-700">Standard Commercial Conditions:</p>
                  <p>1. Prices are valid for {activePDFQuotation.validityDays} days from the quotation date.</p>
                  <p>2. Subject to Jamnagar, Gujarat jurisdiction only.</p>
                  <p>3. Raw material price escalation clause applies if PO is delayed beyond validity period.</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-48 border-b border-slate-400 pb-8 text-slate-300 font-sans italic text-xs">
                    (Digital Stamp & Signature)
                  </div>
                  <p className="font-bold text-slate-900 text-xs">For, EARTH METAL INDUSTRIES</p>
                  <p className="text-[10.5px] text-slate-500">Authorized B2B Signatory</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Generate Custom Quotation Modal */}
      {isCreateQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className="bg-white text-slate-900 max-w-4xl w-full max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 font-sans overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase border border-orange-200">
                  B2B COMMERCIAL BILLING ENGINE
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1 font-heading">
                  Create Formal B2B Quotation
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Issue an official commercial proposal with Earth Metal Industries seller data, buyer credentials, GST tax type, and broker commission.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsCreateQuoteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} noValidate className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
              {/* Buyer / Client Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orange-600" /> Buyer & Consignee Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Buyer / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Industrial Automation LLC"
                      value={buyerForm.companyName}
                      onChange={e => setBuyerForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={buyerForm.contactName}
                      onChange={e => setBuyerForm(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Head of Procurement"
                      value={buyerForm.designation}
                      onChange={e => setBuyerForm(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="procurement@apex-auto.com"
                      value={buyerForm.email}
                      onChange={e => setBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Direct Phone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={buyerForm.phone}
                      onChange={e => setBuyerForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">Buyer GSTIN (15 Digits)</label>
                    <input
                      type="text"
                      placeholder="27AAACE1234P1ZV"
                      value={buyerForm.gstin}
                      onChange={e => setBuyerForm(prev => ({ ...prev, gstin: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-mono uppercase"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono font-bold text-slate-700 mb-1">Billing & Registered Address</label>
                    <input
                      type="text"
                      placeholder="Plot No. 42, MIDC Industrial Area, Pune, Maharashtra"
                      value={buyerForm.billingAddress}
                      onChange={e => setBuyerForm(prev => ({ ...prev, billingAddress: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-slate-700 mb-1">State & State Code</label>
                    <input
                      type="text"
                      placeholder="Maharashtra (27)"
                      value={buyerForm.state}
                      onChange={e => setBuyerForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* GST Tax Type & Agent Commission Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Tax Config */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-600" /> GST Tax Configuration
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'INTRA_STATE' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'INTRA_STATE' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Intra-State</div>
                      <div className="text-[10px] opacity-80">CGST + SGST</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'INTER_STATE' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'INTER_STATE' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Inter-State</div>
                      <div className="text-[10px] opacity-80">IGST (18%)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxConfig(prev => ({ ...prev, taxType: 'EXPORT_ZERO' }))}
                      className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all cursor-pointer ${
                        taxConfig.taxType === 'EXPORT_ZERO' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>Export LUT</div>
                      <div className="text-[10px] opacity-80">0% Zero-Rated</div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-600 font-bold">GST Tax Rate:</span>
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setTaxConfig(prev => ({ ...prev, gstRatePct: rate }))}
                        className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold border transition-colors cursor-pointer ${
                          taxConfig.gstRatePct === rate 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Broker / Agent Commission */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-purple-600" /> Sales Agent / Broker Commission
                    </span>
                    <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agentForm.hasAgent}
                        onChange={e => setAgentForm(prev => ({ ...prev, hasAgent: e.target.checked }))}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-700">Has Agent</span>
                    </label>
                  </div>

                  {agentForm.hasAgent ? (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <label className="block text-[10.5px] text-slate-600 mb-0.5">Agent / Broker Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Industrial Reps"
                          value={agentForm.agentName}
                          onChange={e => setAgentForm(prev => ({ ...prev, agentName: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] text-slate-600 mb-0.5">Commission Rate (% or ₹)</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={agentForm.commissionRate}
                            onChange={e => setAgentForm(prev => ({ ...prev, commissionRate: Number(e.target.value) || 0 }))}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                          />
                          <span className="text-xs text-slate-500 font-bold">%</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-[11px] text-purple-700 font-bold bg-purple-50 p-2 rounded-lg border border-purple-200">
                        Calculated Agent Payout: ₹{Math.round(calculatedAgentCommissionUSD * 85).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-mono italic">
                      Direct factory quotation without third-party sales broker.
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                    Itemized Product Bill ({lineItems.length} items)
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsMultiPickerOpen(true)}
                      className="text-xs font-mono font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Multi-Product Quick Picker</span>
                    </button>

                    {/* Quick Add from Inventory */}
                    {inventory.length > 0 && (
                      <select
                        onChange={(e) => {
                          const id = e.target.value;
                          if (!id) return;
                          const inv = inventory.find(i => i.id === id);
                          if (inv) {
                            setLineItems(prev => [
                              ...prev,
                              {
                                productName: inv.name,
                                sku: inv.sku,
                                hsnCode: inv.hsnCode || '85159000',
                                quantity: 1,
                                unit: inv.unit || 'PCS',
                                unitPriceUSD: inv.unitPriceUSD || Math.round(inv.unitPriceINR / 87),
                                discountPct: 0
                              }
                            ]);
                          }
                          e.target.value = '';
                        }}
                        defaultValue=""
                        className="text-xs font-mono font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                      >
                        <option value="">+ Single Inventory Item...</option>
                        {inventory.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.currentStock <= 0 ? '🔴 OUT' : inv.currentStock <= inv.minStockAlert ? `🟡 LOW (${inv.currentStock})` : `🟢 (${inv.currentStock})`} {inv.sku} - {inv.name.slice(0, 32)}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="text-xs font-mono font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Empty Row
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-slate-500 block">Product / Part Name</label>
                          {inventory.length > 0 && (
                            <select
                              onChange={e => {
                                const val = e.target.value;
                                if (!val) return;
                                const inv = inventory.find(i => i.id === val);
                                if (inv) {
                                  setLineItems(prev => {
                                    const updated = [...prev];
                                    updated[idx] = {
                                      ...updated[idx],
                                      productName: inv.name,
                                      sku: inv.sku,
                                      hsnCode: inv.hsnCode || '85159000',
                                      unit: inv.unit || 'PCS',
                                      unitPriceUSD: inv.unitPriceUSD || Math.round(inv.unitPriceINR / 87)
                                    };
                                    return updated;
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
                          value={item.productName}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], productName: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                        {/* Live Stock Status Indicator */}
                        {(() => {
                          const matchedInv = inventory.find(inv => 
                            (inv.sku && item.sku && inv.sku.trim().toUpperCase() === item.sku.trim().toUpperCase()) ||
                            (inv.name && item.productName && inv.name.trim().toLowerCase() === item.productName.trim().toLowerCase())
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
                        <label className="text-[10px] font-mono text-slate-500 block">SKU Code</label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], sku: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], hsnCode: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value) || 1;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], quantity: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], unitPriceUSD: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-500 block">Disc %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setLineItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], discountPct: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove row"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Freight / Shipping (₹)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.freightCostUSD}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, freightCostUSD: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Packaging Cost (₹)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.packagingCostUSD}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, packagingCostUSD: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Quote Validity (Days)</label>
                  <input
                    type="number"
                    value={commercialTermsForm.validityDays}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, validityDays: Number(e.target.value) || 30 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1">Delivery Lead Time</label>
                  <input
                    type="text"
                    value={commercialTermsForm.deliveryTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono font-bold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={commercialTermsForm.paymentTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono font-bold text-slate-700 mb-1">Warranty & Certification Terms</label>
                  <input
                    type="text"
                    value={commercialTermsForm.warrantyTerms}
                    onChange={e => setCommercialTermsForm(prev => ({ ...prev, warrantyTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-sans"
                  />
                </div>
              </div>

              {/* Real-Time Cost Summary Preview */}
              <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Taxable Subtotal:</span>
                  <p className="text-base font-bold">₹{Math.round(taxableTotalUSD * 85).toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Total GST ({taxConfig.gstRatePct}%):</span>
                  <p className="text-base font-bold text-blue-400">₹{Math.round(totalTaxUSD * 85).toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase">Grand Total (INR):</span>
                  <p className="text-lg font-black text-emerald-400">₹{grandTotalINR.toLocaleString('en-IN')}</p>
                </div>
              </div>

              </div>

              {/* Submit Buttons (Sticky Bottom Bar) */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateQuoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 shadow-orange-500/20 cursor-pointer flex items-center gap-2 font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generate Official Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MULTI-PRODUCT QUICK PICKER                         */}
      {/* ========================================================= */}
      {isMultiPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          <div className="bg-white text-slate-900 max-w-3xl w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    Multi-Product Quick Picker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select multiple products from warehouse godown inventory & public catalog to add at once
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiPickerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={multiPickerSearch}
                  onChange={e => setMultiPickerSearch(e.target.value)}
                  placeholder="Search by SKU, Product Name, or HSN Code..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white font-sans"
                />
              </div>

              <select
                value={multiPickerCategory}
                onChange={e => setMultiPickerCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium text-slate-700 w-full sm:w-auto"
              >
                <option value="All">All Categories ({selectableCatalog.length})</option>
                {pickerCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const allSelected: Record<string, { selected: boolean; quantity: number }> = {};
                    filteredPickerItems.forEach(item => {
                      allSelected[item.id] = { selected: true, quantity: multiPickerSelected[item.id]?.quantity || 1 };
                    });
                    setMultiPickerSelected(allSelected);
                  }}
                  className="px-2.5 py-1.5 text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setMultiPickerSelected({})}
                  className="px-2.5 py-1.5 text-xs font-mono font-bold text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Scrollable Products List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2 divide-y divide-slate-100">
              {filteredPickerItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-mono text-xs">
                  No products matching your search criteria.
                </div>
              ) : (
                filteredPickerItems.map(item => {
                  const isChecked = multiPickerSelected[item.id]?.selected || false;
                  const qty = multiPickerSelected[item.id]?.quantity || 1;
                  const isLowStock = item.stock <= 10;
                  const isOutOfStock = item.stock <= 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setMultiPickerSelected(prev => ({
                          ...prev,
                          [item.id]: {
                            selected: !isChecked,
                            quantity: prev[item.id]?.quantity || 1
                          }
                        }));
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-orange-50 border border-orange-300/80 shadow-xs' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer pointer-events-none"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              {item.sku}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              HSN: {item.hsnCode}
                            </span>
                            {item.isInternal ? (
                              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                Internal Spares
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                Catalog
                              </span>
                            )}
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isOutOfStock 
                                ? 'bg-red-100 text-red-700' 
                                : isLowStock 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Stock: {item.stock} {item.unit}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 mt-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            ₹{item.unitPriceINR.toLocaleString('en-IN')} / ${item.unitPriceUSD.toFixed(2)} USD per {item.unit}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div 
                        onClick={e => e.stopPropagation()} 
                        className="flex items-center gap-2 shrink-0 ml-3"
                      >
                        <span className="text-[10.5px] font-mono text-slate-500 font-bold">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          value={qty}
                          onChange={e => {
                            const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                            setMultiPickerSelected(prev => ({
                              ...prev,
                              [item.id]: {
                                selected: true, // auto select if changing quantity
                                quantity: val
                              }
                            }));
                          }}
                          className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center font-mono font-bold bg-white"
                        />
                        <span className="text-[11px] font-mono text-slate-500">{item.unit}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
              <span className="text-xs font-mono font-bold text-slate-700">
                {Object.values(multiPickerSelected).filter(v => v.selected).length} products selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMultiPickerOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertMultiProducts}
                  disabled={Object.values(multiPickerSelected).filter(v => v.selected).length === 0}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Selected Products ({Object.values(multiPickerSelected).filter(v => v.selected).length})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
