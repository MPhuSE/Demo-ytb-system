import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRootDir = path.resolve(__dirname, '..');

const PORT = parseInt(process.env.PORT || '3001', 10);
const storageDir = path.resolve(serverRootDir, 'storage');

// Ensure storage subfolders exist
fs.mkdirSync(path.join(storageDir, 'originals'), { recursive: true });
fs.mkdirSync(path.join(storageDir, 'videos'), { recursive: true });

const { app } = createApp(storageDir);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Mini YouTube Server listening on port ${PORT}`);
  console.log(`📡 API Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🎬 Media Origin:      http://localhost:${PORT}/media`);
  console.log(`===============================================`);
});
