import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, ensureDbConnected } from './db.js';

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

// Ensure database connection is active before processing any API request
app.use('/api', async (req, res, next) => {
  try {
    await ensureDbConnected();
  } catch (e) {}
  next();
});

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

// API Router (supports both /api/* and direct serverless rewrites)
const apiRouter = express.Router();
apiRouter.use('/products', productsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/exhibitions', exhibitionsRouter);
apiRouter.use('/banners', bannersRouter);
apiRouter.use('/gallery', galleryRouter);
apiRouter.use('/crm', crmRouter);
apiRouter.use('/hrms', hrmsRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/auth', authRouter);

// Reset / Clear database endpoint
apiRouter.post('/clear-database', (req, res) => {
  db.clearAll();
  res.json({ success: true, message: 'All database collections have been completely cleared.' });
});

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Weldor Industries Clean Production Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    dataState: 'live_ready',
  });
});

app.use('/api', apiRouter);
app.use(apiRouter);

export default app;
