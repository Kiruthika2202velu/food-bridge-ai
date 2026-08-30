import { Router } from 'express';
import health from './routes/health';
import metrics from './routes/metrics';
import auth from './routes/auth';
import restaurants from './routes/restaurants';
import ngos from './routes/ngos';
import donations from './routes/donations';
import ai from './routes/ai';
import notifications from './routes/notifications';
import seed from './routes/seed';

/**
 * Combines every backend route module into a single router, mounted at
 * /api by server.ts. This replaces the routes that used to be defined
 * inline in server.ts — same endpoints, same behavior, just organized
 * into backend/routes/*.ts + backend/services/*.ts + backend/data/store.ts
 * instead of one 960-line file. Nothing under src/ (frontend) was touched.
 */
export function createApiRouter(): Router {
  const router = Router();
  router.use(health);
  router.use(metrics);
  router.use(auth);
  router.use(restaurants);
  router.use(ngos);
  router.use(donations);
  router.use(ai);
  router.use(notifications);
  router.use(seed);
  return router;
}
