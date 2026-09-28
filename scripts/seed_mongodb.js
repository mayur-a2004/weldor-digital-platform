import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COLLECTION_MODELS } from '../server/models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../server/data');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('cluster0.weldor.mongodb.net')) {
    console.error('❌ Please provide your valid MongoDB Atlas Connection URI in .env file (MONGODB_URI).');
    process.exit(1);
  }

  console.log('=======================================================');
  console.log('🍃 Connecting to MongoDB Atlas Cluster...');
  console.log('=======================================================');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');

    for (const [key, Model] of Object.entries(COLLECTION_MODELS)) {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content && content.trim()) {
          const data = JSON.parse(content);
          await Model.deleteMany({});
          if (Array.isArray(data) && data.length > 0) {
            await Model.insertMany(data, { ordered: false });
            console.log(`📦 [${key.toUpperCase()}]: Uploaded & Synced ${data.length} records into MongoDB Atlas!`);
          } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            await Model.create({ id: `${key}-main`, ...data });
            console.log(`📦 [${key.toUpperCase()}]: Synced settings document into MongoDB Atlas!`);
          }
        }
      }
    }

    console.log('=======================================================');
    console.log('🎉 100% OF CATALOG PRODUCTS, CATEGORIES, HRMS & CMS');
    console.log('   HAVE BEEN SUCCESSFULLY MIGRATED TO MONGODB ATLAS!');
    console.log('=======================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Atlas Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
