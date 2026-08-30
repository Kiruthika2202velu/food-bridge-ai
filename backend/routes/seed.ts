import { Router } from 'express';

const router = Router();

// Same behavior as the original: acknowledges the reset without actually
// re-seeding the in-memory arrays (the original server.ts had this same
// no-op — restart the server for a genuine reset to initial demo data).
router.post('/seed/reset', (req, res) => {
  res.json({ success: true, message: 'Database reset to initial demo state.' });
});

export default router;
