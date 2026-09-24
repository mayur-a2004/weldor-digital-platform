import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  let banners = db.get('banners', []);
  if (!Array.isArray(banners)) banners = [];
  const sorted = [...banners].sort((a, b) => ((a && a.displayOrder) || 0) - ((b && b.displayOrder) || 0));
  res.json({ success: true, count: sorted.length, data: sorted });
});

router.post('/', (req, res) => {
  const newBanner = db.insert('banners', req.body);
  res.status(201).json({ success: true, message: 'Banner created', data: newBanner });
});

router.put('/:id', (req, res) => {
  const updated = db.update('banners', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, message: 'Banner updated', data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.delete('banners', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, message: 'Banner deleted' });
});

router.post('/reorder', (req, res) => {
  const { bannerIds } = req.body;
  if (!Array.isArray(bannerIds)) {
    return res.status(400).json({ success: false, message: 'bannerIds array required' });
  }

  let banners = db.get('banners', []);
  if (!Array.isArray(banners)) banners = [];
  const updated = banners.map((b) => {
    if (!b) return b;
    const order = bannerIds.indexOf(b.id);
    return order !== -1 ? { ...b, displayOrder: order + 1 } : b;
  });

  db.set('banners', updated);
  res.json({ success: true, message: 'Banners reordered', data: updated });
});

export default router;
