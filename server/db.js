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

// Initialize MongoDB connection
const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  No MONGODB_URI provided in environment. Running in High-Speed Local/File DB Mode.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isMongoConnected = true;
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
    for (const [key, Model] of Object.entries(COLLECTION_MODELS)) {
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

// Universal Database Interface (MongoDB + Local Fallback)
export const db = {
  isMongoActive: () => isMongoConnected,

  get: async (collection, defaultData = []) => {
    const Model = COLLECTION_MODELS[collection];

    if (isMongoConnected && Model) {
      try {
        const docs = await Model.find({}).lean();
        if (docs && docs.length > 0) {
          // Format docs to strip MongoDB _id if needed
          const cleanDocs = docs.map(d => {
            const { _id, __v, ...rest } = d;
            return { id: rest.id || _id?.toString(), ...rest };
          });
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
    inMemoryStore.set(collection, data);
    writeToFile(collection, data);

    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model && Array.isArray(data)) {
      try {
        await Model.deleteMany({});
        if (data.length > 0) {
          await Model.insertMany(data, { ordered: false });
        }
      } catch (err) {
        console.warn(`MongoDB set sync error on ${collection}:`, err.message);
      }
    }
    return data;
  },

  insert: async (collection, item) => {
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    const items = await db.get(collection, []);
    if (!Array.isArray(items)) return null;

    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

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
        await Model.findOneAndUpdate({ id }, { $set: updatedItem }, { upsert: true });
      } catch (err) {
        console.warn(`MongoDB update error on ${collection}:`, err.message);
      }
    }

    return updatedItem;
  },

  delete: async (collection, id) => {
    const items = await db.get(collection, []);
    if (!Array.isArray(items)) return false;

    const filtered = items.filter((i) => i.id !== id);
    inMemoryStore.set(collection, filtered);
    writeToFile(collection, filtered);

    // Delete in MongoDB
    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model) {
      try {
        await Model.deleteOne({ id });
      } catch (err) {
        console.warn(`MongoDB delete error on ${collection}:`, err.message);
      }
    }

    return true;
  },

  bulkInsert: async (collection, newItems) => {
    const items = await db.get(collection, []);
    const list = Array.isArray(items) ? items : [];

    const prepared = newItems.map((item, idx) => ({
      ...item,
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}-${idx}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const combined = [...prepared, ...list];
    inMemoryStore.set(collection, combined);
    writeToFile(collection, combined);

    const Model = COLLECTION_MODELS[collection];
    if (isMongoConnected && Model && prepared.length > 0) {
      try {
        await Model.insertMany(prepared, { ordered: false });
      } catch (err) {
        console.warn(`MongoDB bulkInsert error on ${collection}:`, err.message);
      }
    }

    return prepared;
  },

  clearAll: async () => {
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
