import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { EmployeeModel } from '../server/models/index.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const emps = JSON.parse(fs.readFileSync('./server/data/employees.json', 'utf8'));
  for (const emp of emps) {
    await EmployeeModel.findOneAndUpdate(
      { id: emp.id },
      { $set: emp },
      { upsert: true, new: true }
    );
    console.log(`✅ Synced: ${emp.name} (${emp.email})`);
  }
  console.log('🎉 All employee accounts synced to MongoDB Atlas!');
  process.exit(0);
}

run().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
