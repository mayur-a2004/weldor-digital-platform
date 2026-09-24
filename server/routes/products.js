import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  const { category, search, industry } = req.query;
  let products = db.get('products', []);
  if (!Array.isArray(products)) products = [];

  if (category && category !== 'All') {
    products = products.filter((p) => p && p.category === category);
  }

  if (industry && industry !== 'All') {
    products = products.filter((p) => p && p.industries?.includes(industry));
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p &&
        (p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.keywords?.some((k) => k?.toLowerCase().includes(q)))
    );
  }

  res.json({ success: true, count: products.length, data: products });
});

// GET single product
router.get('/:id', (req, res) => {
  let products = db.get('products', []);
  if (!Array.isArray(products)) products = [];
  const product = products.find((p) => p && p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST create product
router.post('/', (req, res) => {
  const newProduct = db.insert('products', req.body);
  res.status(201).json({ success: true, message: 'Product created', data: newProduct });
});

// POST bulk create products
router.post('/bulk', (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.products || []);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No products provided for bulk import' });
    }

    const inserted = [];
    for (const item of items) {
      if (!item.name) continue;
      const productToSave = {
        ...item,
        status: item.status || 'Active',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const created = db.insert('products', productToSave);
      inserted.push(created);
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} products into the database!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    console.error('Bulk product import error:', err);
    res.status(500).json({ success: false, message: 'Bulk product import failed', error: err.message });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  const updated = db.update('products', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product updated', data: updated });
});

// DELETE product
router.delete('/:id', (req, res) => {
  const deleted = db.delete('products', req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

export default router;
