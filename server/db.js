import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COLLECTION_MODELS } from './models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUNDLED_DATA_DIR = path.join(__dirname, 'data');
const inMemoryStore = new Map();
let isMongoConnected = false;
let mongoConnectPromise = null;

// Initialize MongoDB connection
const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  No MONGODB_URI provided in environment. Running in High-Speed Local/File DB Mode.');
    return;
  }

  try {
    mongoConnectPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    await mongoConnectPromise;
    isMongoConnected = mongoose.connection.readyState === 1;
    console.log('=======================================================');
    console.log('🍃 MongoDB Atlas Database Connected Successfully!');
    console.log('=======================================================');

    // Auto-seed initial official catalog data if MongoDB collections are empty
    await autoSeedFromLocalData();
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️  MongoDB Connection Notice:', err.message);
    console.log('🔄 Seamless fallback active: Local persistent cache is maintaining 100% uptime.');
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('🍃 MongoDB connected.');
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('⚠️  MongoDB disconnected. Using in-memory & file storage fallback.');
});

// Auto-seed collections from bundled JSON files into MongoDB
const autoSeedFromLocalData = async () => {
  try {
    const ALLOWED_SEED_COLLECTIONS = ['categories', 'roles', 'settings', 'products', 'gallery', 'exhibitions', 'banners'];
    for (const [key, Model] of Object.entries(COLLECTION_MODELS)) {
      if (!ALLOWED_SEED_COLLECTIONS.includes(key)) continue;
      const count = await Model.countDocuments();
      if (count === 0) {
        const filePath = path.join(BUNDLED_DATA_DIR, `${key}.json`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content && content.trim()) {
            const data = JSON.parse(content);
            if (Array.isArray(data) && data.length > 0) {
              await Model.insertMany(data, { ordered: false }).catch(() => {});
              console.log(`🌱 Auto-seeded ${data.length} records into MongoDB collection: ${key}`);
            } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
              await Model.create({ id: `${key}-main`, ...data }).catch(() => {});
              console.log(`🌱 Auto-seeded settings document into MongoDB: ${key}`);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Auto-seed check complete:', e.message);
  }
};

// Start initial connection attempt
connectMongo();

// File fallback helper
const getFilePath = (collection) => path.join(BUNDLED_DATA_DIR, `${collection}.json`);

const readFromFile = (collection, defaultData = []) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    } catch (e) {}
    return defaultData;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content || !content.trim()) return defaultData;
    return JSON.parse(content);
  } catch (e) {
    return defaultData;
  }
};

const writeToFile = (collection, data) => {
  try {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn(`Could not persist ${collection} to file:`, e.message);
  }
};

// Universal Database Interface (MongoDB Atlas + Local Fallback)
export const ensureDbConnected = async () => {
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    isMongoConnected = false;
    return false;
  }
  try {
    if (mongoose.connection.readyState === 2 && mongoConnectPromise) {
      await mongoConnectPromise;
    } else if (mongoose.connection.readyState !== 1) {
      mongoConnectPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      await mongoConnectPromise;
    }
    isMongoConnected = mongoose.connection.readyState === 1;
    return isMongoConnected;
  } catch (err) {
    isMongoConnected = false;
    return false;
  }
};

export const db = {
  isMongoActive: () => isMongoConnected,
  ensureConnected: ensureDbConnected,

  get: async (collection, defaultData = []) => {
    await ensureDbConnected().catch(() => {});
    const Model = COLLECTION_MODELS[collection];

    if (isMongoConnected && Model) {
      try {
        const docs = await Model.find({}).sort({ createdAt: -1 }).lean();
        const cleanDocs = (docs || []).map(d => {
          const { _id, __v, ...rest } = d;
          return { id: rest.id || _id?.toString(), ...rest };
        });

        if (collection === 'settings') {
          const settingDoc = cleanDocs.find(d => d.id === 'settings-main') || cleanDocs[0];
          if (settingDoc) {
            inMemoryStore.set(collection, settingDoc);
            return settingDoc;
          }
        } else {
          // Valid MongoDB query executed: Even if array is empty (user deleted all items), return cleanDocs!
          inMemoryStore.set(collection, cleanDocs);
          return cleanDocs;
        }
      } catch (err) {
        console.warn(`MongoDB fetch fallback for ${collection}:`, err.message);
      }
    }

    // In-memory or file fallback
    if (inMemoryStore.has(collection)) {
      return inMemoryStore.get(collection);
    }
    const fileData = readFromFile(collection, defaultData);
    inMemoryStore.set(collection, fileData);
    return fileData;
  },

  set: async (collection, data) => {
    await ensureDbConnected().catch(() => {});
    inMemoryStore.set(collection, data);
    writeToFile(collection, data);

    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model) {
      try {
        if (Array.isArray(data)) {
          await Model.deleteMany({});
          if (data.length > 0) {
            await Model.insertMany(data, { ordered: false });
          }
        } else if (data && typeof data === 'object') {
          await Model.findOneAndUpdate(
            { id: `${collection}-main` },
            { $set: { id: `${collection}-main`, ...data } },
            { upsert: true }
          );
        }
      } catch (err) {
        console.warn(`MongoDB set sync error on ${collection}:`, err.message);
      }
    }
    return data;
  },

  insert: async (collection, item) => {
    await ensureDbConnected().catch(() => {});
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update in-memory & file
    const items = await db.get(collection, []);
    const list = Array.isArray(items) ? items : [];
    list.unshift(newItem);
    inMemoryStore.set(collection, list);
    writeToFile(collection, list);

    // Save to MongoDB
    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model) {
      try {
        await Model.create(newItem);
      } catch (err) {
        console.warn(`MongoDB insert error on ${collection}:`, err.message);
      }
    }

    return newItem;
  },

  update: async (collection, id, updates) => {
    await ensureDbConnected().catch(() => {});
    const items = await db.get(collection, []);
    if (!Array.isArray(items)) return null;

    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      // Upsert: Item not found in current list, create it directly
      const newItem = {
        ...updates,
        id,
        createdAt: updates.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.unshift(newItem);
      inMemoryStore.set(collection, items);
      writeToFile(collection, items);

      const Model = COLLECTION_MODELS[collection];
      if (isMongoConnected && Model) {
        try {
          const query = { $or: [{ id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])] };
          await Model.findOneAndUpdate(query, { $set: newItem }, { upsert: true });
        } catch (e) {
          console.warn(`MongoDB upsert error on ${collection}:`, e.message);
        }
      }
      return newItem;
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      id, // Preserve id
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    inMemoryStore.set(collection, items);
    writeToFile(collection, items);

    // Update in MongoDB
    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model) {
      try {
        const query = { $or: [{ id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])] };
        await Model.findOneAndUpdate(query, { $set: updatedItem }, { upsert: true });
      } catch (err) {
        console.warn(`MongoDB update error on ${collection}:`, err.message);
      }
    }

    return updatedItem;
  },

  delete: async (collection, id) => {
    await ensureDbConnected().catch(() => {});
    const items = await db.get(collection, []);
    const list = Array.isArray(items) ? items : [];

    const filtered = list.filter((i) => i.id !== id);
    inMemoryStore.set(collection, filtered);
    writeToFile(collection, filtered);

    // Delete in MongoDB
    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model) {
      try {
        const query = { $or: [{ id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])] };
        await Model.deleteMany(query);
      } catch (err) {
        console.warn(`MongoDB delete error on ${collection}:`, err.message);
      }
    }

    return true;
  },

  bulkUpsert: async (collection, incomingItems) => {
    await ensureDbConnected().catch(() => {});
    const Model = COLLECTION_MODELS[collection];
    const existingList = await db.get(collection, []);
    const currentList = Array.isArray(existingList) ? [...existingList] : [];

    // Map existing items for fast deduplication lookup
    const existingMap = new Map();
    currentList.forEach(item => {
      if (item.id) existingMap.set(String(item.id).trim(), item);
      if (item.sku) existingMap.set(String(item.sku).trim().toUpperCase(), item);
      if (item.name) existingMap.set(String(item.name).trim().toLowerCase(), item);
    });

    const preparedItems = [];
    const mongoOps = [];
    const now = new Date().toISOString();

    for (let idx = 0; idx < incomingItems.length; idx++) {
      const raw = incomingItems[idx];
      if (!raw) continue;

      const rawSku = raw.sku ? String(raw.sku).trim() : '';
      const normSku = rawSku.toUpperCase();
      const rawName = raw.name ? String(raw.name).trim() : '';
      const normName = rawName.toLowerCase();
      const rawId = raw.id ? String(raw.id).trim() : '';

      const matchedExisting = (rawId && existingMap.get(rawId)) ||
                              (normSku && existingMap.get(normSku)) ||
                              (normName && existingMap.get(normName));

      const itemId = matchedExisting ? matchedExisting.id : (rawId || `${collection.slice(0, 4)}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`);

      const mergedItem = {
        ...(matchedExisting || {}),
        ...raw,
        id: itemId,
        sku: rawSku || (matchedExisting && matchedExisting.sku) || '',
        name: rawName || (matchedExisting && matchedExisting.name) || '',
        createdAt: matchedExisting?.createdAt || raw.createdAt || now,
        updatedAt: now,
      };

      preparedItems.push(mergedItem);

      // Update index map so duplicates within the same batch match the same item
      if (mergedItem.id) existingMap.set(String(mergedItem.id).trim(), mergedItem);
      if (mergedItem.sku) existingMap.set(String(mergedItem.sku).trim().toUpperCase(), mergedItem);
      if (mergedItem.name) existingMap.set(String(mergedItem.name).trim().toLowerCase(), mergedItem);

      if (isMongoConnected && Model) {
        const filterOr = [];
        if (mergedItem.id) filterOr.push({ id: mergedItem.id });
        if (mergedItem.sku) filterOr.push({ sku: mergedItem.sku });
        if (mergedItem.name) filterOr.push({ name: mergedItem.name });

        mongoOps.push({
          updateOne: {
            filter: filterOr.length > 0 ? { $or: filterOr } : { id: itemId },
            update: { $set: mergedItem },
            upsert: true
          }
        });
      }
    }

    // Execute bulkWrite in MongoDB
    if (isMongoConnected && Model && mongoOps.length > 0) {
      try {
        await Model.bulkWrite(mongoOps, { ordered: false });
      } catch (err) {
        console.warn(`MongoDB bulkWrite on ${collection}:`, err.message);
      }
    }

    // Build the final authoritative list
    let finalList = [];
    if (isMongoConnected && Model) {
      try {
        const docs = await Model.find({}).sort({ createdAt: -1 }).lean();
        finalList = (docs || []).map(d => {
          const { _id, __v, ...rest } = d;
          return { id: rest.id || _id?.toString(), ...rest };
        });
      } catch (e) {
        finalList = Array.from(existingMap.values());
      }
    } else {
      // Memory fallback: update or append
      const dedupedMap = new Map();
      currentList.forEach(item => {
        const key = item.id || item.sku || item.name;
        if (key) dedupedMap.set(key, item);
      });
      preparedItems.forEach(item => {
        const key = item.id || item.sku || item.name;
        if (key) dedupedMap.set(key, item);
      });
      finalList = Array.from(dedupedMap.values());
    }

    inMemoryStore.set(collection, finalList);
    writeToFile(collection, finalList);

    return finalList;
  },

  bulkInsert: async (collection, newItems) => {
    return await db.bulkUpsert(collection, newItems);
  },

  clearAll: async () => {
    await ensureDbConnected().catch(() => {});
    inMemoryStore.clear();
    for (const [key, Model] of Object.entries(COLLECTION_MODELS)) {
      writeToFile(key, []);
      if (isMongoConnected && Model) {
        try {
          await Model.deleteMany({});
        } catch (e) {}
      }
    }
    return true;
  }
};
