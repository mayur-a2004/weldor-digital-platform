import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

// Configure Cloudinary with environment credentials
const getCloudinaryConfig = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ptiq7p8r',
  api_key:    process.env.CLOUDINARY_API_KEY    || '312621411738839',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Zu-q2czVP-0ANJrK_150CY6MKng',
});

cloudinary.config(getCloudinaryConfig());

// ✅ Use MEMORY storage — no disk writes, works on Vercel serverless
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const router = express.Router();

/**
 * 0. GET /api/upload/sign
 * Returns secure parameters for DIRECT client-to-Cloudinary upload.
 * This completely bypasses Vercel 4.5MB payload limit and prevents any function timeouts.
 */
router.get('/sign', (req, res) => {
  try {
    const config = getCloudinaryConfig();
    const folder = req.query.folder || 'weldor-products';
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, config.api_secret);

    return res.json({
      success: true,
      signature,
      timestamp,
      apiKey: config.api_key,
      cloudName: config.cloud_name,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloud_name}/auto/upload`,
    });
  } catch (err) {
    console.error('Sign error:', err);
    return res.status(500).json({ success: false, message: 'Signing failed', error: err.message });
  }
});

/**
 * Upload a buffer directly to Cloudinary via a readable stream.
 * This avoids any disk I/O — required for Vercel serverless environments.
 */
const uploadBufferToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.config(getCloudinaryConfig());

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Determine resource type and folder from file metadata
 */
const getUploadOptions = (originalName = '', mimetype = '', customFolder) => {
  const lowerName = originalName.toLowerCase();
  const lowerMime = (mimetype || '').toLowerCase();

  const isPdf   = lowerMime === 'application/pdf'  || lowerName.endsWith('.pdf');
  const isVideo = lowerMime.startsWith('video/')   || ['.mp4', '.mov', '.webm', '.avi', '.mkv'].some(ext => lowerName.endsWith(ext));
  const isImage = lowerMime.startsWith('image/')   || ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp', '.tiff', '.ico'].some(ext => lowerName.endsWith(ext));

  const folder = customFolder || (
    isPdf   ? 'weldor-certificates' :
    isVideo ? 'weldor-videos'       :
              'weldor-products'
  );

  return {
    folder,
    // Explicitly set resource_type: image ensures Cloudinary serves proper image headers
    resource_type: isPdf ? 'raw' : (isVideo ? 'video' : (isImage ? 'image' : 'auto')),
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };
};

// ── Single file upload ──────────────────────────────────────────────────────
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const customFolder = req.body?.folder || 'weldor-products';
    const options = getUploadOptions(req.file.originalname, req.file.mimetype, customFolder);

    const result = await uploadBufferToCloudinary(req.file.buffer, options);
    const cdnUrl = result.secure_url || result.url;

    console.log(`✅ Cloudinary upload success: ${cdnUrl}`);

    return res.json({
      success: true,
      message: 'File uploaded successfully to Cloudinary CDN',
      data: {
        originalName:   req.file.originalname,
        filename:       result.public_id,
        sizeBytes:      req.file.size,
        mimetype:       req.file.mimetype,
        url:            cdnUrl,
        cdnUrl:         cdnUrl,
        publicId:       result.public_id,
        format:         result.format,
        resourceType:   result.resource_type,
        isCdnOptimized: true,
      },
    });
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: 'Cloudinary upload failed',
      error: err?.message || 'Unknown error',
    });
  }
});

// ── Bulk file uploads ───────────────────────────────────────────────────────
router.post('/bulk', upload.array('files', 50), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  try {
    const customFolder = req.body?.folder || 'weldor-products';

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const options = getUploadOptions(file.originalname, file.mimetype, customFolder);
        const result  = await uploadBufferToCloudinary(file.buffer, options);
        const cdnUrl  = result.secure_url || result.url;

        return {
          originalName:   file.originalname,
          filename:       result.public_id,
          sizeBytes:      file.size,
          mimetype:       file.mimetype,
          url:            cdnUrl,
          cdnUrl:         cdnUrl,
          publicId:       result.public_id,
          format:         result.format,
          resourceType:   result.resource_type,
          isCdnOptimized: true,
        };
      })
    );

    console.log(`✅ Bulk uploaded ${uploadedFiles.length} files to Cloudinary`);

    return res.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} files to Cloudinary CDN!`,
      count:   uploadedFiles.length,
      data:    uploadedFiles,
    });
  } catch (err) {
    console.error('❌ Bulk Cloudinary upload error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: 'Bulk Cloudinary upload failed',
      error: err?.message || 'Unknown error',
    });
  }
});

export default router;
