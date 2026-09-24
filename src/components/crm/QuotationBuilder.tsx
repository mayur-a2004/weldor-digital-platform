import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { Quotation } from '../../types';

export const QuotationBuilder: React.FC = () => {
  const { 
    quotations, 
    createQuotationFromLead,
    approveQuotation, 
    rejectQuotation, 
    deleteQuotation, 
    convertQuotationToOrder, 
    setActiveView, 
    showNotification, 
    currentRole 
  } = useApp();
  
  const [activePDFQuotation, setActivePDFQuotation] = useState<Quotation | null>(null);
  const [filterMode, setFilterMode] = useState<'active' | 'converted' | 'rejected' | 'all'>('active');
  const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);

  // New Custom Quote Form State
  const [newQuoteForm, setNewQuoteForm] = useState<{
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    gstin: string;
    validityDays: number;
    paymentTerms: string;
    deliveryTerms: string;
    freightCostUSD: number;
    items: Array<{
      productName: string;
      sku: string;
      hsnCode: string;
      quantity: number;
      unitPriceUSD: number;
      discountPct: number;
    }>;
  }>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    gstin: '',
    validityDays: 30,
    paymentTerms: '50% Advance, Balance against PI Dispatch',
    deliveryTerms: 'Ex-Works Jamnagar (7-10 Business Days)',
    freightCostUSD: 150,
    items: [
      {
        productName: 'ISO 15552 Heavy-Duty Pneumatic Cylinder',
        sku: 'WEL-PNC-63-200',
        hsnCode: '84123100',
        quantity: 20,
        unitPriceUSD: 85,
        discountPct: 5
      }
    ]
  });

  const handleAddItemRow = () => {
    setNewQuoteForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productName: '700 Bar Solenoid Directional Valve',
          sku: 'WEL-HYV-700B',
          hsnCode: '84812000',
          quantity: 5,
          unitPriceUSD: 290,
          discountPct: 0
        }
      ]
    }));
  };

  const handleRemoveItemRow = (idx: number) => {
    setNewQuoteForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleCreateCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteForm.companyName || newQuoteForm.items.length === 0) {
      showNotification('Company Name and at least 1 line item are required!', 'warning');
      return;
    }

    const calculatedItems = newQuoteForm.items.map(item => {
      const lineTotal = item.quantity * item.unitPriceUSD * (1 - (item.discountPct || 0) / 100);
      return {
        ...item,
        totalPriceUSD: lineTotal
      };
    });

    const subtotalUSD = calculatedItems.reduce((sum, item) => sum + item.totalPriceUSD, 0);
    const taxTotalUSD = subtotalUSD * 0.18; // 18% GST standard
    const grandTotalUSD = subtotalUSD + taxTotalUSD + (Number(newQuoteForm.freightCostUSD) || 0);

    const quotationItems = calculatedItems.map((item, idx) => ({
      id: `q-item-${Date.now()}-${idx}`,
      productId: `prod-manual-${idx}`,
      productName: item.productName,
      sku: item.sku || `SKU-${idx + 1}`,
      quantity: item.quantity,
      unitPriceUSD: item.unitPriceUSD,
      discountPercentage: item.discountPct || 0,
      taxPercentage: 18,
      totalPriceUSD: item.totalPriceUSD
    }));

    const createdQuote = createQuotationFromLead(
      `lead-manual-${Date.now()}`,
      quotationItems,
      Number(newQuoteForm.freightCostUSD) || 0,
      Number(newQuoteForm.validityDays) || 30
    );

    // Update with company info from form
    if (createdQuote) {
      createdQuote.companyName = newQuoteForm.companyName;
      if (newQuoteForm.contactName) createdQuote.contactName = newQuoteForm.contactName;
      if (newQuoteForm.email) createdQuote.email = newQuoteForm.email;
      if (newQuoteForm.paymentTerms) createdQuote.paymentTerms = newQuoteForm.paymentTerms;
      if (newQuoteForm.deliveryTerms) createdQuote.deliveryTerms = newQuoteForm.deliveryTerms;
      setActivePDFQuotation(createdQuote);
    }

    showNotification(`Commercial Quotation generated successfully!`, 'success');
    setIsCreateQuoteModalOpen(false);
  };

  const filteredQuotations = quotations.filter(q => {
    if (filterMode === 'active') return q.status !== 'Rejected' && (q.status as string) !== 'Converted to Order';
    if (filterMode === 'converted') return (q.status as string) === 'Converted to Order';
    if (filterMode === 'rejected') return q.status === 'Rejected';
    return true;
  });

  const activeCount = quotations.filter(q => q.status !== 'Rejected' && (q.status as string) !== 'Converted to Order').length;
  const rejectedCount = quotations.filter(q => q.status === 'Rejected').length;

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
            Commercial Workspace
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Formal B2B Commercial Quotations & Proposals
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Build itemized quotations, calculate 18% GST / export duties, apply volume discounts, and route for CEO approval.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setFilterMode('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'active' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Quotes ({activeCount})
            </button>
            <button
              onClick={() => setFilterMode('rejected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'rejected' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected / Revision ({rejectedCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({quotations.length})
            </button>
          </div>

          <button
            onClick={() => setIsCreateQuoteModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-orange-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Quotation</span>
          </button>
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-6">
        {filteredQuotations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-800 text-base">
              No {filterMode === 'rejected' ? 'rejected / revised' : 'active'} quotations found
            </p>
            <p className="text-xs mt-1">
              Generate new commercial quotations from Inbound RFQs or the Sales Pipeline.
            </p>
          </div>
        ) : (
          filteredQuotations.map(quote => (
          <div key={quote.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Quote Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded">
                    {quote.quotationNumber}
                  </span>
                  <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded font-bold ${
                    quote.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    quote.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                    quote.status === 'Pending Manager Approval' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}>
                    {quote.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                  {quote.companyName} <span className="text-slate-500 font-normal text-sm">({quote.contactName} - {quote.email})</span>
                </h3>
              </div>

              <div className="text-right font-mono text-xs text-slate-500">
                <span>Created: {new Date(quote.createdAt).toLocaleDateString()}</span>
                <span className="block text-slate-700 font-bold">Validity: {quote.validityDays} Days</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-mono text-slate-700">
                  <tr>
                    <th className="p-3 font-bold">PRODUCT / DESCRIPTION</th>
                    <th className="p-3 text-right font-bold">QUANTITY</th>
                    <th className="p-3 text-right font-bold">UNIT PRICE</th>
                    <th className="p-3 text-right font-bold">DISCOUNT</th>
                    <th className="p-3 text-right font-bold">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(quote.items || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-slate-900 font-bold">{item.productName} ({item.sku})</td>
                      <td className="p-3 text-right font-mono text-slate-700">{item.quantity} PCS</td>
                      <td className="p-3 text-right font-mono text-slate-700">${item.unitPriceUSD || 0}</td>
                      <td className="p-3 text-right font-mono text-orange-700 font-bold">{item.discountPercentage || 0}%</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">${(item.totalPriceUSD || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block font-semibold">SUBTOTAL</span>
                <span className="text-slate-900 font-bold">${(quote.subtotalUSD || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">TAX & GST (18%)</span>
                <span className="text-slate-900 font-bold">${(quote.taxTotalUSD || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">FREIGHT COST</span>
                <span className="text-slate-900 font-bold">${(quote.freightCostUSD || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">GRAND TOTAL</span>
                <span className="text-orange-700 font-extrabold text-sm">${(quote.grandTotalUSD || (quote as any).totalAmountUSD || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 font-mono">
                Payment Terms: <strong className="text-slate-800">{quote.paymentTerms || 'Standard'}</strong> | Delivery: <strong className="text-slate-800">{quote.deliveryTerms || 'Ex-Factory'}</strong>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActivePDFQuotation(quote)}
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  <Printer className="w-3.5 h-3.5 text-orange-600" /> Preview Printable PDF
                </button>

                {quote.status === 'Pending Manager Approval' && (
                  <>
                    <button
                      onClick={() => approveQuotation(quote.id)}
                      className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Release
                    </button>

                    <button
                      onClick={() => {
                        const reason = window.prompt('Enter rejection / revision reason:');
                        if (reason !== null) {
                          rejectQuotation(quote.id, reason || 'Margin requires revision');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-300 font-mono font-bold text-xs transition-colors"
                    >
                      Reject / Needs Revision
                    </button>
                  </>
                )}

                {(quote.status === 'Sent to Customer' || quote.status === 'Approved') && (
                  <button
                    onClick={() => {
                      convertQuotationToOrder(quote.id);
                      showNotification(`Quotation ${quote.quotationNumber} successfully converted to Confirmed Production Order!`, 'success');
                      setActiveView('crm-orders');
                    }}
                    className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <span>Convert Accepted Quote to Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete quotation ${quote.quotationNumber}?`)) {
                      deleteQuotation(quote.id);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-mono font-bold text-xs transition-colors"
                >
                  Delete Quote
                </button>
              </div>
            </div>

          </div>
        )))}
      </div>

      {/* Printable B2B Quotation PDF Modal */}
      {activePDFQuotation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-3xl w-full p-6 sm:p-10 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 font-sans my-8">
            
            <button 
              onClick={() => setActivePDFQuotation(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 print:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div className="flex items-start gap-4">
                <img 
                  src="/weldor-logo.png" 
                  alt="Weldor Logo" 
                  className="h-10 w-auto object-contain" 
                />
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 font-heading">EARTH METAL INDUSTRIES</h2>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</p>
                  <p className="text-xs text-slate-600 font-mono">brm@weldorindustries.com | +91-87800 98088 | ISO 9001:2015</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded-md text-xs font-mono font-bold">
                  COMMERCIAL QUOTATION
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 mt-1">{activePDFQuotation.quotationNumber}</p>
                <p className="text-xs text-slate-500 font-mono">Date: {new Date(activePDFQuotation.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
              <div>
                <span className="text-slate-500 block uppercase font-bold">PREPARED FOR:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activePDFQuotation.companyName}</p>
                <p className="text-slate-700">Attn: {activePDFQuotation.contactName}</p>
                <p className="text-slate-700">{activePDFQuotation.email}</p>
              </div>

              <div>
                <span className="text-slate-500 block uppercase font-bold">COMMERCIAL TERMS:</span>
                <p className="mt-0.5">Payment: <strong className="text-slate-900">{activePDFQuotation.paymentTerms}</strong></p>
                <p>Delivery: <strong className="text-slate-900">{activePDFQuotation.deliveryTerms}</strong></p>
                <p>Validity: <strong className="text-slate-900">{activePDFQuotation.validityDays} Days</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 font-mono text-slate-700">
                  <th className="p-2.5 border border-slate-200 font-bold">Item & Description</th>
                  <th className="p-2.5 border border-slate-200 text-right font-bold">Qty</th>
                  <th className="p-2.5 border border-slate-200 text-right font-bold">Unit Price</th>
                  <th className="p-2.5 border border-slate-200 text-right font-bold">Total (USD)</th>
                </tr>
              </thead>
              <tbody>
                {(activePDFQuotation.items || []).map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 border border-slate-200 font-bold text-slate-900">{item.productName} ({item.sku})</td>
                    <td className="p-2.5 border border-slate-200 text-right font-mono text-slate-700">{item.quantity}</td>
                    <td className="p-2.5 border border-slate-200 text-right font-mono text-slate-700">${item.unitPriceUSD || 0}</td>
                    <td className="p-2.5 border border-slate-200 text-right font-mono font-bold text-slate-900">${(item.totalPriceUSD || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-xs font-mono text-slate-700 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-900">${(activePDFQuotation.subtotalUSD || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax / GST (18%):</span>
                  <span className="text-slate-900">${(activePDFQuotation.taxTotalUSD || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight Cost:</span>
                  <span className="text-slate-900">${(activePDFQuotation.freightCostUSD || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-sm text-orange-700">
                  <span>Grand Total:</span>
                  <span>${(activePDFQuotation.grandTotalUSD || (activePDFQuotation as any).totalAmountUSD || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs font-mono text-slate-600 print:pt-16">
              <div>
                <p className="border-t border-slate-300 pt-1 w-48 text-center font-bold text-slate-800">Authorized Signatory</p>
                <p className="text-center text-[10px] text-slate-500">Weldor Global Sales Division</p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create Custom Quotation Modal */}
      {isCreateQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-3xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
                  Commercial Billing Engine
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Generate Formal B2B Quotation</h2>
              </div>
              <button 
                onClick={() => setIsCreateQuoteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomQuote} className="space-y-5">
              {/* Buyer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Company / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Automation LLC"
                    value={newQuoteForm.companyName}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma (Head of Procurement)"
                    value={newQuoteForm.contactName}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    placeholder="procurement@apex-auto.com"
                    value={newQuoteForm.email}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Direct Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newQuoteForm.phone}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 font-sans"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                    Itemized Product Bill ({newQuoteForm.items.length} items)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2.5">
                  {newQuoteForm.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-mono text-slate-500 block">Product / Part Name</label>
                        <input
                          type="text"
                          required
                          value={item.productName}
                          onChange={e => {
                            const val = e.target.value;
                            setNewQuoteForm(prev => {
                              const updated = [...prev.items];
                              updated[idx] = { ...updated[idx], productName: val };
                              return { ...prev, items: updated };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">SKU Code</label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={e => {
                            const val = e.target.value;
                            setNewQuoteForm(prev => {
                              const updated = [...prev.items];
                              updated[idx] = { ...updated[idx], sku: val };
                              return { ...prev, items: updated };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">Qty (PCS)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value) || 1;
                            setNewQuoteForm(prev => {
                              const updated = [...prev.items];
                              updated[idx] = { ...updated[idx], quantity: val };
                              return { ...prev, items: updated };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono text-slate-500 block">Unit Price ($)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setNewQuoteForm(prev => {
                              const updated = [...prev.items];
                              updated[idx] = { ...updated[idx], unitPriceUSD: val };
                              return { ...prev, items: updated };
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
                            setNewQuoteForm(prev => {
                              const updated = [...prev.items];
                              updated[idx] = { ...updated[idx], discountPct: val };
                              return { ...prev, items: updated };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {newQuoteForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
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

              {/* Commercial Terms & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">Freight / Shipping ($)</label>
                  <input
                    type="number"
                    value={newQuoteForm.freightCostUSD}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, freightCostUSD: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">Quote Validity (Days)</label>
                  <input
                    type="number"
                    value={newQuoteForm.validityDays}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, validityDays: Number(e.target.value) || 30 }))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">GST Tax Rate</label>
                  <input
                    type="text"
                    disabled
                    value="18% Standard GST Included"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={newQuoteForm.paymentTerms}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">Delivery Lead Time</label>
                  <input
                    type="text"
                    value={newQuoteForm.deliveryTerms}
                    onChange={e => setNewQuoteForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateQuoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 shadow-orange-500/20"
                >
                  Generate Official Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
