import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper to evaluate dynamic status based on dates
const resolveExpoStatus = (expo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(expo.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(expo.endDate);
  end.setHours(23, 59, 59, 999);

  const isPassed = today > end;
  const isLive = today >= start && today <= end;

  let computedStatus = expo.status;
  if (isLive) {
    computedStatus = 'Live';
  } else if (isPassed && expo.autoArchivePassedDate !== false) {
    computedStatus = 'Past Exhibition';
  }

  return {
    ...expo,
    isPassed,
    isLive,
    computedStatus,
  };
};

// GET all exhibitions
router.get('/', (req, res) => {
  const { status } = req.query;
  let expos = db.get('exhibitions', []);
  if (!Array.isArray(expos)) expos = [];

  expos = expos.filter(Boolean).map(resolveExpoStatus);

  if (status && status !== 'All') {
    if (status === 'Upcoming') {
      expos = expos.filter((e) => e.computedStatus === 'Upcoming' || e.computedStatus === 'Live');
    } else if (status === 'Past') {
      expos = expos.filter((e) => e.computedStatus === 'Past Exhibition');
    }
  }

  res.json({ success: true, count: expos.length, data: expos });
});

// GET exhibition by QR slug
router.get('/slug/:slug', (req, res) => {
  let expos = db.get('exhibitions', []);
  if (!Array.isArray(expos)) expos = [];
  const expo = expos.find((e) => e && e.qrSlug === req.params.slug);
  if (!expo) {
    return res.status(404).json({ success: false, message: 'Exhibition QR slug not found' });
  }
  res.json({ success: true, data: resolveExpoStatus(expo) });
});

// POST create exhibition
router.post('/', (req, res) => {
  const newExpo = db.insert('exhibitions', {
    ...req.body,
    leadsCapturedCount: 0,
    autoArchivePassedDate: req.body.autoArchivePassedDate ?? true,
  });
  res.status(201).json({ success: true, message: 'Exhibition created', data: resolveExpoStatus(newExpo) });
});

// PUT update exhibition
router.put('/:id', (req, res) => {
  const updated = db.update('exhibitions', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Exhibition not found' });
  }
  res.json({ success: true, message: 'Exhibition updated', data: resolveExpoStatus(updated) });
});

// DELETE exhibition
router.delete('/:id', (req, res) => {
  const deleted = db.delete('exhibitions', req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Exhibition not found' });
  }
  res.json({ success: true, message: 'Exhibition deleted' });
});

export default router;
