import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createApiRouter } from './backend';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // All API routes now live in backend/ (see backend/README.md) —
  // this mounts the exact same endpoints that used to be defined inline
  // here, unchanged in behavior.
  app.use('/api', createApiRouter());

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Bridge AI Server running at http://localhost:${PORT}`);
    console.log(`Open in your browser: http://localhost:${PORT}`);
  });
}

startServer();
