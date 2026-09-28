import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, search, industry } = req.query;
    let products = await db.get('products', []);
    if (!Array.isArray(products)) products = [];

    if (category && category !== 'All') {
      products = products.filter((p) => p && (p.category === category || p.categoryId === category));
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
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    let products = await db.get('products', []);
    if (!Array.isArray(products)) products = [];
    const product = products.find((p) => p && p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: err.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const newProduct = await db.insert('products', req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: err.message });
  }
});

// POST bulk create products
router.post('/bulk', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.products || []);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No products provided for bulk import' });
    }

    const inserted = await db.bulkInsert('products', items);

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
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('products', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully in database', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('products', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully from database' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
});

export default router;
