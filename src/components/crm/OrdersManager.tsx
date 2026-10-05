import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  RefreshCw, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ArrowRight,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Package,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Order } from '../../types';

export const OrdersManager: React.FC = () => {
  const { 
    orders, 
    updateOrderStage, 
    deleteOrder, 
    showNotification, 
    currentEmployee,
    invoices,
    addInvoice,
    setActiveView,
    companySettings
  } = useApp();

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);

  const [dispatchForm, setDispatchForm] = useState({
    courierPartner: 'DHL Express Industrial Freight',
    courierTrackingNo: 'WEL-DHL-9982410',
    dispatchDate: new Date().toISOString().split('T')[0],
  });

  const handleGenerateInvoice = async (ord: Order) => {
    if (isGeneratingInvoice) return;

    // Check if an invoice already exists for this order to prevent duplicate invoices
    const existing = (invoices || []).find(inv => 
      inv && (inv.orderId === ord.id || (inv as any).orderNumber === ord.orderNumber || (inv.quotationRef && inv.quotationRef === ord.orderNumber))
    );
    if (existing) {
      showNotification(`Tax Invoice ${existing.invoiceNumber} is already generated for Order ${ord.orderNumber}! Navigating to Billing...`, 'info');
      setActiveView('crm-invoices');
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      const invNumber = `WEL-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalUSD = ord.totalValueUSD || 15000;
      const taxableUSD = Math.round(totalUSD / 1.18);
      const taxUSD = totalUSD - taxableUSD;

      const newInvoice: any = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNumber,
        orderId: ord.id,
        orderNumber: ord.orderNumber,
        quotationRef: ord.orderNumber,
        poNumber: `PO-${ord.orderNumber.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}`,
        poDate: new Date().toISOString().slice(0, 10),
        companyName: ord.companyName,
        contactPerson: ord.contactName,
        seller: {
          companyName: companySettings?.legalEntityName || companySettings?.legalName || companySettings?.companyName || '',
          address: (() => {
            let addr = '';
            if (companySettings?.factoryPlantAddress) return companySettings.factoryPlantAddress;
            if (typeof companySettings?.registeredOfficeAddress === 'string') return companySettings.registeredOfficeAddress;
            if (companySettings?.registeredOfficeAddress?.addressLine1) {
              const parts = [companySettings.registeredOfficeAddress.addressLine1, companySettings.registeredOfficeAddress.addressLine2, companySettings.registeredOfficeAddress.city, companySettings.registeredOfficeAddress.state].filter(Boolean);
              addr = parts.join(', ');
              if (companySettings.registeredOfficeAddress.pincode) addr += ` - ${companySettings.registeredOfficeAddress.pincode}`;
              return addr;
            }
            return companySettings?.registeredOffice || '';
          })(),
          gstin: companySettings?.gstinNumber || companySettings?.gstin || '',
          pan: companySettings?.panNumber || '',
          state: companySettings?.state || (typeof companySettings?.registeredOfficeAddress === 'object' ? companySettings?.registeredOfficeAddress?.state : '') || '',
          stateCode: companySettings?.stateCode || '',
          email: companySettings?.supportEmail || companySettings?.primaryEmail || '',
          phone: companySettings?.salesPhone || companySettings?.primaryPhone || '',
          bankName: companySettings?.primaryBank?.bankName || companySettings?.bankName || '',
          accountNo: companySettings?.primaryBank?.accountNumber || (companySettings?.primaryBank as any)?.accountNo || companySettings?.bankAccountNumber || '',
          ifscCode: (companySettings?.primaryBank?.ifscCode || companySettings?.ifscCode || '').toUpperCase(),
          branch: companySettings?.primaryBank?.branch || companySettings?.bankBranch || ''
        },
        buyer: {
          companyName: ord.companyName || 'Buyer Company',
          contactName: ord.contactName || 'Procurement Incharge',
          billingAddress: (ord as any).billingAddress || 'Industrial Area, India',
          shippingAddress: (ord as any).shippingAddress || (ord as any).billingAddress || 'Factory Gate, India',
          gstin: (ord as any).gstin || '',
          pan: (ord as any).pan || '',
          state: (ord as any).state || '',
          stateCode: (ord as any).stateCode || '',
          email: (ord as any).email || 'procurement@client.com',
          phone: (ord as any).phone || '+91 98250 99881'
        },
        taxType: 'INTER_STATE',
        gstRatePct: 18,
        agent: {
          hasAgent: false,
          agentName: '',
          agentPhone: '',
          commissionType: 'PERCENT',
          commissionRate: 0,
          commissionAmountUSD: 0
        },
        items: ord.items && ord.items.length > 0 ? ord.items.map((it: any, i: number) => ({
          id: `item-${Date.now()}-${i}`,
          description: it.productName || it.description || `Industrial Component #${i + 1}`,
          sku: it.sku || `WLD-ORD-${i + 1}`,
          hsnCode: it.hsnCode || '8481.80.30',
          quantity: it.quantity || 1,
          unit: it.unit || 'PCS',
          unitPriceUSD: it.unitPriceUSD || taxableUSD,
          discountPct: it.discountPct || 0,
          taxableAmountUSD: it.taxableAmountUSD || taxableUSD,
          cgstAmountUSD: 0,
          sgstAmountUSD: 0,
          igstAmountUSD: taxUSD,
          totalUSD: totalUSD
        })) : [
          {
            id: `item-${Date.now()}`,
            description: `Industrial Precision Components Order ${ord.orderNumber}`,
            sku: 'WLD-ORD-01',
            hsnCode: '8481.80.30',
            quantity: 1,
            unit: 'SET',
            unitPriceUSD: taxableUSD,
            discountPct: 0,
            taxableAmountUSD: taxableUSD,
            cgstAmountUSD: 0,
            sgstAmountUSD: 0,
            igstAmountUSD: taxUSD,
            totalUSD: totalUSD
          }
        ],
        paymentTerms: companySettings?.defaultTerms?.paymentTerms || '30% Advance, 70% against Shipping Documents',
        deliveryTerms: companySettings?.defaultTerms?.deliveryTerms || 'Ex-Factory Weldor Plant / FOB',
        dispatchThrough: 'Industrial Road Logistics',
        destination: 'Client Factory Gate',
        subtotalUSD: taxableUSD,
        totalDiscountUSD: 0,
        taxableTotalUSD: taxableUSD,
        cgstTotalUSD: 0,
        sgstTotalUSD: 0,
        igstTotalUSD: taxUSD,
        totalTaxUSD: taxUSD,
        freightCostUSD: 0,
        packagingCostUSD: 0,
        grandTotalUSD: totalUSD,
        grandTotalINR: Math.round(totalUSD * 85),
        paymentStatus: 'Pending Payment',
        status: 'Pending Payment',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
      };
      await addInvoice(newInvoice);
      showNotification(`Tax Invoice ${invNumber} generated and saved to Billing System!`, 'success');
      setActiveView('crm-invoices');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const orderStages: Order['stage'][] = [
    'Confirmed',
    'In Production',
    'QC Inspection',
    'Ready for Dispatch',
    'Dispatched',
    'Delivered'
  ];

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch || isSubmittingDispatch) return;

    setIsSubmittingDispatch(true);
    try {
      updateOrderStage(selectedOrderForDispatch.id, 'Dispatched', {
        courierPartner: dispatchForm.courierPartner,
        courierTrackingNo: dispatchForm.courierTrackingNo,
        dispatchDate: dispatchForm.dispatchDate,
      });

      setSelectedOrderForDispatch(null);
      showNotification(`Dispatch manifest & tracking recorded for ${selectedOrderForDispatch.orderNumber}`, 'success');
    } finally {
      setIsSubmittingDispatch(false);
    }
  };

  const [filterMode, setFilterMode] = useState<'active' | 'completed' | 'all'>('active');

  // Strictly deduplicate orders by ID, orderNumber, quotationId, and content signature
  const dedupedOrders = React.useMemo(() => {
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const seenQuoteIds = new Set<string>();
    const seenSignatures = new Set<string>();
    const deduped: Order[] = [];

    for (const ord of (orders || [])) {
      if (!ord || !ord.id) continue;
      const num = (ord.orderNumber || '').trim().toUpperCase();
      const qId = (ord.quotationId || '').trim();
      const sig = `${(ord.companyName || '').trim()}_${ord.totalValueUSD}_${(ord.items || []).length}`;

      if (seenIds.has(ord.id)) continue;
      if (num && seenNumbers.has(num)) continue;
      if (qId && seenQuoteIds.has(qId)) continue;
      if (sig && seenSignatures.has(sig)) continue;

      seenIds.add(ord.id);
      if (num) seenNumbers.add(num);
      if (qId) seenQuoteIds.add(qId);
      seenSignatures.add(sig);
      deduped.push(ord);
    }
    return deduped;
  }, [orders]);

  const filteredOrders = React.useMemo(() => {
    return dedupedOrders.filter(ord => {
      if (filterMode === 'active') return ord.stage !== 'Delivered' && (ord.stage as string) !== 'Cancelled';
      if (filterMode === 'completed') return ord.stage === 'Delivered';
      return true;
    });
  }, [dedupedOrders, filterMode]);

  const activeOrdersCount = dedupedOrders.filter(o => o.stage !== 'Delivered' && (o.stage as string) !== 'Cancelled').length;
  const completedOrdersCount = dedupedOrders.filter(o => o.stage === 'Delivered').length;
  const allOrdersCount = dedupedOrders.length;

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
            Full Order & Dispatch Lifecycle
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Order Fulfillment & B2B Dispatch Tracking
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Complete inquiry-to-dispatch process: Production status, ISO quality sign-off, courier tracking, and Tax Invoice PDF generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active vs Delivered Archives Filter */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setFilterMode('active')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'active' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Production ({activeOrdersCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'completed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered Archives ({completedOrdersCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({allOrdersCount})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-800 text-base">
              No {filterMode === 'completed' ? 'delivered / completed' : 'active ongoing'} orders found
            </p>
            <p className="text-xs mt-1">
              {filterMode === 'active' 
                ? 'All confirmed orders have been successfully delivered to customers.' 
                : 'Delivered orders will appear in this archive once customer receipt is confirmed.'}
            </p>
          </div>
        ) : (
          filteredOrders.map(ord => {
          const currentStageIndex = orderStages.indexOf(ord.stage);

          return (
            <div key={ord.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded">
                      {ord.orderNumber}
                    </span>
                    {ord.isRepeatOrder && (
                      <span className="text-[10px] font-mono bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-sky-600" /> REPEAT ORDER
                      </span>
                    )}
                  </div>
                  {(() => {
                    const companyName = ord.companyName || (ord as any).buyer?.companyName || 'Enterprise Client';
                    const contactName = ord.contactName || (ord as any).buyer?.contactName || 'Purchasing Lead';
                    const gstin = (ord as any).gstin || (ord as any).buyer?.gstin;
                    const state = (ord as any).state || (ord as any).buyer?.state;
                    return (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                          {companyName} <span className="text-slate-500 font-normal text-sm">({contactName})</span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px] font-mono mt-0.5">
                          {gstin && <span>GSTIN: <strong className="text-slate-700">{gstin}</strong></span>}
                          {state && <span>State: <strong className="text-slate-700">{state}</strong></span>}
                          {(ord as any).quotationNumber && (
                            <span className="text-orange-700 font-bold">Ref Quote: {(ord as any).quotationNumber}</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    Stage: {ord.stage}
                  </span>

                  <button
                    onClick={() => setSelectedOrderForInvoice(ord)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-slate-800 border-slate-300 bg-white hover:bg-slate-50 shadow-xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span className="font-bold">View PDF</span>
                  </button>

                  {(() => {
                    const linkedInvoice = (invoices || []).find((inv: any) => 
                      inv && (inv.orderId === ord.id || (inv as any).orderNumber === ord.orderNumber || (inv.quotationRef && inv.quotationRef === ord.orderNumber))
                    );
                    if (linkedInvoice) {
                      return (
                        <button
                          onClick={() => setActiveView('crm-invoices')}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          title={`Tax Invoice ${linkedInvoice.invoiceNumber} already created`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Invoice: {linkedInvoice.invoiceNumber} →</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleGenerateInvoice(ord)}
                        disabled={isGeneratingInvoice}
                        className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="font-bold">Generate Tax Invoice →</span>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* 7-Step Order Lifecycle Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                  <span>Inquiry & RFQ</span>
                  <span>Quotation</span>
                  <span>Production</span>
                  <span>QC Inspection</span>
                  <span>Dispatched</span>
                  <span>Delivered</span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {orderStages.map((stg, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <button 
                        key={stg} 
                        onClick={() => updateOrderStage(ord.id, stg)}
                        title={`Click to set stage to ${stg}`}
                        className="space-y-1 text-left group cursor-pointer"
                      >
                        <div className={`h-2 rounded-full transition-all ${
                          isDone 
                            ? 'bg-orange-600 shadow-xs' 
                            : 'bg-slate-200 group-hover:bg-orange-300'
                        }`} />
                        <p className={`text-[10px] font-mono text-center truncate ${
                          isCurrent ? 'font-bold text-orange-700' : isDone ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-700'
                        }`}>
                          {stg}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Itemized Products & Financial Breakdown (matching Commercial Quotation) */}
              {(() => {
                const items = ord.items || (ord as any).lineItems || [];
                const grandTotalINR = (ord as any).grandTotalINR || Math.round((ord.totalValueUSD || 0) * 85);
                const taxableINR = (ord as any).taxableTotalUSD 
                  ? Math.round((ord as any).taxableTotalUSD * 85) 
                  : Math.round(grandTotalINR / 1.18);
                const taxINR = (ord as any).totalTaxUSD 
                  ? Math.round((ord as any).totalTaxUSD * 85) 
                  : Math.max(0, grandTotalINR - taxableINR);
                const freightINR = Math.round(((ord as any).freightCostUSD || 0) * 85);
                const packagingINR = Math.round(((ord as any).packagingCostUSD || 0) * 85);

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-bold">Itemized Products</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {items.length} Product Line {items.length === 1 ? 'Item' : 'Items'}
                        </p>
                        <p className="text-slate-600 text-[11px] truncate mt-0.5" title={items.map((it: any) => `${it.productName} (${it.quantity} ${it.unit || 'PCS'})`).join(', ')}>
                          {items.length > 0 
                            ? items.map((it: any) => `${it.productName} (${it.quantity} ${it.unit || 'PCS'})`).join(', ')
                            : 'Standard Industrial Consumables & Custom OEM Components'}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-bold">Tax & Cost Breakdown</span>
                        <p className="text-slate-700 mt-0.5">
                          Taxable: <strong className="text-slate-900">₹{taxableINR.toLocaleString('en-IN')}</strong> | Tax: <strong className="text-emerald-700">₹{taxINR.toLocaleString('en-IN')}</strong>
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          Freight: ₹{freightINR.toLocaleString('en-IN')} | Packaging: ₹{packagingINR.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-bold">Destination & Delivery</span>
                        <p className="text-slate-800 font-bold mt-0.5 truncate" title={(ord as any).shippingAddress || 'Client Factory Gate'}>
                          {(ord as any).shippingAddress || 'Client Factory Gate, India'}
                        </p>
                        <p className="text-amber-800 font-bold text-[11px] mt-0.5">
                          Expected: {ord.expectedDeliveryDate || 'TBD'}
                        </p>
                      </div>
                    </div>

                    {/* Logistics & Value Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-orange-50/40 p-4 rounded-xl border border-orange-100">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">TOTAL ORDER VALUE (INCL. GST)</span>
                        <span className="text-orange-600 font-black text-xl">
                          ₹{grandTotalINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">EXPECTED DELIVERY DATE</span>
                        <span className="text-amber-800 font-bold text-sm">{ord.expectedDeliveryDate || 'TBD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase">COURIER & DISPATCH MANIFEST</span>
                        <span className="text-slate-900 font-bold text-xs">
                          {(ord as any).courierPartner || 'Pending Carrier Assignment'}
                        </span>
                        {(ord as any).courierTrackingNo && (
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            Track: {(ord as any).courierTrackingNo}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Order Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Order Placed: {new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ord.stage !== 'Dispatched' && ord.stage !== 'Delivered' && (
                    <button
                      onClick={() => {
                        setSelectedOrderForDispatch(ord);
                        setDispatchForm({
                          courierPartner: 'DHL Express Industrial Freight',
                          courierTrackingNo: `WEL-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
                          dispatchDate: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="btn-primary text-xs py-2 px-3.5 shadow-md flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Record Dispatch & Tracking
                    </button>
                  )}

                  {ord.stage !== 'Delivered' && (
                    <button
                      onClick={() => updateOrderStage(ord.id, 'Delivered')}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-mono font-bold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  {confirmDeleteOrderId === ord.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-rose-900 px-1 font-mono">Delete Order?</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteOrder(ord.id);
                          setConfirmDeleteOrderId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs cursor-pointer shadow-xs transition-colors"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteOrderId(null)}
                        className="px-2 py-1 rounded-lg bg-white text-slate-700 hover:bg-slate-100 font-mono text-xs cursor-pointer border border-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteOrderId(ord.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-mono font-bold transition-colors cursor-pointer"
                    >
                      Cancel / Delete Order
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        }))}
      </div>

      {/* Record Dispatch Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base font-heading">Record Dispatch & Courier</h3>
              </div>
              <button 
                onClick={() => setSelectedOrderForDispatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Order Reference</label>
                <input 
                  type="text" 
                  disabled
                  value={`${selectedOrderForDispatch.orderNumber} — ${selectedOrderForDispatch.companyName}`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Courier / Freight Partner *</label>
                <input 
                  type="text" 
                  required
                  value={dispatchForm.courierPartner}
                  onChange={e => setDispatchForm({ ...dispatchForm, courierPartner: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Airway Bill / Tracking Number *</label>
                <input 
                  type="text" 
                  required
                  value={dispatchForm.courierTrackingNo}
                  onChange={e => setDispatchForm({ ...dispatchForm, courierTrackingNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispatch Date</label>
                <input 
                  type="date" 
                  value={dispatchForm.dispatchDate}
                  onChange={e => setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-orange-500 outline-none bg-slate-50"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary px-6 py-2.5 shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Invoice & Dispatch Manifest PDF Viewer Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Top Controls */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base font-heading">
                  Official B2B Tax Invoice & Dispatch Manifest
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>

                <button 
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Document Body */}
            <div className="p-8 space-y-6 overflow-y-auto bg-white text-slate-900 font-sans">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <img 
                      src="/weldor-logo.png" 
                      alt="Weldor Logo" 
                      className="h-9 w-auto object-contain" 
                    />
                    <div>
                      <span className="font-extrabold text-lg tracking-tight text-slate-900 font-heading block">EARTH METAL INDUSTRIES</span>
                      <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">Brand: WELDOR</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono mt-1 font-medium">588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</p>
                  <p className="text-[11px] text-slate-600 font-mono font-medium">GSTIN: 24AABCE1234F1Z5 • brm@weldorindustries.com • +91-87800 98088</p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold font-heading text-orange-700 block">TAX INVOICE</span>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">Invoice No: WEL-INV-2026-9912</p>
                  <p className="text-xs font-mono text-slate-600">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-xs font-mono text-slate-600">Order Ref: {selectedOrderForInvoice.orderNumber}</p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-8 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Billed To (Customer):</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedOrderForInvoice.companyName || (selectedOrderForInvoice as any).buyer?.companyName || 'Enterprise Client'}
                  </p>
                  <p className="text-slate-700">
                    Attn: {selectedOrderForInvoice.contactName || (selectedOrderForInvoice as any).buyer?.contactName || 'Purchasing Lead'}
                  </p>
                  {((selectedOrderForInvoice as any).gstin || (selectedOrderForInvoice as any).buyer?.gstin) && (
                    <p className="text-slate-600">GSTIN: {(selectedOrderForInvoice as any).gstin || (selectedOrderForInvoice as any).buyer?.gstin}</p>
                  )}
                  {((selectedOrderForInvoice as any).state || (selectedOrderForInvoice as any).buyer?.state) && (
                    <p className="text-slate-600">State: {(selectedOrderForInvoice as any).state || (selectedOrderForInvoice as any).buyer?.state}</p>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Shipping & Dispatch Manifest:</span>
                  <p className="font-bold text-slate-900">
                    Destination: {(selectedOrderForInvoice as any).shippingAddress || (selectedOrderForInvoice as any).buyer?.shippingAddress || 'Client Factory Gate'}
                  </p>
                  <p className="text-slate-700">Carrier: {(selectedOrderForInvoice as any).courierPartner || 'Industrial Road Logistics'}</p>
                  <p className="text-slate-600">Tracking: {(selectedOrderForInvoice as any).courierTrackingNo || 'Pending Assignment'}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-mono text-slate-900 uppercase">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Item & Description</th>
                    <th className="p-3 border-b border-slate-200">HSN Code</th>
                    <th className="p-3 border-b border-slate-200 text-right">Qty</th>
                    <th className="p-3 border-b border-slate-200 text-right">Unit Price (₹)</th>
                    <th className="p-3 border-b border-slate-200 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                  {(selectedOrderForInvoice.items || (selectedOrderForInvoice as any).lineItems || []).map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <p className="text-[10px] text-slate-500">SKU: {item.sku}</p>
                      </td>
                      <td className="p-3 text-slate-600">8412.21.00</td>
                      <td className="p-3 text-right font-bold">{item.quantity} PCS</td>
                      <td className="p-3 text-right">₹{Math.round((item.unitPriceUSD || item.unitPrice || 0) * 85).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{Math.round((item.totalPriceUSD || (item.quantity * (item.unitPriceUSD || item.unitPrice || 0)) || 0) * 85).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation Summary */}
              {(() => {
                const grandTotal = (selectedOrderForInvoice as any).grandTotalINR || Math.round((selectedOrderForInvoice.totalValueUSD || 0) * 85);
                const taxableVal = (selectedOrderForInvoice as any).taxableTotalUSD 
                  ? Math.round((selectedOrderForInvoice as any).taxableTotalUSD * 85) 
                  : Math.round(grandTotal / 1.18);
                const taxVal = (selectedOrderForInvoice as any).totalTaxUSD 
                  ? Math.round((selectedOrderForInvoice as any).totalTaxUSD * 85) 
                  : Math.max(0, grandTotal - taxableVal);
                const freightVal = Math.round(((selectedOrderForInvoice as any).freightCostUSD || 0) * 85);

                return (
                  <div className="flex justify-end pt-2">
                    <div className="w-80 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Taxable Subtotal:</span>
                        <span className="font-bold">₹{taxableVal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST Tax Total:</span>
                        <span className="font-bold">₹{taxVal.toLocaleString('en-IN')}</span>
                      </div>
                      {freightVal > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Freight & Packaging:</span>
                          <span className="font-bold">₹{freightVal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 text-sm font-extrabold border-t-2 border-slate-900 pt-2">
                        <span>Grand Total (Incl. GST):</span>
                        <span className="text-orange-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Signatures & Seal Stamp */}
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 font-bold block">100% Quality Assurance Stamp:</span>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ISO 9001:2015 & Pressure Passed</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span className="text-slate-600 font-bold">Authorized Signatory</span>
                  <p className="text-[10px] text-slate-400">Weldor Accounts & Dispatch</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
