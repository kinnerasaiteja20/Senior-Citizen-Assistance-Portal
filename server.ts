import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './src/server/db.ts';
import authRoutes from './src/server/routes/authRoutes.ts';
import categoryRoutes from './src/server/routes/categoryRoutes.ts';
import requestRoutes from './src/server/routes/requestRoutes.ts';
import volunteerRoutes from './src/server/routes/volunteerRoutes.ts';
import seniorRoutes from './src/server/routes/seniorRoutes.ts';
import feedbackRoutes from './src/server/routes/feedbackRoutes.ts';
import statsRoutes from './src/server/routes/statsRoutes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/seniors', seniorRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    portal: 'Senior Citizen Assistance Portal',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  await initDatabase();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Senior Citizen Assistance Portal backend and frontend live on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
