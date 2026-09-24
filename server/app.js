import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

// Route imports
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import exhibitionsRouter from './routes/exhibitions.js';
import bannersRouter from './routes/banners.js';
import galleryRouter from './routes/gallery.js';
import crmRouter from './routes/crm.js';
import hrmsRouter from './routes/hrms.js';
import settingsRouter from './routes/settings.js';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-token', 'x-user-id'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory with proper headers for PDF, images & videos
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/exhibitions', exhibitionsRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/crm', crmRouter);
app.use('/api/hrms', hrmsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);

// Reset / Clear database endpoint
app.post('/api/clear-database', (req, res) => {
  db.clearAll();
  res.json({ success: true, message: 'All database collections have been completely cleared.' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Weldor Industries Clean Production Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    dataState: 'live_ready',
  });
});

export default app;
