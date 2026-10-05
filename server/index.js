import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start Server for local development
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Weldor Backend API is LIVE`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
