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
