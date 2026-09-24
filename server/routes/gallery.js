import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { type, category } = req.query;
  let items = db.get('gallery', []);
  if (!Array.isArray(items)) items = [];

  if (type && type !== 'All') {
    items = items.filter((i) => i && i.type === type);
  }

  if (category && category !== 'All') {
    items = items.filter((i) => i && i.category === category);
  }

  res.json({ success: true, count: items.length, data: items });
});

router.post('/', (req, res) => {
  const newItem = db.insert('gallery', req.body);
  res.status(201).json({ success: true, message: 'Media item added', data: newItem });
});

// POST bulk upload media items
router.post('/bulk', (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.items || []);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No media items provided for bulk upload' });
    }

    const inserted = [];
    for (const item of items) {
      if (!item.title || !item.url) continue;
      const mediaToSave = {
        ...item,
        type: item.type || 'Photo',
        category: item.category || 'Machining Bay',
        createdAt: item.createdAt || new Date().toISOString()
      };
      const created = db.insert('gallery', mediaToSave);
      inserted.push(created);
    }

    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} media files to gallery!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    console.error('Bulk gallery import error:', err);
    res.status(500).json({ success: false, message: 'Bulk gallery import failed', error: err.message });
  }
});

router.put('/:id', (req, res) => {
  const updated = db.update('gallery', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Media item not found' });
  res.json({ success: true, message: 'Media item updated', data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.delete('gallery', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Media item not found' });
  res.json({ success: true, message: 'Media item deleted' });
});

export default router;
