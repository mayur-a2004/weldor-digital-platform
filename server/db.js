import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_DATA_DIR = path.join(__dirname, 'data');
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : BUNDLED_DATA_DIR;

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create DATA_DIR on startup:', e);
}

// In-memory cache for fast, reliable serverless execution
const inMemoryStore = new Map();

// Helper to get file path and ensure initial file presence
const getFilePath = (collection) => {
  const targetPath = path.join(DATA_DIR, `${collection}.json`);
  if (isVercel && !fs.existsSync(targetPath)) {
    const bundledPath = path.join(BUNDLED_DATA_DIR, `${collection}.json`);
    if (fs.existsSync(bundledPath)) {
      try {
        fs.copyFileSync(bundledPath, targetPath);
      } catch (e) {
        // Fallback to memory
      }
    }
  }
  return targetPath;
};

export const db = {
  get: (collection, defaultData = []) => {
    // Check in-memory store first
    if (inMemoryStore.has(collection)) {
      const memData = inMemoryStore.get(collection);
      return Array.isArray(memData) ? [...memData] : { ...memData };
    }

    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      } catch (e) {}
      inMemoryStore.set(collection, defaultData);
      return Array.isArray(defaultData) ? [...defaultData] : { ...defaultData };
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || !content.trim()) {
        inMemoryStore.set(collection, defaultData);
        return Array.isArray(defaultData) ? [] : defaultData;
      }
      const parsed = JSON.parse(content);
      const result = parsed !== null && parsed !== undefined ? parsed : defaultData;
      inMemoryStore.set(collection, result);
      return result;
    } catch (err) {
      console.error(`Error reading ${collection}:`, err);
      inMemoryStore.set(collection, defaultData);
      return Array.isArray(defaultData) ? [] : defaultData;
    }
  },

  set: (collection, data) => {
    inMemoryStore.set(collection, data);
    try {
      const filePath = getFilePath(collection);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn(`Could not persist ${collection} to disk, stored in memory:`, e);
    }
    return data;
  },

  insert: (collection, item) => {
    const items = db.get(collection, []);
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
    };
    const list = Array.isArray(items) ? items : [];
    list.unshift(newItem);
    db.set(collection, list);
    return newItem;
  },

  update: (collection, id, updates) => {
    const items = db.get(collection, []);
    if (!Array.isArray(items)) return null;
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    db.set(collection, items);
    return items[index];
  },

  delete: (collection, id) => {
    const items = db.get(collection, []);
    if (!Array.isArray(items)) return false;
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    db.set(collection, filtered);
    return true;
  },

  clearAll: () => {
    const collections = [
      'products',
      'categories',
      'exhibitions',
      'banners',
      'gallery',
      'leads',
      'rfqs',
      'samples',
      'trials',
      'quotations',
      'orders',
      'employees',
      'payrolls',
      'attendance',
      'leaves',
      'audit_logs',
      'roles',
    ];
    for (const c of collections) {
      db.set(c, []);
    }
    db.set('settings', {
      companyName: 'Weldor by Earth Metal Industries',
      brandName: 'WELDOR',
      legalName: 'Earth Metal Industries',
      cinNumber: '',
      gstin: '24AABCE1234F1Z5',
      panNumber: 'AABCE1234F',
      iecCode: '0812345678',
      msmeRegistrationNo: 'UDYAM-GJ-15-0012345',
      registeredOfficeAddress: {
        addressLine1: '588, G.I.D.C., Phase 2',
        addressLine2: 'Dared',
        city: 'Jamnagar',
        state: 'Gujarat',
        country: 'India',
        pincode: '361004',
      },
      primaryEmail: 'info@weldorindustries.com',
      primaryPhone: '+91 87800 98088',
      websiteUrl: 'https://weldorindustries.com',
      bankAccounts: [],
      slaSettings: {
        leadResponseHours: 2,
        quoteApprovalThresholdUSD: 50000,
        autoAssignSalesLead: true,
        enableWhatsAppNotifications: true,
        enablePayrollReminderDays: 5,
      },
    });
    console.log('🧹 All database collections wiped completely clean.');
  },
};
