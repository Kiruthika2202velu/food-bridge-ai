import { Router } from 'express';
import { ngos } from '../data/store';

const router = Router();

router.get('/ngos', (req, res) => {
  res.json(ngos);
});

router.get('/ngos/:id', (req, res) => {
  const n = ngos.find((item) => item.id === req.params.id);
  if (!n) return res.status(404).json({ error: 'NGO not found' });
  res.json(n);
});

export default router;
