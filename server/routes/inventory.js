import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let items = await db.get('inventory', []);
    if (!Array.isArray(items)) items = [];

    if (category && category !== 'All') {
      items = items.filter((i) => i && i.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i &&
          (i.name?.toLowerCase().includes(q) ||
            i.sku?.toLowerCase().includes(q) ||
            i.category?.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: err.message });
  }
});

// GET inventory stock logs
router.get('/logs', async (req, res) => {
  try {
    let logs = await db.get('inventory_logs', []);
    if (!Array.isArray(logs)) logs = [];
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory logs', error: err.message });
  }
});

// POST create stock log
router.post('/logs', async (req, res) => {
  try {
    const log = await db.insert('inventory_logs', req.body);
    res.status(201).json({ success: true, message: 'Stock log recorded', data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record stock log', error: err.message });
  }
});

// POST single inventory item
router.post('/', async (req, res) => {
  try {
    const newItem = await db.insert('inventory', req.body);
    res.status(201).json({ success: true, message: 'Inventory item created', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create inventory item', error: err.message });
  }
});

// POST bulk import inventory items with intelligent deduplication and atomic MongoDB sync
router.post('/bulk', async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body) ? req.body : (req.body.items || []);
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided for bulk inventory import' });
    }

    const preprocessed = [];
    const seenSkus = new Set();
    const seenNames = new Set();

    for (let idx = 0; idx < rawItems.length; idx++) {
      const raw = rawItems[idx];
      if (!raw || (!raw.name && !raw.sku)) continue;

      const rawName = String(raw.name || '').trim();
      const normName = rawName.toLowerCase();
      
      // Auto-resolve SKU if missing
      let rawSku = String(raw.sku || '').trim();
      if (!rawSku && rawName) {
        const slug = rawName
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .trim()
          .split(/\s+/)
          .slice(0, 3)
          .join('-')
          .toUpperCase();
        rawSku = slug ? `WLD-${slug}` : `WLD-ITEM-${1000 + idx}`;
      }
      const normSku = rawSku.toUpperCase();

      // Prevent duplicate rows within the same uploaded Excel file
      if (seenSkus.has(normSku) || (normName && seenNames.has(normName))) {
        continue;
      }
      seenSkus.add(normSku);
      if (normName) seenNames.add(normName);

      const curStock = Number(raw.currentStock) || 0;
      const minAlert = Number(raw.minStockAlert) || 10;
      const status = curStock <= 0 ? 'Out of Stock' : curStock <= minAlert ? 'Low Stock' : 'In Stock';

      preprocessed.push({
        ...raw,
        id: raw.id || `inv-${normSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        sku: rawSku,
        name: rawName,
        category: raw.category || 'General Spares & Consumables',
        hsnCode: raw.hsnCode || '85159000',
        unit: (['PCS', 'KG', 'MTR', 'BOX', 'SET', 'ROLL', 'PACK', 'NOS'].includes(String(raw.unit || '').toUpperCase()) ? String(raw.unit).toUpperCase() : 'PCS'),
        unitPriceINR: Number(raw.unitPriceINR) || 0,
        unitPriceUSD: Number(raw.unitPriceUSD) || (Number(raw.unitPriceINR) ? Math.round(Number(raw.unitPriceINR) / 85 * 100) / 100 : 0),
        costPriceINR: Number(raw.costPriceINR) || 0,
        gstRatePct: Number(raw.gstRatePct) || 18,
        currentStock: curStock,
        minStockAlert: minAlert,
        status,
        warehouseLocation: raw.warehouseLocation || 'Jamnagar Central Godown',
        supplierName: raw.supplierName || 'Earth Metal Industries',
        description: raw.description || rawName,
      });
    }

    // Atomic bulk upsert into MongoDB Atlas + memory + file
    const fullList = await db.bulkUpsert('inventory', preprocessed);

    res.status(201).json({
      success: true,
      message: `Successfully processed ${preprocessed.length} unique inventory items into MongoDB Atlas!`,
      count: fullList.length,
      importedCount: preprocessed.length,
      data: fullList
    });
  } catch (err) {
    console.error('Bulk inventory error:', err);
    res.status(500).json({ success: false, message: 'Bulk inventory import failed', error: err.message });
  }
});

// PUT update inventory item
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('inventory', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, message: 'Inventory item updated in database', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update inventory item', error: err.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('inventory', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, message: 'Inventory item deleted from database' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete inventory item', error: err.message });
  }
});

export default router;
