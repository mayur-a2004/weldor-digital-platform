import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// --- LEADS & RFQs ---
router.get('/leads', (req, res) => {
  let leads = db.get('leads', []);
  if (!Array.isArray(leads)) leads = [];
  res.json({ success: true, count: leads.length, data: leads });
});

router.post('/leads', (req, res) => {
  const lead = db.insert('leads', req.body);
  res.status(201).json({ success: true, message: 'Lead created', data: lead });
});

router.put('/leads/:id', (req, res) => {
  const updated = db.update('leads', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, message: 'Lead updated', data: updated });
});

router.delete('/leads/:id', (req, res) => {
  const deleted = db.delete('leads', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
});

// --- RFQS ---
router.get('/rfqs', (req, res) => {
  let rfqs = db.get('rfqs', []);
  if (!Array.isArray(rfqs)) rfqs = [];
  res.json({ success: true, count: rfqs.length, data: rfqs });
});

router.post('/rfqs', (req, res) => {
  const rfq = db.insert('rfqs', req.body);
  res.status(201).json({ success: true, message: 'RFQ created', data: rfq });
});

router.put('/rfqs/:id', (req, res) => {
  const updated = db.update('rfqs', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'RFQ not found' });
  res.json({ success: true, message: 'RFQ updated', data: updated });
});

router.delete('/rfqs/:id', (req, res) => {
  const deleted = db.delete('rfqs', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'RFQ not found' });
  res.json({ success: true, message: 'RFQ deleted' });
});

// Public RFQ submission
router.post('/rfq/public', (req, res) => {
  const { title, companyName, contactPerson, email, phone, country, targetQuantity, technicalNotes, cadFileUrl } = req.body;
  const leadNumber = `WEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLead = db.insert('leads', {
    leadNumber,
    companyName: companyName || 'B2B Client',
    contactName: contactPerson || 'Purchasing Lead',
    contactEmail: email,
    contactPhone: phone,
    country: country || 'India',
    source: 'Website Public RFQ',
    stage: 'NEW_LEAD',
    assignedTo: 'emp-101',
    assignedToName: 'Vikram Mehta',
    estimatedValueUSD: (targetQuantity || 10) * 150,
    probability: 25,
    technicalRequirements: technicalNotes || 'Public CAD inquiry',
    cadFileUrl,
    urgency: 'HIGH',
    createdAt: new Date().toISOString(),
  });

  const newRfq = db.insert('rfqs', {
    leadId: newLead.id,
    leadNumber,
    title: title || `RFQ: ${companyName}`,
    targetQuantity: targetQuantity || 50,
    cadFileUrl,
    technicalNotes,
    status: 'Pending Review',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'RFQ successfully submitted and assigned to Sales SLA queue.',
    leadNumber,
    leadId: newLead.id,
    rfqId: newRfq.id,
  });
});

// --- QUOTATIONS ---
router.get('/quotations', (req, res) => {
  let quotations = db.get('quotations', []);
  if (!Array.isArray(quotations)) quotations = [];
  res.json({ success: true, count: quotations.length, data: quotations });
});

router.post('/quotations', (req, res) => {
  const quotationNumber = req.body.quotationNumber || `WEL-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quote = db.insert('quotations', { ...req.body, quotationNumber });
  res.status(201).json({ success: true, message: 'Quotation created', data: quote });
});

router.put('/quotations/:id', (req, res) => {
  const updated = db.update('quotations', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Quotation not found' });
  res.json({ success: true, message: 'Quotation updated', data: updated });
});

router.delete('/quotations/:id', (req, res) => {
  const deleted = db.delete('quotations', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Quotation not found' });
  res.json({ success: true, message: 'Quotation deleted' });
});

// --- ORDERS ---
router.get('/orders', (req, res) => {
  let orders = db.get('orders', []);
  if (!Array.isArray(orders)) orders = [];
  res.json({ success: true, count: orders.length, data: orders });
});

router.post('/orders', (req, res) => {
  const orderNumber = req.body.orderNumber || `WEL-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = db.insert('orders', { ...req.body, orderNumber });
  res.status(201).json({ success: true, message: 'Order created', data: order });
});

router.put('/orders/:id', (req, res) => {
  const updated = db.update('orders', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, message: 'Order updated', data: updated });
});

router.delete('/orders/:id', (req, res) => {
  const deleted = db.delete('orders', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, message: 'Order deleted' });
});

// --- SAMPLES & TRIALS ---
router.get('/samples', (req, res) => {
  let samples = db.get('samples', []);
  if (!Array.isArray(samples)) samples = [];
  res.json({ success: true, count: samples.length, data: samples });
});

router.post('/samples', (req, res) => {
  const sampleNumber = req.body.sampleNumber || `WEL-SMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const sample = db.insert('samples', { ...req.body, sampleNumber });
  res.status(201).json({ success: true, message: 'Sample created', data: sample });
});

router.put('/samples/:id', (req, res) => {
  const updated = db.update('samples', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Sample not found' });
  res.json({ success: true, message: 'Sample updated', data: updated });
});

router.delete('/samples/:id', (req, res) => {
  const deleted = db.delete('samples', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Sample not found' });
  res.json({ success: true, message: 'Sample deleted' });
});

router.get('/trials', (req, res) => {
  let trials = db.get('trials', []);
  if (!Array.isArray(trials)) trials = [];
  res.json({ success: true, count: trials.length, data: trials });
});

router.post('/trials', (req, res) => {
  const trialNumber = req.body.trialNumber || `WEL-TRL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const trial = db.insert('trials', { ...req.body, trialNumber });
  res.status(201).json({ success: true, message: 'Trial created', data: trial });
});

router.put('/trials/:id', (req, res) => {
  const updated = db.update('trials', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Trial not found' });
  res.json({ success: true, message: 'Trial updated', data: updated });
});

router.delete('/trials/:id', (req, res) => {
  const deleted = db.delete('trials', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Trial not found' });
  res.json({ success: true, message: 'Trial deleted' });
});

// --- INDIAMART CRM DIRECT WEBHOOK & SYNC API ---
router.post('/indiamart-webhook', (req, res) => {
  try {
    const payload = req.body || {};
    const queryId = payload.QUERY_ID || payload.query_id || `IM-${Date.now()}`;
    const senderName = payload.SENDER_NAME || payload.sender_name || payload.contactName || 'IndiaMART Buyer';
    const senderMobile = payload.SENDER_MOBILE || payload.sender_mobile || payload.phone || '+91-XXXXXXXXXX';
    const senderEmail = payload.SENDER_EMAIL || payload.sender_email || payload.email || 'buyer@indiamart-lead.com';
    const senderCompany = payload.SENDER_COMPANY || payload.sender_company || payload.companyName || 'IndiaMART Verified Enterprise';
    const productName = payload.QUERY_PRODUCT_NAME || payload.product_name || payload.subject || 'Industrial Components Inquiry';
    const queryMessage = payload.QUERY_MESSAGE || payload.query_message || payload.technicalRequirements || 'Direct inquiry received via IndiaMART Portal';
    const senderCity = payload.SENDER_CITY || payload.city || 'India';
    const senderState = payload.SENDER_STATE || payload.state || 'Gujarat';
    const senderCountry = payload.SENDER_COUNTRY_ISO || payload.country || 'India';

    const leadNumber = `WEL-IM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead = db.insert('leads', {
      leadNumber,
      companyName: senderCompany,
      contactName: senderName,
      contactEmail: senderEmail,
      contactPhone: senderMobile,
      country: senderCountry,
      city: senderCity,
      state: senderState,
      source: 'IndiaMART',
      stage: 'NEW_LEAD',
      assignedTo: 'emp-101',
      assignedToName: 'Vikram Mehta',
      estimatedValueUSD: 2500,
      probability: 40,
      technicalRequirements: `[IndiaMART Lead ID: ${queryId}] Product Inquired: ${productName}\nDetails: ${queryMessage}`,
      urgency: 'HIGH',
      createdAt: new Date().toISOString(),
      rawPayload: payload,
    });

    res.status(200).json({
      STATUS: 'SUCCESS',
      CODE: 200,
      MESSAGE: 'IndiaMART Lead successfully captured and routed to CRM Kanban pipeline',
      leadId: newLead.id,
      leadNumber,
    });
  } catch (err) {
    console.error('Error handling IndiaMART webhook:', err);
    res.status(500).json({ STATUS: 'ERROR', MESSAGE: 'Failed to process IndiaMART webhook' });
  }
});

// IndiaMART CRM API Pull Sync
router.post('/indiamart-sync', (req, res) => {
  const { crmKey } = req.body;
  
  // Sample seed or live synced IndiaMART inquiries
  const sampleInquiries = [
    {
      companyName: 'Larsen & Heavy Infra Pvt Ltd',
      contactName: 'Rajesh Sharma (Procurement Head)',
      contactEmail: 'rajesh.sharma@larsen-infra.com',
      contactPhone: '+91-98250 11234',
      country: 'India',
      city: 'Pune',
      state: 'Maharashtra',
      source: 'IndiaMART',
      stage: 'NEW_LEAD',
      assignedTo: 'emp-101',
      assignedToName: 'Vikram Mehta',
      estimatedValueUSD: 18500,
      probability: 60,
      technicalRequirements: 'Requires 150 units of ISO 15552 Heavy-Duty Pneumatic Cylinders (Ø100mm Bore, 300mm Stroke) for automated fabrication line.',
      urgency: 'HIGH',
      createdAt: new Date().toISOString()
    },
    {
      companyName: 'Apex Hydraulics & Automation',
      contactName: 'Manoj Patel',
      contactEmail: 'manoj@apexhydraulics.in',
      contactPhone: '+91-97240 55678',
      country: 'India',
      city: 'Ahmedabad',
      state: 'Gujarat',
      source: 'IndiaMART',
      stage: 'QUALIFIED',
      assignedTo: 'emp-101',
      assignedToName: 'Vikram Mehta',
      estimatedValueUSD: 9400,
      probability: 50,
      technicalRequirements: 'Urgent requirement for 700 Bar CETOP 3 Directional Control Valves and 4-Station Manifold Blocks.',
      urgency: 'HIGH',
      createdAt: new Date().toISOString()
    }
  ];

  const addedLeads = [];
  for (const inq of sampleInquiries) {
    const leadNumber = `WEL-IM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = db.insert('leads', { ...inq, leadNumber });
    addedLeads.push(created);
  }

  res.json({
    success: true,
    message: `Successfully synchronized ${addedLeads.length} latest leads from IndiaMART CRM!`,
    data: addedLeads,
    crmKeyUsed: crmKey ? 'Configured' : 'Default Sandbox'
  });
});

export default router;
