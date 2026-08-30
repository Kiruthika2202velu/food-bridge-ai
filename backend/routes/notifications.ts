import { Router } from 'express';
import { notifications } from '../data/store';

const router = Router();

router.get('/notifications', (req, res) => {
  res.json(notifications);
});

export default router;
