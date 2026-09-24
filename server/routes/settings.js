import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET company settings
router.get('/company', (req, res) => {
  const settings = db.get('settings', {});
  res.json({ success: true, data: settings });
});

// PUT company settings
router.put('/company', (req, res) => {
  const current = db.get('settings', {});
  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  db.set('settings', updated);
  res.json({ success: true, message: 'Settings saved', data: updated });
});

// GET audit logs
router.get('/audit-logs', (req, res) => {
  let logs = db.get('audit_logs', []);
  if (!Array.isArray(logs)) logs = [];
  res.json({ success: true, count: logs.length, data: logs });
});

// POST audit log
router.post('/audit-logs', (req, res) => {
  const log = db.insert('audit_logs', {
    ...req.body,
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ success: true, message: 'Audit log written', data: log });
});

export default router;
