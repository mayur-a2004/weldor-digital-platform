import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// --- LEADS & RFQs ---
router.get('/leads', async (req, res) => {
  try {
    let leads = await db.get('leads', []);
    if (!Array.isArray(leads)) leads = [];
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads', error: err.message });
  }
});

router.post('/leads', async (req, res) => {
  try {
    const lead = await db.insert('leads', req.body);
    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create lead', error: err.message });
  }
});

router.put('/leads/:id', async (req, res) => {
  try {
    const updated = await db.update('leads', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update lead', error: err.message });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    const deleted = await db.delete('leads', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete lead', error: err.message });
  }
});

// --- RFQS ---
router.get('/rfqs', async (req, res) => {
  try {
    let rfqs = await db.get('rfqs', []);
    if (!Array.isArray(rfqs)) rfqs = [];
    res.json({ success: true, count: rfqs.length, data: rfqs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch rfqs', error: err.message });
  }
});

router.post('/rfqs', async (req, res) => {
  try {
    const rfq = await db.insert('rfqs', req.body);
    res.status(201).json({ success: true, message: 'RFQ created', data: rfq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create rfq', error: err.message });
  }
});

router.put('/rfqs/:id', async (req, res) => {
  try {
    const updated = await db.update('rfqs', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, message: 'RFQ updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update rfq', error: err.message });
  }
});

router.delete('/rfqs/:id', async (req, res) => {
  try {
    const deleted = await db.delete('rfqs', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, message: 'RFQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete rfq', error: err.message });
  }
});

// Public RFQ submission
router.post('/rfq/public', async (req, res) => {
  try {
    const { 
      title, 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      country, 
      categoryName,
      materialPreference,
      pressureRating,
      requirementType,
      targetQuantity, 
      targetUnit,
      technicalNotes, 
      cadFileUrl,
      drawingFileName
    } = req.body;
    const leadNumber = `WEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead = await db.insert('leads', {
      leadNumber,
      companyName: companyName || 'B2B Client',
      contactName: contactPerson || 'Purchasing Lead',
      contactEmail: email,
      contactPhone: phone,
      country: country || 'India',
      source: 'Website Public RFQ',
      stage: 'NEW_LEAD',
      assignedTo: 'emp-admin',
      assignedToName: 'Super Admin',
      estimatedValueUSD: (targetQuantity || 10) * 150,
      probability: 25,
      technicalRequirements: technicalNotes || 'Public CAD inquiry',
      cadFileUrl,
      urgency: 'HIGH',
      createdAt: new Date().toISOString(),
    });

    const newRfq = await db.insert('rfqs', {
      leadId: newLead.id,
      leadNumber,
      title: title || `RFQ: ${companyName || 'Inbound Inquiry'}`,
      companyName: companyName || 'B2B Client',
      contactPerson: contactPerson || 'Purchasing Lead',
      email: email || '',
      phone: phone || '',
      country: country || 'India',
      categoryName: categoryName || 'Pneumatic Automation',
      materialPreference: materialPreference || 'Standard ISO Spec',
      pressureRating: pressureRating || 'Standard ISO',
      requirementType: requirementType || 'Custom OEM Drawing',
      targetQuantity: Number(targetQuantity) || 50,
      targetUnit: targetUnit || 'PCS',
      cadFileUrl: cadFileUrl || '',
      drawingFileName: drawingFileName || '',
      technicalNotes: technicalNotes || '',
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'RFQ successfully submitted and assigned to Sales SLA queue.',
      leadNumber,
      leadId: newLead.id,
      rfqId: newRfq.id,
      data: newRfq
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Public RFQ failed', error: err.message });
  }
});

// --- QUOTATIONS ---
router.get('/quotations', async (req, res) => {
  try {
    let quotations = await db.get('quotations', []);
    if (!Array.isArray(quotations)) quotations = [];
    res.json({ success: true, count: quotations.length, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch quotations', error: err.message });
  }
});

router.post('/quotations', async (req, res) => {
  try {
    const quotation = await db.insert('quotations', req.body);
    res.status(201).json({ success: true, message: 'Quotation created', data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create quotation', error: err.message });
  }
});

router.put('/quotations/:id', async (req, res) => {
  try {
    const updated = await db.update('quotations', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, message: 'Quotation updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update quotation', error: err.message });
  }
});

router.delete('/quotations/:id', async (req, res) => {
  try {
    const deleted = await db.delete('quotations', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, message: 'Quotation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete quotation', error: err.message });
  }
});

// --- INVOICES ---
router.get('/invoices', async (req, res) => {
  try {
    let invoices = await db.get('invoices', []);
    if (!Array.isArray(invoices)) invoices = [];
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices', error: err.message });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const invoice = await db.insert('invoices', req.body);
    res.status(201).json({ success: true, message: 'Invoice created', data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create invoice', error: err.message });
  }
});

router.put('/invoices/:id', async (req, res) => {
  try {
    const updated = await db.update('invoices', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update invoice', error: err.message });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    const deleted = await db.delete('invoices', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete invoice', error: err.message });
  }
});

// --- ORDERS ---
router.get('/orders', async (req, res) => {
  try {
    let orders = await db.get('orders', []);
    if (!Array.isArray(orders)) orders = [];
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const order = await db.insert('orders', req.body);
    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const updated = await db.update('orders', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: err.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const deleted = await db.delete('orders', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: err.message });
  }
});

// --- SAMPLES & TRIALS ---
router.get('/samples', async (req, res) => {
  try {
    let samples = await db.get('samples', []);
    if (!Array.isArray(samples)) samples = [];
    res.json({ success: true, count: samples.length, data: samples });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch samples', error: err.message });
  }
});

router.post('/samples', async (req, res) => {
  try {
    const sample = await db.insert('samples', req.body);
    res.status(201).json({ success: true, message: 'Sample created', data: sample });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create sample', error: err.message });
  }
});

router.put('/samples/:id', async (req, res) => {
  try {
    const updated = await db.update('samples', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Sample not found' });
    res.json({ success: true, message: 'Sample updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update sample', error: err.message });
  }
});

router.delete('/samples/:id', async (req, res) => {
  try {
    const deleted = await db.delete('samples', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Sample not found' });
    res.json({ success: true, message: 'Sample deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete sample', error: err.message });
  }
});

router.get('/trials', async (req, res) => {
  try {
    let trials = await db.get('trials', []);
    if (!Array.isArray(trials)) trials = [];
    res.json({ success: true, count: trials.length, data: trials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch trials', error: err.message });
  }
});

router.post('/trials', async (req, res) => {
  try {
    const trial = await db.insert('trials', req.body);
    res.status(201).json({ success: true, message: 'Trial created', data: trial });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create trial', error: err.message });
  }
});

router.put('/trials/:id', async (req, res) => {
  try {
    const updated = await db.update('trials', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Trial not found' });
    res.json({ success: true, message: 'Trial updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update trial', error: err.message });
  }
});

router.delete('/trials/:id', async (req, res) => {
  try {
    const deleted = await db.delete('trials', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Trial not found' });
    res.json({ success: true, message: 'Trial deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete trial', error: err.message });
  }
});

// --- BUSINESS REPORTS & ANALYTICS ---
router.get('/reports/summary', async (req, res) => {
  try {
    const { period = 'month', startDate, endDate, type = 'all' } = req.query;
    
    // Fetch raw records from MongoDB
    const [invoices, quotations, orders, leads, products] = await Promise.all([
      db.get('invoices', []),
      db.get('quotations', []),
      db.get('orders', []),
      db.get('leads', []),
      db.get('products', [])
    ]);

    const now = new Date();
    let filterStart = new Date(0);
    let filterEnd = new Date(now.getTime() + 86400000);

    if (startDate && endDate) {
      filterStart = new Date(startDate);
      filterEnd = new Date(new Date(endDate).getTime() + 86400000);
    } else if (period === 'day') {
      filterStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      filterStart = new Date(now.getTime() - 7 * 86400000);
    } else if (period === 'month') {
      filterStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      filterStart = new Date(now.getFullYear(), 0, 1);
    }

    const isWithinRange = (dateStr) => {
      if (!dateStr) return true;
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d >= filterStart && d <= filterEnd;
    };

    const filteredInvoices = (Array.isArray(invoices) ? invoices : []).filter(inv => isWithinRange(inv.issueDate || inv.createdAt));
    const filteredQuotations = (Array.isArray(quotations) ? quotations : []).filter(q => isWithinRange(q.createdAt));
    const filteredOrders = (Array.isArray(orders) ? orders : []).filter(o => isWithinRange(o.createdAt));

    // Summary Financial Calculations
    let totalInvoiceBilledINR = 0;
    let totalTaxableINR = 0;
    let totalGstTaxINR = 0;
    let totalPaidINR = 0;
    let totalPendingINR = 0;

    filteredInvoices.forEach(inv => {
      const grandTotal = inv.grandTotalINR || Math.round((inv.grandTotalUSD || 0) * 85);
      const taxable = inv.taxableTotalUSD ? Math.round(inv.taxableTotalUSD * 85) : Math.round(grandTotal / 1.18);
      const tax = inv.totalTaxUSD ? Math.round(inv.totalTaxUSD * 85) : (grandTotal - taxable);

      totalInvoiceBilledINR += grandTotal;
      totalTaxableINR += taxable;
      totalGstTaxINR += tax;

      if (inv.status === 'Paid') {
        totalPaidINR += grandTotal;
      } else {
        totalPendingINR += grandTotal;
      }
    });

    let totalQuotedINR = 0;
    filteredQuotations.forEach(q => {
      totalQuotedINR += (q.grandTotalINR || Math.round((q.grandTotalUSD || 0) * 85));
    });

    let totalOrdersValueINR = 0;
    filteredOrders.forEach(o => {
      totalOrdersValueINR += Math.round((o.totalValueUSD || 0) * 85);
    });

    res.json({
      success: true,
      filter: { period, startDate: filterStart.toISOString(), endDate: filterEnd.toISOString() },
      metrics: {
        totalInvoicesCount: filteredInvoices.length,
        totalInvoiceBilledINR,
        totalTaxableINR,
        totalGstTaxINR,
        totalPaidINR,
        totalPendingINR,
        totalQuotationsCount: filteredQuotations.length,
        totalQuotedINR,
        totalOrdersCount: filteredOrders.length,
        totalOrdersValueINR,
        totalProductsCount: Array.isArray(products) ? products.length : 0,
        totalLeadsCount: Array.isArray(leads) ? leads.length : 0
      },
      data: {
        invoices: filteredInvoices,
        quotations: filteredQuotations,
        orders: filteredOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate report summary', error: err.message });
  }
});

export default router;
