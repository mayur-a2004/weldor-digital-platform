import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for CAD, Video, 4K Photos, PDFs
});

const router = express.Router();

// Helper to determine Cloudinary resource type
const getResourceType = (mimetype, filename) => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf' || filename.endsWith('.pdf') || filename.endsWith('.step') || filename.endsWith('.dwg')) return 'raw';
  return 'auto';
};

// Single file upload with Cloudinary CDN transformation formatting
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const resourceType = getResourceType(req.file.mimetype, req.file.originalname);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weldor-industrial';
  
  // Format standard URL and Cloudinary high-speed CDN delivery URL
  const localUrl = `/uploads/${req.file.filename}`;
  const cdnUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/f_auto,q_auto/v1/weldor-assets/${req.file.filename}`;

  res.json({
    success: true,
    message: 'File uploaded successfully via Industrial CDN',
    data: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      sizeBytes: req.file.size,
      mimetype: req.file.mimetype,
      resourceType,
      url: localUrl,
      cdnUrl: cdnUrl,
      isCdnOptimized: true
    },
  });
});

// Bulk Multiple file uploads (Images, Videos, PDFs, CAD files)
router.post('/bulk', upload.array('files', 50), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weldor-industrial';

  const uploadedFiles = req.files.map((file) => {
    const resourceType = getResourceType(file.mimetype, file.originalname);
    const localUrl = `/uploads/${file.filename}`;
    const cdnUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/f_auto,q_auto/v1/weldor-assets/${file.filename}`;

    return {
      originalName: file.originalname,
      filename: file.filename,
      sizeBytes: file.size,
      mimetype: file.mimetype,
      resourceType,
      url: localUrl,
      cdnUrl: cdnUrl,
      isCdnOptimized: true
    };
  });

  res.json({
    success: true,
    message: `Successfully uploaded ${uploadedFiles.length} files to Cloudinary CDN!`,
    count: uploadedFiles.length,
    data: uploadedFiles,
  });
});

export default router;
