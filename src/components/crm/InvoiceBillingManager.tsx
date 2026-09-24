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
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationRef?: string;
  customerName: string;
  customerGstin: string;
  customerAddress: string;
  contactEmail: string;
  contactPhone: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  items: Array<{
    description: string;
    hsnCode: string;
    quantity: number;
    unitPriceUSD: number;
    discountPct: number;
    totalUSD: number;
  }>;
  subtotalUSD: number;
  gstTaxUSD: number;
  freightUSD: number;
  grandTotalUSD: number;
  status: 'Paid' | 'Pending Payment' | 'Dispatched' | 'Draft';
}

export const InvoiceBillingManager: React.FC = () => {
  const { quotations, showNotification } = useApp();

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-1001',
      invoiceNumber: 'WEL-INV-2026-8821',
      quotationRef: 'WEL-QT-2026-4412',
      customerName: 'Larsen Heavy Machinery Pvt Ltd',
      customerGstin: '24AAACL1234F1Z8',
      customerAddress: 'Plot 44, GIDC Industrial Estate, Dared, Jamnagar, Gujarat',
      contactEmail: 'accounts@larsen-heavy.com',
      contactPhone: '+91-98250 11234',
      issueDate: '2026-09-20',
      dueDate: '2026-10-20',
      paymentTerms: '50% Advance, 50% against Dispatch Bill',
      items: [
        {
          description: 'ISO 15552 Heavy-Duty Pneumatic Cylinder (Ø100mm, 300mm Stroke)',
          hsnCode: '84123100',
          quantity: 40,
          unitPriceUSD: 110,
          discountPct: 5,
          totalUSD: 4180
        },
        {
          description: '700 Bar High-Pressure CETOP 3 Solenoid Valve',
          hsnCode: '84812000',
          quantity: 10,
          unitPriceUSD: 290,
          discountPct: 0,
          totalUSD: 2900
        }
      ],
      subtotalUSD: 7080,
      gstTaxUSD: 1274.4,
      freightUSD: 250,
      grandTotalUSD: 8604.4,
      status: 'Paid'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [newInvoiceForm, setNewInvoiceForm] = useState<{
    customerName: string;
    customerGstin: string;
    customerAddress: string;
    contactEmail: string;
    contactPhone: string;
    paymentTerms: string;
    freightUSD: number;
    items: Array<{
      description: string;
      hsnCode: string;
      quantity: number;
      unitPriceUSD: number;
      discountPct: number;
    }>;
  }>({
    customerName: '',
    customerGstin: '24AAACE1234P1ZV',
    customerAddress: 'GIDC Industrial Zone, Jamnagar, Gujarat',
    contactEmail: '',
    contactPhone: '',
    paymentTerms: '100% against Proforma Invoice',
    freightUSD: 150,
    items: [
      {
        description: 'ISO 15552 Pneumatic Actuator Cylinder',
        hsnCode: '84123100',
        quantity: 20,
        unitPriceUSD: 95,
        discountPct: 0
      }
    ]
  });

  const handleAddItem = () => {
    setNewInvoiceForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: 'Precision Hydraulic Control Valve CETOP 3',
          hsnCode: '84812000',
          quantity: 5,
          unitPriceUSD: 280,
          discountPct: 0
        }
      ]
    }));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.customerName) {
      showNotification('Customer Name is required!', 'warning');
      return;
    }

    const calculatedItems = newInvoiceForm.items.map(item => {
      const lineTotal = item.quantity * item.unitPriceUSD * (1 - (item.discountPct || 0) / 100);
      return {
        ...item,
        totalUSD: lineTotal
      };
    });

    const subtotalUSD = calculatedItems.reduce((s, i) => s + i.totalUSD, 0);
    const gstTaxUSD = subtotalUSD * 0.18;
    const grandTotalUSD = subtotalUSD + gstTaxUSD + Number(newInvoiceForm.freightUSD);

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `WEL-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newInvoiceForm.customerName,
      customerGstin: newInvoiceForm.customerGstin,
      customerAddress: newInvoiceForm.customerAddress,
      contactEmail: newInvoiceForm.contactEmail || 'accounts@client.com',
      contactPhone: newInvoiceForm.contactPhone || '+91-XXXXXXXXXX',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      paymentTerms: newInvoiceForm.paymentTerms,
      items: calculatedItems,
      subtotalUSD,
      gstTaxUSD,
      freightUSD: Number(newInvoiceForm.freightUSD) || 0,
      grandTotalUSD,
      status: 'Pending Payment'
    };

    setInvoices(prev => [newInv, ...prev]);
    setIsCreateModalOpen(false);
    showNotification(`Invoice ${newInv.invoiceNumber} generated successfully!`, 'success');
    setActivePrintInvoice(newInv);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" /> B2B Commercial Billing & Tax Invoices
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              GST 18% Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading mt-2">
            Proforma Invoices, GST Tax Billing & Dispatch Management
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Generate itemized tax invoices with HSN codes, calculate 18% IGST/CGST, apply freight and volume discounts, and print branded PDF invoices for clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-orange-500/20 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Commercial Tax Invoices Ledger ({filteredInvoices.length} records)
            </h3>
            <p className="text-xs text-slate-500">Official billing and proforma accounts register</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-64 focus:outline-hidden focus:border-orange-500"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 font-mono text-slate-700">
              <tr>
                <th className="p-3">INVOICE NUMBER</th>
                <th className="p-3">CUSTOMER / CLIENT</th>
                <th className="p-3">ISSUE DATE</th>
                <th className="p-3 text-right">SUBTOTAL</th>
                <th className="p-3 text-right">GST (18%)</th>
                <th className="p-3 text-right">GRAND TOTAL</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-orange-700">{inv.invoiceNumber}</td>
                  <td className="p-3">
                    <strong className="text-slate-900">{inv.customerName}</strong>
                    <p className="text-slate-500 text-[11px] font-mono">GSTIN: {inv.customerGstin}</p>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{inv.issueDate}</td>
                  <td className="p-3 text-right font-mono font-bold">${inv.subtotalUSD.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-slate-600">${inv.gstTaxUSD.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-extrabold text-slate-900">${inv.grandTotalUSD.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActivePrintInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-orange-600" />
                      <span>Print PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-3xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
                  GST Billing Engine
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Generate Commercial Tax Invoice</h2>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.customerName}
                    onChange={e => setNewInvoiceForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="e.g. Apex Industrial Machinery"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Customer GSTIN</label>
                  <input
                    type="text"
                    value={newInvoiceForm.customerGstin}
                    onChange={e => setNewInvoiceForm(prev => ({ ...prev, customerGstin: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Billing Email</label>
                  <input
                    type="email"
                    value={newInvoiceForm.contactEmail}
                    onChange={e => setNewInvoiceForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="accounts@apex.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newInvoiceForm.contactPhone}
                    onChange={e => setNewInvoiceForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+91-98765 43210"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase">Itemized Products Bill</h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2">
                  {newInvoiceForm.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="sm:col-span-5">
                        <label className="text-[10px] text-slate-500 font-mono block">Description</label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => {
                            const val = e.target.value;
                            setNewInvoiceForm(prev => {
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], description: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => {
                            const val = e.target.value;
                            setNewInvoiceForm(prev => {
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], hsnCode: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-mono"
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
                            setNewInvoiceForm(prev => {
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], quantity: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block">Price ($)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceUSD}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setNewInvoiceForm(prev => {
                              const copy = [...prev.items];
                              copy[idx] = { ...copy[idx], unitPriceUSD: val };
                              return { ...prev, items: copy };
                            });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-3">
                        {newInvoiceForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewInvoiceForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
                  className="btn-primary text-xs py-2 px-5"
                >
                  Create & Print Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable PDF Modal */}
      {activePrintInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-3xl w-full p-8 rounded-2xl shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <button 
              onClick={() => setActivePrintInvoice(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-heading">EARTH METAL INDUSTRIES</h2>
                <p className="text-xs text-slate-600 font-mono mt-0.5">588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India</p>
                <p className="text-xs text-slate-600 font-mono">GSTIN: 24AAACE1234P1ZV | +91-87800 98088</p>
              </div>

              <div className="text-right">
                <span className="inline-block bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded text-xs font-mono font-bold">
                  TAX INVOICE
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 mt-1">{activePrintInvoice.invoiceNumber}</p>
                <p className="text-xs text-slate-500 font-mono">Date: {activePrintInvoice.issueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl font-mono">
              <div>
                <span className="text-slate-500 block uppercase font-bold">BILLED TO:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activePrintInvoice.customerName}</p>
                <p className="text-slate-700">GSTIN: {activePrintInvoice.customerGstin}</p>
                <p className="text-slate-600">{activePrintInvoice.customerAddress}</p>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold">PAYMENT & BANKING:</span>
                <p>Bank: <strong>HDFC Bank Ltd, Jamnagar Branch</strong></p>
                <p>A/C No: <strong>50200098765432</strong> | IFSC: <strong>HDFC0001234</strong></p>
                <p>Terms: <strong>{activePrintInvoice.paymentTerms}</strong></p>
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead className="bg-slate-100 font-mono text-slate-700">
                <tr>
                  <th className="p-2 border border-slate-200">Description</th>
                  <th className="p-2 border border-slate-200">HSN</th>
                  <th className="p-2 border border-slate-200 text-right">Qty</th>
                  <th className="p-2 border border-slate-200 text-right">Rate</th>
                  <th className="p-2 border border-slate-200 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {activePrintInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-slate-200 font-bold">{item.description}</td>
                    <td className="p-2 border border-slate-200 font-mono">{item.hsnCode}</td>
                    <td className="p-2 border border-slate-200 text-right font-mono">{item.quantity}</td>
                    <td className="p-2 border border-slate-200 text-right font-mono">${item.unitPriceUSD}</td>
                    <td className="p-2 border border-slate-200 text-right font-mono font-bold">${item.totalUSD.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-xs font-mono text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">${activePrintInvoice.subtotalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>${activePrintInvoice.gstTaxUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight:</span>
                  <span>${activePrintInvoice.freightUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-sm text-orange-700">
                  <span>Grand Total:</span>
                  <span>${activePrintInvoice.grandTotalUSD.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between items-end print:pt-16">
              <div className="text-center font-mono text-xs">
                <p className="border-t border-slate-300 pt-1 w-48 font-bold">Authorized Signatory</p>
                <p className="text-[10px] text-slate-500">Earth Metal Industries</p>
              </div>

              <button
                onClick={() => window.print()}
                className="btn-primary text-xs py-2 px-4 print:hidden flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Save Tax Invoice PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
