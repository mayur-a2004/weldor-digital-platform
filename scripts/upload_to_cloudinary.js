import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async () => {
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your_api_key') {
    console.error('❌ Please provide your Cloudinary credentials in .env file.');
    process.exit(1);
  }

  console.log('=======================================================');
  console.log('☁️  Uploading Catalog Photos & Certificate PDFs to Cloudinary...');
  console.log('=======================================================');

  const dirsToUpload = [
    { dir: path.join(__dirname, '../public/catalog_pages'), folder: 'weldor-catalog-pages' },
    { dir: path.join(__dirname, '../public/certificates'), folder: 'weldor-certificates' },
    { dir: path.join(__dirname, '../public/extracted_images'), folder: 'weldor-products' }
  ];

  for (const { dir, folder } of dirsToUpload) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        try {
          const res = await cloudinary.uploader.upload(fullPath, {
            folder,
            resource_type: file.endsWith('.pdf') ? 'raw' : 'auto',
            use_filename: true,
            unique_filename: false,
          });
          console.log(`✅ Uploaded [${file}]: ${res.secure_url}`);
        } catch (e) {
          console.warn(`⚠️  Upload skipped for ${file}:`, e.message);
        }
      }
    }
  }

  console.log('=======================================================');
  console.log('🎉 All Photos, Images & PDFs Uploaded to Cloudinary CDN!');
  console.log('=======================================================');
};

uploadMediaToCloudinary();
