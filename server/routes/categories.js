import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  let categories = db.get('categories', []);
  if (!Array.isArray(categories)) categories = [];
  res.json({ success: true, count: categories.length, data: categories });
});

router.post('/', (req, res) => {
  const newCat = db.insert('categories', req.body);
  res.status(201).json({ success: true, message: 'Category created', data: newCat });
});

router.put('/:id', (req, res) => {
  const updated = db.update('categories', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category updated', data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.delete('categories', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
