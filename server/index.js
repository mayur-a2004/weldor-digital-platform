import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start Server for local development & cloud hosting (0.0.0.0 allows Hostinger reverse proxy)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 Weldor Backend API is LIVE`);
  console.log(`📡 URL: http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`=======================================================`);
});
