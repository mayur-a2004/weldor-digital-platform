import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function updatePdfs() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('weldor_industrial');
  await db.collection('products').updateMany({}, {
    $set: {
      catalogPdfUrl: '/catalog/Weldor_Welding_Catalog_CDN.pdf',
      datasheetUrl: '/catalog/Weldor_Welding_Catalog_CDN.pdf'
    }
  });
  console.log('MongoDB products updated with working PDF link!');
  await client.close();

  const paths = [
    'server/data/products.json',
    'weldor-digital/server/data/products.json'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const items = JSON.parse(fs.readFileSync(p, 'utf8'));
      items.forEach(it => {
        it.catalogPdfUrl = '/catalog/Weldor_Welding_Catalog_CDN.pdf';
        it.datasheetUrl = '/catalog/Weldor_Welding_Catalog_CDN.pdf';
      });
      fs.writeFileSync(p, JSON.stringify(items, null, 2), 'utf8');
      console.log('Updated ' + p);
    }
  }
}
updatePdfs().catch(console.error);
