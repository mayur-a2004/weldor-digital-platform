import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET company settings
router.get('/company', async (req, res) => {
  try {
    const settings = await db.get('settings', {});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: err.message });
  }
});

// PUT company settings
router.put('/company', async (req, res) => {
  try {
    const current = await db.get('settings', {});
    const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
    await db.set('settings', updated);
    res.json({ success: true, message: 'Settings saved', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save settings', error: err.message });
  }
});

// GET audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    let logs = await db.get('auditlogs', []);
    if (!Array.isArray(logs)) logs = [];
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error: err.message });
  }
});

// POST audit log
router.post('/audit-logs', async (req, res) => {
  try {
    const log = await db.insert('auditlogs', {
      ...req.body,
      timestamp: new Date().toISOString(),
    });
    res.status(201).json({ success: true, message: 'Audit log written', data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to write audit log', error: err.message });
  }
});

export default router;
