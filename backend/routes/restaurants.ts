import { Router } from 'express';
import { restaurants } from '../data/store';

const router = Router();

router.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

router.get('/restaurants/:id', (req, res) => {
  const r = restaurants.find((item) => item.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Restaurant not found' });
  res.json(r);
});

export default router;
