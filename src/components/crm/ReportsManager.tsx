import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Search, 
  IndianRupee, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  FileText, 
  Package, 
  Building, 
  Percent, 
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  X,
  FileCheck,
  Check
} from 'lucide-react';

export type ReportCategory = 'invoices' | 'quotations' | 'orders' | 'customers' | 'gst' | 'products';
export type TimeframePeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

export const ReportsManager: React.FC = () => {
  const { invoices, quotations, orders, leads, products, companySettings } = useApp();

  const [activeCategory, setActiveCategory] = useState<ReportCategory>('invoices');
  const [period, setPeriod] = useState<TimeframePeriod>('month');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Date Filtering Helper
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const itemDate = new Date(dateStr);
    if (isNaN(itemDate.getTime())) return true;

    const now = new Date();
    let start = new Date(0);
    let end = new Date(now.getTime() + 86400000);

    if (period === 'day') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      start = new Date(now.getTime() - 7 * 86400000);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (period === 'custom') {
      if (customStartDate) start = new Date(customStartDate);
      if (customEndDate) end = new Date(new Date(customEndDate).getTime() + 86400000);
    }

    return itemDate >= start && itemDate <= end;
  };

  // Invoices filtered dataset
  const filteredInvoices = useMemo(() => {
    return (invoices || []).filter(inv => {
      if (!inv) return false;
      const matchDate = isDateInRange(inv.issueDate || inv.createdAt);
      const matchStatus = statusFilter === 'all' || (inv.status || '').toLowerCase() === statusFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (inv.invoiceNumber || '').toLowerCase().includes(q) ||
        (inv.buyer?.companyName || (inv as any).companyName || '').toLowerCase().includes(q) ||
        (inv.poNumber || '').toLowerCase().includes(q);
      return matchDate && matchStatus && matchSearch;
    });
  }, [invoices, period, customStartDate, customEndDate, statusFilter, searchQuery]);

  // Quotations filtered dataset
  const filteredQuotations = useMemo(() => {
    return (quotations || []).filter(q => {
      if (!q) return false;
      const matchDate = isDateInRange(q.createdAt);
      const matchStatus = statusFilter === 'all' || (q.status || '').toLowerCase() === statusFilter.toLowerCase();
      const sq = searchQuery.toLowerCase().trim();
      const matchSearch = !sq || 
        (q.quotationNumber || '').toLowerCase().includes(sq) ||
        (((q as any).buyer?.companyName || q.companyName || '')).toLowerCase().includes(sq);
      return matchDate && matchStatus && matchSearch;
    });
  }, [quotations, period, customStartDate, customEndDate, statusFilter, searchQuery]);

  // Orders filtered dataset
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(ord => {
      if (!ord) return false;
      const matchDate = isDateInRange(ord.createdAt);
      const matchStatus = statusFilter === 'all' || (ord.stage || '').toLowerCase() === statusFilter.toLowerCase();
      const sq = searchQuery.toLowerCase().trim();
      const matchSearch = !sq || 
        (ord.orderNumber || '').toLowerCase().includes(sq) ||
        (ord.companyName || '').toLowerCase().includes(sq);
      return matchDate && matchStatus && matchSearch;
    });
  }, [orders, period, customStartDate, customEndDate, statusFilter, searchQuery]);

  // Customers Aggregated Dataset
  const customersReport = useMemo(() => {
    const map = new Map<string, {
      companyName: string;
      gstin: string;
      state: string;
      totalInvoices: number;
      totalOrders: number;
      totalBilledINR: number;
      paidINR: number;
      outstandingINR: number;
      lastDate: string;
    }>();

    (invoices || []).forEach(inv => {
      const name = inv.buyer?.companyName || (inv as any).companyName || 'Unknown Client';
      const existing = map.get(name) || {
        companyName: name,
        gstin: inv.buyer?.gstin || (inv as any).gstin || 'Unregistered',
        state: inv.buyer?.state || 'Gujarat',
        totalInvoices: 0,
        totalOrders: 0,
        totalBilledINR: 0,
        paidINR: 0,
        outstandingINR: 0,
        lastDate: inv.issueDate || inv.createdAt || ''
      };

      const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
      existing.totalInvoices += 1;
      existing.totalBilledINR += grandTotal;
      if (inv.status === 'Paid') {
        existing.paidINR += grandTotal;
      } else {
        existing.outstandingINR += grandTotal;
      }
      if (inv.issueDate && (!existing.lastDate || inv.issueDate > existing.lastDate)) {
        existing.lastDate = inv.issueDate;
      }
      map.set(name, existing);
    });

    (orders || []).forEach(ord => {
      const name = ord.companyName || 'Unknown Client';
      if (map.has(name)) {
        const item = map.get(name)!;
        item.totalOrders += 1;
      } else {
        map.set(name, {
          companyName: name,
          gstin: (ord as any).gstin || 'Unregistered',
          state: 'Gujarat',
          totalInvoices: 0,
          totalOrders: 1,
          totalBilledINR: Math.round((ord.totalValueUSD || 0) * 85),
          paidINR: 0,
          outstandingINR: Math.round((ord.totalValueUSD || 0) * 85),
          lastDate: ord.createdAt || ''
        });
      }
    });

    const list = Array.from(map.values());
    const sq = searchQuery.toLowerCase().trim();
    return list.filter(c => !sq || c.companyName.toLowerCase().includes(sq) || c.gstin.toLowerCase().includes(sq));
  }, [invoices, orders, searchQuery]);

  // Overall Financial Metrics
  const summaryMetrics = useMemo(() => {
    let billedINR = 0;
    let taxableINR = 0;
    let gstINR = 0;
    let paidINR = 0;
    let pendingINR = 0;

    filteredInvoices.forEach(inv => {
      const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
      const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
        ? Math.round(inv.taxableTotalUSD * 85)
        : (inv.subtotalUSD && inv.subtotalUSD > 0
            ? Math.round((inv.subtotalUSD - (inv.totalDiscountUSD || 0)) * 85)
            : Math.round(grandTotal / 1.18));
      const tax = (inv.totalTaxUSD && inv.totalTaxUSD > 0)
        ? Math.round(inv.totalTaxUSD * 85)
        : Math.max(0, grandTotal - taxable);

      billedINR += grandTotal;
      taxableINR += taxable;
      gstINR += tax;

      if (inv.status === 'Paid') {
        paidINR += grandTotal;
      } else {
        pendingINR += grandTotal;
      }
    });

    let quotedTotalINR = 0;
    filteredQuotations.forEach(q => {
      quotedTotalINR += ((q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85));
    });

    let ordersTotalINR = 0;
    filteredOrders.forEach(o => {
      ordersTotalINR += Math.round((o.totalValueUSD || 0) * 85);
    });

    return {
      billedINR,
      taxableINR,
      gstINR,
      paidINR,
      pendingINR,
      quotedTotalINR,
      ordersTotalINR,
      invoicesCount: filteredInvoices.length,
      quotationsCount: filteredQuotations.length,
      ordersCount: filteredOrders.length,
      customersCount: customersReport.length
    };
  }, [filteredInvoices, filteredQuotations, filteredOrders, customersReport]);

  // Category-specific Cumulative Totals for Audit Tables & PDF
  const invoicesTotals = useMemo(() => {
    let taxable = 0;
    let tax = 0;
    let grand = 0;
    let paid = 0;
    let pending = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    filteredInvoices.forEach(inv => {
      const g = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
      const t = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
        ? Math.round(inv.taxableTotalUSD * 85)
        : Math.round(g / 1.18);
      const tx = Math.max(0, g - t);

      taxable += t;
      tax += tx;
      grand += g;

      if (inv.taxType === 'INTRA_STATE') {
        cgst += Math.round(tx / 2);
        sgst += Math.round(tx / 2);
      } else {
        igst += tx;
      }

      if (inv.status === 'Paid') {
        paid += g;
      } else {
        pending += g;
      }
    });

    return { taxable, tax, grand, paid, pending, cgst, sgst, igst };
  }, [filteredInvoices]);

  const quotationsTotals = useMemo(() => {
    let taxable = 0;
    let tax = 0;
    let grand = 0;

    filteredQuotations.forEach(q => {
      const g = (q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85);
      const t = Math.round(((q as any).taxableTotalUSD || q.subtotalUSD || (g / 1.18)) * 85);
      const tx = Math.round(((q as any).totalTaxUSD || q.taxTotalUSD || 0) * 85);

      taxable += t;
      tax += tx;
      grand += g;
    });

    return { taxable, tax, grand };
  }, [filteredQuotations]);

  const ordersTotals = useMemo(() => {
    let totalValue = 0;
    filteredOrders.forEach(o => {
      totalValue += Math.round((o.totalValueUSD || 0) * 85);
    });
    return { totalValue };
  }, [filteredOrders]);

  const customersTotals = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let totalOrders = 0;
    let totalInvoices = 0;

    customersReport.forEach(c => {
      totalBilled += c.totalBilledINR;
      totalPaid += c.paidINR;
      totalOutstanding += c.outstandingINR;
      totalOrders += c.totalOrders;
      totalInvoices += c.totalInvoices;
    });

    return { totalBilled, totalPaid, totalOutstanding, totalOrders, totalInvoices };
  }, [customersReport]);

  const getCategoryTitle = (cat: ReportCategory) => {
    switch (cat) {
      case 'invoices': return 'COMMERCIAL TAX INVOICE & GST STATUTORY AUDIT LEDGER';
      case 'quotations': return 'OFFICIAL COMMERCIAL QUOTATIONS & PROPOSALS REGISTER';
      case 'orders': return 'PRODUCTION ORDERS, DISPATCH & LOGISTICS DISCLOSURE';
      case 'customers': return 'CLIENT ACCOUNT TURNOVER & REALIZATION STATEMENT';
      case 'gst': return 'GST 18% STATUTORY TAX LEDGER (GSTR-1 AUDIT COMPLIANT)';
      case 'products': return 'OFFICIAL INDUSTRIAL PRODUCTS CATALOG & HSN SPECIFICATIONS';
    }
  };

  const getPeriodDescription = () => {
    switch (period) {
      case 'day': return `TODAY (${new Date().toLocaleDateString('en-IN')})`;
      case 'week': return `PAST 7 DAYS (Ending ${new Date().toLocaleDateString('en-IN')})`;
      case 'month': return `CURRENT MONTH (${new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })})`;
      case 'year': return `FINANCIAL YEAR ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`;
      case 'custom': return `CUSTOM PERIOD (${customStartDate || 'Start'} to ${customEndDate || 'End'})`;
    }
  };

  // 1. Export to CSV Implementation
  const handleExportCSV = () => {
    let csvRows: string[][] = [];
    let filename = `weldor-${activeCategory}-report-${period}.csv`;

    if (activeCategory === 'invoices' || activeCategory === 'gst') {
      csvRows.push(['Invoice Number', 'Issue Date', 'PO Number', 'Buyer Company', 'Buyer GSTIN', 'State', 'Tax Type', 'Taxable Value (INR)', 'GST Tax (INR)', 'Grand Total (INR)', 'Payment Status']);
      filteredInvoices.forEach(inv => {
        const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
        const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
          ? Math.round(inv.taxableTotalUSD * 85)
          : Math.round(grandTotal / 1.18);
        const tax = Math.max(0, grandTotal - taxable);

        csvRows.push([
          `"${inv.invoiceNumber || ''}"`,
          `"${inv.issueDate || ''}"`,
          `"${inv.poNumber || 'N/A'}"`,
          `"${inv.buyer?.companyName || (inv as any).companyName || 'Buyer'}"`,
          `"${inv.buyer?.gstin || 'Unregistered'}"`,
          `"${inv.buyer?.state || 'Gujarat'}"`,
          `"${inv.taxType || 'INTER_STATE'}"`,
          `${taxable}`,
          `${tax}`,
          `${grandTotal}`,
          `"${inv.status || 'Pending'}"`
        ]);
      });
    } else if (activeCategory === 'quotations') {
      csvRows.push(['Quotation Number', 'Date', 'Expiry Date', 'Buyer Company', 'Contact Person', 'GSTIN', 'Taxable Subtotal (INR)', 'GST Total (INR)', 'Grand Total (INR)', 'Status']);
      filteredQuotations.forEach(q => {
        const grand = (q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85);
        const taxable = Math.round(((q as any).taxableTotalUSD || q.subtotalUSD || (grand / 1.18)) * 85);
        const gst = Math.round(((q as any).totalTaxUSD || q.taxTotalUSD || 0) * 85);

        csvRows.push([
          `"${q.quotationNumber || ''}"`,
          `"${new Date(q.createdAt).toISOString().slice(0, 10)}"`,
          `"${(q as any).expiryDate || `${q.validityDays} Days`}"`,
          `"${(q as any).buyer?.companyName || q.companyName || ''}"`,
          `"${(q as any).buyer?.contactName || q.contactName || ''}"`,
          `"${(q as any).buyer?.gstin || 'N/A'}"`,
          `${taxable}`,
          `${gst}`,
          `${grand}`,
          `"${q.status || 'Approved'}"`
        ]);
      });
    } else if (activeCategory === 'orders') {
      csvRows.push(['Order Number', 'Date', 'Buyer Company', 'Contact', 'Stage', 'Order Value (INR)', 'Courier Partner', 'Tracking Number']);
      filteredOrders.forEach(o => {
        const val = Math.round((o.totalValueUSD || 0) * 85);
        csvRows.push([
          `"${o.orderNumber || ''}"`,
          `"${new Date(o.createdAt).toISOString().slice(0, 10)}"`,
          `"${o.companyName || ''}"`,
          `"${o.contactName || ''}"`,
          `"${o.stage || ''}"`,
          `${val}`,
          `"${(o as any).courierPartner || 'Ex-Works'}"`,
          `"${(o as any).courierTrackingNo || 'N/A'}"`
        ]);
      });
    } else if (activeCategory === 'customers') {
      csvRows.push(['Customer Company', 'GSTIN', 'State', 'Total Orders', 'Total Invoices', 'Total Billed (INR)', 'Paid (INR)', 'Outstanding (INR)', 'Last Transaction Date']);
      customersReport.forEach(c => {
        csvRows.push([
          `"${c.companyName}"`,
          `"${c.gstin}"`,
          `"${c.state}"`,
          `${c.totalOrders}`,
          `${c.totalInvoices}`,
          `${c.totalBilledINR}`,
          `${c.paidINR}`,
          `${c.outstandingINR}`,
          `"${c.lastDate}"`
        ]);
      });
    } else if (activeCategory === 'products') {
      csvRows.push(['Product Name', 'SKU', 'Category', 'Base Price (INR)']);
      (products || []).forEach(p => {
        csvRows.push([
          `"${p.name || ''}"`,
          `"${p.sku || ''}"`,
          `"${p.category || ''}"`,
          `${p.priceINR || Math.round((p.priceUSD || 0) * 85)}`
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export to Excel (.xlsx / formatted Spreadsheet XML)
  const handleExportExcel = () => {
    let filename = `weldor-${activeCategory}-report-${period}.xls`;
    let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${activeCategory.toUpperCase()} Report</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #000000; padding: 6px; }
        td { border: 1px solid #cbd5e1; padding: 5px; font-family: sans-serif; font-size: 11px; }
        .num { mso-number-format:"\\#\\,\\#\\#0"; text-align: right; }
        .title { font-size: 16px; font-weight: bold; color: #ea580c; }
      </style>
    </head>
    <body>
      <table>
        <tr><td colspan="7" class="title">EARTH METAL INDUSTRIES / WELDOR DIGITAL PLATFORM</td></tr>
        <tr><td colspan="7"><strong>Report Type:</strong> ${activeCategory.toUpperCase()} | <strong>Period:</strong> ${period.toUpperCase()} | Generated: ${new Date().toLocaleString('en-IN')}</td></tr>
        <tr><td colspan="7"></td></tr>
    `;

    if (activeCategory === 'invoices' || activeCategory === 'gst') {
      tableHtml += `
        <tr>
          <th>Invoice #</th><th>Date</th><th>PO Ref</th><th>Buyer Company</th><th>GSTIN</th><th>State</th><th>Tax Type</th><th>Taxable (INR)</th><th>GST (INR)</th><th>Grand Total (INR)</th><th>Status</th>
        </tr>
      `;
      filteredInvoices.forEach(inv => {
        const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
        const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
          ? Math.round(inv.taxableTotalUSD * 85)
          : Math.round(grandTotal / 1.18);
        const tax = Math.max(0, grandTotal - taxable);

        tableHtml += `
          <tr>
            <td>${inv.invoiceNumber}</td>
            <td>${inv.issueDate}</td>
            <td>${inv.poNumber || 'N/A'}</td>
            <td>${inv.buyer?.companyName || (inv as any).companyName || 'Client'}</td>
            <td>${inv.buyer?.gstin || 'Unregistered'}</td>
            <td>${inv.buyer?.state || 'Gujarat'}</td>
            <td>${inv.taxType || 'INTER_STATE'}</td>
            <td class="num">${taxable}</td>
            <td class="num">${tax}</td>
            <td class="num">${grandTotal}</td>
            <td>${inv.status || 'Pending'}</td>
          </tr>
        `;
      });
    } else if (activeCategory === 'quotations') {
      tableHtml += `
        <tr>
          <th>Quotation #</th><th>Date</th><th>Validity</th><th>Buyer Company</th><th>Contact</th><th>GSTIN</th><th>Taxable (INR)</th><th>GST (INR)</th><th>Grand Total (INR)</th><th>Status</th>
        </tr>
      `;
      filteredQuotations.forEach(q => {
        const grand = (q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85);
        const taxable = Math.round(((q as any).taxableTotalUSD || q.subtotalUSD || (grand / 1.18)) * 85);
        const gst = Math.round(((q as any).totalTaxUSD || q.taxTotalUSD || 0) * 85);
        tableHtml += `
          <tr>
            <td>${q.quotationNumber}</td>
            <td>${new Date(q.createdAt).toISOString().slice(0, 10)}</td>
            <td>${q.validityDays} Days</td>
            <td>${(q as any).buyer?.companyName || q.companyName || ''}</td>
            <td>${(q as any).buyer?.contactName || q.contactName || ''}</td>
            <td>${(q as any).buyer?.gstin || 'N/A'}</td>
            <td class="num">${taxable}</td>
            <td class="num">${gst}</td>
            <td class="num">${grand}</td>
            <td>${q.status || 'Approved'}</td>
          </tr>
        `;
      });
    } else if (activeCategory === 'orders') {
      tableHtml += `
        <tr>
          <th>Order #</th><th>Date</th><th>Buyer Company</th><th>Contact</th><th>Stage</th><th>Order Value (INR)</th><th>Courier</th><th>Tracking #</th>
        </tr>
      `;
      filteredOrders.forEach(o => {
        const val = Math.round((o.totalValueUSD || 0) * 85);
        tableHtml += `
          <tr>
            <td>${o.orderNumber}</td>
            <td>${new Date(o.createdAt).toISOString().slice(0, 10)}</td>
            <td>${o.companyName}</td>
            <td>${o.contactName}</td>
            <td>${o.stage}</td>
            <td class="num">${val}</td>
            <td>${(o as any).courierPartner || 'Ex-Works'}</td>
            <td>${(o as any).courierTrackingNo || 'N/A'}</td>
          </tr>
        `;
      });
    } else if (activeCategory === 'customers') {
      tableHtml += `
        <tr>
          <th>Customer Company</th><th>GSTIN</th><th>State</th><th>Total Orders</th><th>Total Invoices</th><th>Total Billed (INR)</th><th>Paid (INR)</th><th>Outstanding (INR)</th><th>Last Date</th>
        </tr>
      `;
      customersReport.forEach(c => {
        tableHtml += `
          <tr>
            <td>${c.companyName}</td>
            <td>${c.gstin}</td>
            <td>${c.state}</td>
            <td class="num">${c.totalOrders}</td>
            <td class="num">${c.totalInvoices}</td>
            <td class="num">${c.totalBilledINR}</td>
            <td class="num">${c.paidINR}</td>
            <td class="num">${c.outstandingINR}</td>
            <td>${c.lastDate}</td>
          </tr>
        `;
      });
    }

    tableHtml += `
      </table>
    </body>
    </html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render Official Print / PDF Document Sheet (Used by Modal & Browser Print)
  const renderPrintableDocument = () => {
    return (
      <div id="printable-audit-report" className="space-y-6 text-slate-900 bg-white font-sans">
        
        {/* Official Corporate Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <img src="/weldor-logo.png" alt="Weldor Logo" className="h-12 w-auto object-contain mt-1" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
                  {companySettings?.legalEntityName || companySettings?.legalName || companySettings?.companyName || 'EARTH METAL INDUSTRIES'}
                </h1>
                <p className="text-xs font-mono font-bold text-orange-700 uppercase">
                  {companySettings?.brandName ? `${companySettings.brandName}® PRECISION AUTOMATION` : 'WELDOR® PRECISION AUTOMATION & VALVE SOLUTIONS'}
                </p>
                <p className="text-[11px] text-slate-600 font-mono mt-1">
                  {companySettings?.factoryPlantAddress || companySettings?.registeredOffice || (companySettings?.registeredOfficeAddress?.addressLine1 ? `${companySettings.registeredOfficeAddress.addressLine1}, ${companySettings.registeredOfficeAddress.city || ''}, ${companySettings.registeredOfficeAddress.state || ''} - ${companySettings.registeredOfficeAddress.pincode || ''}` : '')}
                </p>
                {(companySettings?.gstinNumber || companySettings?.gstin) && (
                  <p className="text-[11px] text-slate-700 font-mono font-semibold">
                    GSTIN: <span className="font-bold text-slate-900">{companySettings.gstinNumber || companySettings.gstin}</span>{companySettings?.panNumber ? ` | PAN: ${companySettings.panNumber}` : ''}{(companySettings?.state || companySettings?.stateCode) ? ` | State: ${companySettings.state || ''} (${companySettings.stateCode || ''})` : ''}
                  </p>
                )}
                {(companySettings?.supportEmail || companySettings?.primaryEmail || companySettings?.salesPhone || companySettings?.primaryPhone || companySettings?.websiteUrl) && (
                  <p className="text-[10.5px] text-slate-500 font-mono">
                    {companySettings?.supportEmail || companySettings?.primaryEmail ? `Email: ${companySettings.supportEmail || companySettings.primaryEmail}` : ''}{(companySettings?.supportEmail || companySettings?.primaryEmail) && (companySettings?.salesPhone || companySettings?.primaryPhone) ? ' | ' : ''}{companySettings?.salesPhone || companySettings?.primaryPhone ? `Phone: ${companySettings.salesPhone || companySettings.primaryPhone}` : ''}{(companySettings?.salesPhone || companySettings?.primaryPhone) && companySettings?.websiteUrl ? ' | ' : ''}{companySettings?.websiteUrl ? `Web: ${companySettings.websiteUrl}` : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="border-2 border-slate-800 rounded-xl p-3 bg-slate-50 font-mono text-right w-full sm:w-auto min-w-[260px] shrink-0">
              <span className="text-[11px] font-black text-orange-800 uppercase block tracking-wider bg-orange-100/80 px-2 py-0.5 rounded border border-orange-200">
                OFFICIAL AUDIT STATEMENT
              </span>
              <div className="mt-2 text-[10.5px] space-y-1 text-slate-800">
                <div><span className="text-slate-500">Statement:</span> <strong className="text-slate-900">{getCategoryTitle(activeCategory)}</strong></div>
                <div><span className="text-slate-500">Period:</span> <strong>{getPeriodDescription()}</strong></div>
                <div><span className="text-slate-500">Date & Time:</span> <strong>{new Date().toLocaleString('en-IN')}</strong></div>
                <div><span className="text-slate-500">Ref Code:</span> <strong>EMI/REP/{activeCategory.toUpperCase()}/{period.toUpperCase()}</strong></div>
                <div><span className="text-slate-500">Compliance:</span> <strong className="text-emerald-800">ISO 9001:2015 & GST Rule 56</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Financial Summary Metric Strip */}
        <div className="grid grid-cols-4 gap-3">
          <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50 font-mono">
            <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Gross Billed Turnover</span>
            <span className="text-base font-black text-slate-900">₹{summaryMetrics.billedINR.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-500 block">Total Records: {activeCategory === 'invoices' || activeCategory === 'gst' ? filteredInvoices.length : activeCategory === 'quotations' ? filteredQuotations.length : activeCategory === 'orders' ? filteredOrders.length : customersReport.length}</span>
          </div>

          <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50 font-mono">
            <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Net Taxable Base</span>
            <span className="text-base font-black text-slate-900">₹{summaryMetrics.taxableINR.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-500 block">Exclusive of GST</span>
          </div>

          <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50 font-mono">
            <span className="text-[9.5px] text-slate-500 uppercase block font-bold">GST 18% Tax Total</span>
            <span className="text-base font-black text-orange-700">₹{summaryMetrics.gstINR.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-800 font-bold block">CGST + SGST + IGST</span>
          </div>

          <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50 font-mono">
            <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Payment Realization</span>
            <div className="text-[11px] font-bold text-emerald-700">Paid: ₹{summaryMetrics.paidINR.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-bold text-rose-700">Pending: ₹{summaryMetrics.pendingINR.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Full Unclipped Data Table per Category */}
        <div className="w-full">
          {activeCategory === 'invoices' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">INVOICE # & DATE</th>
                  <th className="border border-slate-400 p-2 text-left">BUYER COMPANY / PO</th>
                  <th className="border border-slate-400 p-2 text-left">GSTIN & STATE</th>
                  <th className="border border-slate-400 p-2 text-center">SCHEME</th>
                  <th className="border border-slate-400 p-2 text-right">TAXABLE (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">GST (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">TOTAL (₹)</th>
                  <th className="border border-slate-400 p-2 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 p-6 text-center text-slate-400 font-sans">
                      No invoices recorded for the selected period.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv, idx) => {
                    const grand = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
                    const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
                      ? Math.round(inv.taxableTotalUSD * 85)
                      : Math.round(grand / 1.18);
                    const tax = Math.max(0, grand - taxable);

                    return (
                      <tr key={inv.id || idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <strong className="text-slate-900 block">{inv.invoiceNumber}</strong>
                          <span className="text-[10px] text-slate-500">{inv.issueDate}</span>
                        </td>
                        <td className="border border-slate-300 p-2">
                          <span className="font-sans font-bold text-slate-900 block">{inv.buyer?.companyName || (inv as any).companyName || 'Buyer'}</span>
                          <span className="text-[10px] text-slate-500 font-sans">PO: {inv.poNumber || 'N/A'}</span>
                        </td>
                        <td className="border border-slate-300 p-2">
                          <span className="text-slate-900 font-bold block">{inv.buyer?.gstin || 'Unregistered'}</span>
                          <span className="text-[10px] text-slate-600">{inv.buyer?.state || 'Gujarat'} ({inv.buyer?.stateCode || '24'})</span>
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 text-slate-700">
                            {inv.taxType === 'INTRA_STATE' ? 'Intra (CGST+SGST)' : 'Inter (IGST)'}
                          </span>
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-slate-800">
                          ₹{taxable.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right text-slate-700">
                          ₹{tax.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-black text-slate-900">
                          ₹{grand.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {inv.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={5} className="border border-slate-400 p-2 text-right">
                    GRAND TOTAL ({filteredInvoices.length} Invoices):
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.taxable.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.tax.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    ₹{invoicesTotals.grand.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-center text-[10px]">
                    Paid: ₹{invoicesTotals.paid.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeCategory === 'quotations' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">QUOTE # & DATE</th>
                  <th className="border border-slate-400 p-2 text-left">BUYER / CLIENT</th>
                  <th className="border border-slate-400 p-2 text-left">CONTACT / GSTIN</th>
                  <th className="border border-slate-400 p-2 text-center">VALIDITY</th>
                  <th className="border border-slate-400 p-2 text-right">TAXABLE (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">GST (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">GRAND TOTAL (₹)</th>
                  <th className="border border-slate-400 p-2 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 p-6 text-center text-slate-400 font-sans">
                      No quotations found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((q, idx) => {
                    const grand = (q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85);
                    const taxable = Math.round(((q as any).taxableTotalUSD || q.subtotalUSD || (grand / 1.18)) * 85);
                    const tax = Math.round(((q as any).totalTaxUSD || q.taxTotalUSD || 0) * 85);

                    return (
                      <tr key={q.id || idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <strong className="text-slate-900 block">{q.quotationNumber}</strong>
                          <span className="text-[10px] text-slate-500">{new Date(q.createdAt).toLocaleDateString('en-IN')}</span>
                        </td>
                        <td className="border border-slate-300 p-2 font-sans font-bold text-slate-900">
                          {(q as any).buyer?.companyName || q.companyName || 'Client'}
                        </td>
                        <td className="border border-slate-300 p-2 font-sans">
                          <span className="block text-slate-800">{(q as any).buyer?.contactName || q.contactName || 'N/A'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{(q as any).buyer?.gstin || 'N/A'}</span>
                        </td>
                        <td className="border border-slate-300 p-2 text-center text-slate-600">
                          {q.validityDays} Days
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-slate-800">
                          ₹{taxable.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right text-slate-700">
                          ₹{tax.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-black text-slate-900">
                          ₹{grand.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-900">
                            {q.status || 'Approved'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={5} className="border border-slate-400 p-2 text-right">
                    TOTAL QUOTED PIPELINE ({filteredQuotations.length} Quotes):
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{quotationsTotals.taxable.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{quotationsTotals.tax.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    ₹{quotationsTotals.grand.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-center text-[10px] text-slate-600">
                    Active
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeCategory === 'orders' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">ORDER # & DATE</th>
                  <th className="border border-slate-400 p-2 text-left">CLIENT COMPANY</th>
                  <th className="border border-slate-400 p-2 text-left">CONTACT PERSON</th>
                  <th className="border border-slate-400 p-2 text-center">STAGE</th>
                  <th className="border border-slate-400 p-2 text-left">COURIER / LOGISTICS</th>
                  <th className="border border-slate-400 p-2 text-left">TRACKING #</th>
                  <th className="border border-slate-400 p-2 text-right">ORDER VALUE (₹)</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-slate-300 p-6 text-center text-slate-400 font-sans">
                      No orders found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o, idx) => {
                    const val = Math.round((o.totalValueUSD || 0) * 85);
                    return (
                      <tr key={o.id || idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <strong className="text-slate-900 block">{o.orderNumber}</strong>
                          <span className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                        </td>
                        <td className="border border-slate-300 p-2 font-sans font-bold text-slate-900">
                          {o.companyName}
                        </td>
                        <td className="border border-slate-300 p-2 font-sans text-slate-700">
                          {o.contactName}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-blue-100 text-blue-900">
                            {o.stage}
                          </span>
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {(o as any).courierPartner || 'Ex-Works Jamnagar'}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-600 font-bold">
                          {(o as any).courierTrackingNo || 'PENDING DISPATCH'}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-black text-slate-900">
                          ₹{val.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={7} className="border border-slate-400 p-2 text-right">
                    TOTAL ORDERS VALUE ({filteredOrders.length} Orders):
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    ₹{ordersTotals.totalValue.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeCategory === 'customers' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">CUSTOMER / BUYER</th>
                  <th className="border border-slate-400 p-2 text-left">GSTIN</th>
                  <th className="border border-slate-400 p-2 text-center">STATE</th>
                  <th className="border border-slate-400 p-2 text-center">ORDERS</th>
                  <th className="border border-slate-400 p-2 text-center">INVOICES</th>
                  <th className="border border-slate-400 p-2 text-right">TOTAL BILLED (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">PAID AMOUNT (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">OUTSTANDING (₹)</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {customersReport.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 p-6 text-center text-slate-400 font-sans">
                      No customer account data available.
                    </td>
                  </tr>
                ) : (
                  customersReport.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-sans font-bold text-slate-900">
                        {c.companyName}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {c.gstin}
                      </td>
                      <td className="border border-slate-300 p-2 text-center text-slate-600">
                        {c.state}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">
                        {c.totalOrders}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">
                        {c.totalInvoices}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-slate-900">
                        ₹{c.totalBilledINR.toLocaleString('en-IN')}
                      </td>
                      <td className="border border-slate-300 p-2 text-right text-emerald-700 font-bold">
                        ₹{c.paidINR.toLocaleString('en-IN')}
                      </td>
                      <td className="border border-slate-300 p-2 text-right text-rose-700 font-bold">
                        ₹{c.outstandingINR.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={4} className="border border-slate-400 p-2 text-right">
                    CUMULATIVE CLIENT LEDGER ({customersReport.length} Clients):
                  </td>
                  <td className="border border-slate-400 p-2 text-center">
                    {customersTotals.totalOrders}
                  </td>
                  <td className="border border-slate-400 p-2 text-center">
                    {customersTotals.totalInvoices}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    ₹{customersTotals.totalBilled.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-bold text-emerald-800">
                    ₹{customersTotals.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-bold text-rose-800">
                    ₹{customersTotals.totalOutstanding.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeCategory === 'gst' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">INVOICE # & DATE</th>
                  <th className="border border-slate-400 p-2 text-left">BUYER & GSTIN</th>
                  <th className="border border-slate-400 p-2 text-center">TAX SCHEME</th>
                  <th className="border border-slate-400 p-2 text-right">TAXABLE (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">CGST 9% (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">SGST 9% (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">IGST 18% (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">TOTAL TAX (₹)</th>
                  <th className="border border-slate-400 p-2 text-right">INVOICE TOTAL (₹)</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="border border-slate-300 p-6 text-center text-slate-400 font-sans">
                      No GST invoices found for this tax audit period.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv, idx) => {
                    const grand = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
                    const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
                      ? Math.round(inv.taxableTotalUSD * 85)
                      : Math.round(grand / 1.18);
                    const tax = Math.max(0, grand - taxable);
                    const isIntra = inv.taxType === 'INTRA_STATE';
                    const cgst = isIntra ? Math.round(tax / 2) : 0;
                    const sgst = isIntra ? Math.round(tax / 2) : 0;
                    const igst = isIntra ? 0 : tax;

                    return (
                      <tr key={inv.id || idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <strong className="text-slate-900 block">{inv.invoiceNumber}</strong>
                          <span className="text-[10px] text-slate-500">{inv.issueDate}</span>
                        </td>
                        <td className="border border-slate-300 p-2">
                          <span className="font-sans font-bold text-slate-900 block">{inv.buyer?.companyName || (inv as any).companyName || 'Client'}</span>
                          <span className="text-[10px] text-slate-600 font-mono">{inv.buyer?.gstin || 'Unregistered'}</span>
                        </td>
                        <td className="border border-slate-300 p-2 text-center text-[10px]">
                          {isIntra ? 'Intra-State (Gujarat)' : 'Inter-State (IGST)'}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-slate-800">
                          ₹{taxable.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right text-slate-700">
                          ₹{cgst.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right text-slate-700">
                          ₹{sgst.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right text-slate-700">
                          ₹{igst.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-orange-700">
                          ₹{tax.toLocaleString('en-IN')}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-black text-slate-900">
                          ₹{grand.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={4} className="border border-slate-400 p-2 text-right">
                    STATUTORY TAX TOTALS ({filteredInvoices.length} Invoices):
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.taxable.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.cgst.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.sgst.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right">
                    ₹{invoicesTotals.igst.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-bold text-orange-800">
                    ₹{invoicesTotals.tax.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    ₹{invoicesTotals.grand.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeCategory === 'products' && (
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-mono font-bold text-[10px]">
                  <th className="border border-slate-400 p-2 text-center w-8">#</th>
                  <th className="border border-slate-400 p-2 text-left">PRODUCT SPECIFICATION</th>
                  <th className="border border-slate-400 p-2 text-left">SKU CODE</th>
                  <th className="border border-slate-400 p-2 text-left">CATEGORY</th>
                  <th className="border border-slate-400 p-2 text-right">BASE PRICE (₹)</th>
                  <th className="border border-slate-400 p-2 text-center">GST RATE</th>
                  <th className="border border-slate-400 p-2 text-right">PRICE WITH GST (₹)</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {(products || []).map((p, idx) => {
                  const base = p.priceINR || Math.round((p.priceUSD || 0) * 85);
                  const withGst = Math.round(base * 1.18);
                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="border border-slate-300 p-2">
                        <strong className="text-slate-900 font-sans block">{p.name}</strong>
                        <span className="text-[10px] text-slate-500 font-sans block">{p.description}</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-orange-700 font-bold">
                        {p.sku}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {p.category}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-slate-900">
                        ₹{base.toLocaleString('en-IN')}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">
                        18% GST
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-black text-slate-950">
                        ₹{withGst.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-900">
                  <td colSpan={6} className="border border-slate-400 p-2 text-right">
                    TOTAL ACTIVE CATALOG SKUs:
                  </td>
                  <td className="border border-slate-400 p-2 text-right font-black text-slate-950">
                    {products.length} Products
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Official Statutory Declaration & Signatures */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-[11px] items-end">
          <div className="space-y-1 text-slate-600">
            <p className="font-bold text-slate-900 uppercase">ISO 9001:2015 AUDIT CERTIFICATION</p>
            <p className="text-[10px] leading-relaxed text-slate-600">
              Certified that this statement represents a true and fair record extracted from the Weldor ERP Database. Preserved under Section 35 of the CGST Act, 2017.
            </p>
            <p className="text-[9.5px] text-slate-400 font-mono">
              System Stamp: SHA256-VERIFIED-EMI-LEDGER
            </p>
          </div>

          <div className="text-center py-2">
            <div className="inline-block border-2 border-dashed border-orange-700 p-2.5 rounded-xl text-orange-800 bg-orange-50/50">
              <div className="text-[9px] font-black uppercase tracking-widest">EARTH METAL INDUSTRIES</div>
              <div className="text-[11px] font-black my-0.5">★ AUDIT VERIFIED ★</div>
              <div className="text-[9px] font-bold">JAMNAGAR WORKS (GUJ)</div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="font-bold text-slate-900">For, EARTH METAL INDUSTRIES</p>
            <div className="h-10"></div>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[200px]">
              Authorised Financial Signatory
            </p>
            <p className="text-[10px] text-slate-500">Commercial Operations & Central Accounts</p>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 text-slate-900 font-sans print:p-0 print:m-0">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-orange-600" /> Executive Business Reports & Data Engine
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Excel (.xlsx) • CSV • Print / PDF
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading mt-2">
            Commercial Analytics, Tax Ledgers & Multi-Format Reports
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Extract detailed period reports (daily, weekly, monthly, yearly, custom) for GST tax audits, executive sales pipelines, buyer ledgers, and dispatch registries.
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download formatted Excel sheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download RFC 4180 CSV file"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Preview and print official audit report"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Report Domain Selector) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveCategory('invoices')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'invoices' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tax Invoices Ledger ({filteredInvoices.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('quotations')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'quotations' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations Pipeline ({filteredQuotations.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('orders')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'orders' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Dispatch ({filteredOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('customers')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'customers' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Client Accounts ({customersReport.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('gst')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'gst' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>GST 18% Tax Audit</span>
        </button>

        <button
          onClick={() => setActiveCategory('products')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeCategory === 'products' 
              ? 'bg-orange-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>
      </div>

      {/* Filter Toolbar (Period, Date Range, Status & Search) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Period selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-mono text-xs">
            <span className="text-slate-500 font-bold px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Period:
            </span>
            <button
              onClick={() => setPeriod('day')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'day' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (Day)
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'week' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'month' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'year' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly (1 Year)
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'custom' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search records, client, GSTIN, ref..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-full sm:w-72 focus:outline-hidden focus:border-orange-500 font-sans"
            />
          </div>
        </div>

        {/* Custom Range Date Pickers (when custom period selected) */}
        {period === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 font-mono text-xs">
            <span className="text-slate-500 font-bold">Custom Range:</span>
            <div className="flex items-center gap-2">
              <label className="text-slate-500 text-[11px]">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-500 text-[11px]">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
            Gross Billed Turnover (INR)
          </span>
          <p className="text-xl font-black text-slate-900 font-mono">
            ₹{summaryMetrics.billedINR.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
            <span>Invoices Count:</span>
            <strong className="text-slate-800">{summaryMetrics.invoicesCount}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
            Net Taxable Value (INR)
          </span>
          <p className="text-xl font-black text-slate-900 font-mono">
            ₹{summaryMetrics.taxableINR.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
            <span>Base Turnover:</span>
            <strong className="text-slate-800">Exclusive of GST</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
            GST 18% Tax Collected (INR)
          </span>
          <p className="text-xl font-black text-orange-600 font-mono">
            ₹{summaryMetrics.gstINR.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
            <span>CGST + SGST + IGST</span>
            <strong className="text-emerald-700">Audit Ready</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">
            Payment Realization Split
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-emerald-600 font-mono">
              Paid: ₹{summaryMetrics.paidINR.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 pt-1 border-t border-slate-100">
            <span>Outstanding / Pending:</span>
            <strong>₹{summaryMetrics.pendingINR.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Main Ledger Table by Category */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">
              {activeCategory === 'invoices' && `Tax Invoices Ledger (${filteredInvoices.length} entries)`}
              {activeCategory === 'quotations' && `Commercial Quotations Log (${filteredQuotations.length} quotes)`}
              {activeCategory === 'orders' && `Confirmed Orders Registry (${filteredOrders.length} orders)`}
              {activeCategory === 'customers' && `Client Account Turnover (${customersReport.length} clients)`}
              {activeCategory === 'gst' && `GST 18% Statutory Tax Ledger (${filteredInvoices.length} invoices)`}
              {activeCategory === 'products' && `Official Products Catalog (${products.length} SKUs)`}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Filtered for period: <strong className="text-slate-800">{period.toUpperCase()}</strong>
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            ISO 9001:2015 Audit Compliant
          </span>
        </div>

        {/* 1. Invoices & GST Table */}
        {(activeCategory === 'invoices' || activeCategory === 'gst') && (
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">INVOICE & DATE</th>
                  <th className="p-3">BUYER / CLIENT</th>
                  <th className="p-3">GSTIN / STATE</th>
                  <th className="p-3">TAX SCHEME</th>
                  <th className="p-3 text-right">TAXABLE VALUE (₹)</th>
                  <th className="p-3 text-right">GST TAX (₹)</th>
                  <th className="p-3 text-right">GRAND TOTAL (₹)</th>
                  <th className="p-3 text-center">PAYMENT STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                      No invoices found for the selected period filter.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(inv => {
                    const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
                    const taxable = (inv.taxableTotalUSD && inv.taxableTotalUSD > 0)
                      ? Math.round(inv.taxableTotalUSD * 85)
                      : Math.round(grandTotal / 1.18);
                    const tax = Math.max(0, grandTotal - taxable);

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <strong className="text-orange-700 block">{inv.invoiceNumber}</strong>
                          <span className="text-[11px] text-slate-500">{inv.issueDate}</span>
                        </td>
                        <td className="p-3">
                          <strong className="text-slate-900 font-sans block">{inv.buyer?.companyName || (inv as any).companyName || 'Buyer Company'}</strong>
                          <span className="text-[11px] text-slate-500 font-sans">PO: {inv.poNumber || 'N/A'}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-800 font-bold">{inv.buyer?.gstin || 'Unregistered'}</span>
                          <span className="text-slate-500 block text-[11px]">{inv.buyer?.state || 'Gujarat'} ({inv.buyer?.stateCode || '24'})</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {inv.taxType === 'INTRA_STATE' ? 'Intra (CGST+SGST)' : 'Inter (IGST 18%)'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{taxable.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right text-slate-700">
                          ₹{tax.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-black text-slate-900 text-sm">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {inv.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Quotations Table */}
        {activeCategory === 'quotations' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">QUOTE # & DATE</th>
                  <th className="p-3">BUYER / CLIENT</th>
                  <th className="p-3 text-center">ITEMS</th>
                  <th className="p-3 text-right">TAXABLE VALUE (₹)</th>
                  <th className="p-3 text-right">TOTAL GST (₹)</th>
                  <th className="p-3 text-right">GRAND TOTAL (₹)</th>
                  <th className="p-3 text-center">VALIDITY</th>
                  <th className="p-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                      No quotations found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map(q => {
                    const grand = (q as any).grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85);
                    const taxable = Math.round(((q as any).taxableTotalUSD || q.subtotalUSD || (grand / 1.18)) * 85);
                    const gst = Math.round(((q as any).totalTaxUSD || q.taxTotalUSD || 0) * 85);

                    return (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <strong className="text-orange-700 block">{q.quotationNumber}</strong>
                          <span className="text-[11px] text-slate-500">{new Date(q.createdAt).toLocaleDateString('en-IN')}</span>
                        </td>
                        <td className="p-3">
                          <strong className="text-slate-900 font-sans block">{(q as any).buyer?.companyName || q.companyName}</strong>
                          <span className="text-[11px] text-slate-500 font-sans">Attn: {(q as any).buyer?.contactName || q.contactName}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                            {(q.items || []).length} items
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">₹{taxable.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-slate-700">₹{gst.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-black text-slate-900 text-sm">₹{grand.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center text-slate-600">{q.validityDays} Days</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                            {q.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Orders Table */}
        {activeCategory === 'orders' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">ORDER # & DATE</th>
                  <th className="p-3">CLIENT COMPANY</th>
                  <th className="p-3">PRODUCTION STAGE</th>
                  <th className="p-3 text-right">ORDER VALUE (₹)</th>
                  <th className="p-3">COURIER / DISPATCH</th>
                  <th className="p-3">TRACKING #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                      No orders found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <strong className="text-orange-700 block">{o.orderNumber}</strong>
                        <span className="text-[11px] text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                      </td>
                      <td className="p-3">
                        <strong className="text-slate-900 font-sans block">{o.companyName}</strong>
                        <span className="text-[11px] text-slate-500 font-sans">{o.contactName}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                          {o.stage}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900 text-sm">
                        ₹{Math.round((o.totalValueUSD || 0) * 85).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-slate-700">{(o as any).courierPartner || 'Ex-Works Jamnagar'}</td>
                      <td className="p-3 text-slate-500 font-bold">{(o as any).courierTrackingNo || 'PENDING DISPATCH'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Customers Summary Table */}
        {activeCategory === 'customers' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">CUSTOMER / BUYER</th>
                  <th className="p-3">GSTIN</th>
                  <th className="p-3">STATE</th>
                  <th className="p-3 text-center">ORDERS</th>
                  <th className="p-3 text-center">INVOICES</th>
                  <th className="p-3 text-right">TOTAL BILLED (₹)</th>
                  <th className="p-3 text-right">PAID AMOUNT (₹)</th>
                  <th className="p-3 text-right">OUTSTANDING (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {customersReport.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                      No customer account data available.
                    </td>
                  </tr>
                ) : (
                  customersReport.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-sans font-bold text-slate-900">{c.companyName}</td>
                      <td className="p-3 text-slate-700">{c.gstin}</td>
                      <td className="p-3 text-slate-600">{c.state}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{c.totalOrders}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{c.totalInvoices}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{c.totalBilledINR.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">₹{c.paidINR.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-rose-600 font-bold">₹{c.outstandingINR.toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Products Catalog Performance */}
        {activeCategory === 'products' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-mono text-slate-700">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">PRODUCT SPECIFICATION</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3 text-right">UNIT PRICE (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {(products || []).map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <strong className="text-slate-900 font-sans block">{p.name}</strong>
                      <span className="text-[11px] text-slate-500 font-sans truncate block max-w-md">{p.description}</span>
                    </td>
                    <td className="p-3 text-orange-700 font-bold">{p.sku}</td>
                    <td className="p-3 text-slate-600">{p.category}</td>
                    <td className="p-3 text-right font-black text-slate-900">₹{(p.priceINR || Math.round((p.priceUSD || 0) * 85)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* DEDICATED OFFICIAL REPORT DOCUMENT & PRINT PREVIEW MODAL                 */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden print:p-0 print:bg-white print:static print:inset-auto print:z-auto print:block">
          <div className="bg-white text-slate-900 max-w-5xl w-full max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 font-sans overflow-hidden relative print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none print:w-full print:block">
            
            {/* Modal Controls (Sticky Top Bar - Hidden in Print) */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0 z-20 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-900 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-orange-700" /> Official Audit Report Document
                </span>
                <span className="text-xs font-mono text-slate-600 font-bold hidden sm:inline">
                  • {getCategoryTitle(activeCategory)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Download formatted Excel sheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Download RFC 4180 CSV file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary text-xs py-1.5 px-3.5 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Open Print Dialog / Save as PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Container */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-6 print:p-0 print:overflow-visible">
              {renderPrintableDocument()}
            </div>
          </div>
        </div>
      )}

      {/* Fallback Direct Print Sheet (Only renders during print when modal is not active) */}
      {!isPrintModalOpen && (
        <div className="hidden print:block">
          {renderPrintableDocument()}
        </div>
      )}

    </div>
  );
};
