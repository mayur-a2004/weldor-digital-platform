import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function wipe() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const collections = [
    'products', 'categories', 'leads', 'rfqs', 'quotations',
    'orders', 'invoices', 'samples', 'trials', 'exhibitions',
    'gallery', 'banners', 'payrolls', 'attendances', 'leaves', 'auditlogs'
  ];

  for (const name of collections) {
    try {
      const res = await db.collection(name).deleteMany({});
      console.log(`Cleared ${name}: deleted ${res.deletedCount} docs`);
    } catch (e) {
      console.log(`Collection ${name}: ${e.message}`);
    }
  }

  try {
    const empRes = await db.collection('employees').deleteMany({ email: { $ne: 'admin@weldorindustries.com' } });
    console.log(`Cleared non-admin employees: deleted ${empRes.deletedCount} docs`);
  } catch (e) {
    console.log(`Employees: ${e.message}`);
  }

  console.log('✅ MongoDB wipe completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

wipe().catch(err => {
  console.error('Wipe error:', err);
  process.exit(1);
});
