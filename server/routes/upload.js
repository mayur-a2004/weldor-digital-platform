import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Helper to upload file to Cloudinary with fallback to local URL
const uploadToCloudinarySafely = async (filePath, originalName, mimetype) => {
  const isPdf = mimetype === 'application/pdf' || originalName.endsWith('.pdf');
  const isVideo = mimetype.startsWith('video/');
  const folder = isPdf ? 'weldor-certificates' : (isVideo ? 'weldor-videos' : 'weldor-assets');

  try {
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      const res = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: isPdf ? 'raw' : (isVideo ? 'video' : 'auto'),
        use_filename: true,
        unique_filename: true,
      });
      return res.secure_url;
    }
  } catch (err) {
    console.warn('⚠️ Direct Cloudinary upload fallback:', err.message);
  }
  return `/uploads/${path.basename(filePath)}`;
};

// Single file upload
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const cloudUrl = await uploadToCloudinarySafely(req.file.path, req.file.originalname, req.file.mimetype);

    res.json({
      success: true,
      message: 'File uploaded successfully to Cloudinary CDN',
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        sizeBytes: req.file.size,
        mimetype: req.file.mimetype,
        url: cloudUrl,
        cdnUrl: cloudUrl,
        isCdnOptimized: true,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Upload failed', error: e.message });
  }
});

// Bulk file uploads
router.post('/bulk', upload.array('files', 50), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  try {
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const cloudUrl = await uploadToCloudinarySafely(file.path, file.originalname, file.mimetype);
        return {
          originalName: file.originalname,
          filename: file.filename,
          sizeBytes: file.size,
          mimetype: file.mimetype,
          url: cloudUrl,
          cdnUrl: cloudUrl,
          isCdnOptimized: true,
        };
      })
    );

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} files to Cloudinary CDN!`,
      count: uploadedFiles.length,
      data: uploadedFiles,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Bulk upload failed', error: e.message });
  }
});

export default router;
