import { Router } from 'express';
import { restaurants, ngos, donations } from '../data/store';
import { SystemMetrics } from '../../src/types';

const router = Router();

// NOTE (carried over from the original server.ts, unchanged): these
// baseline offsets (+38, +13, +24, +155, +2820) pad the real in-memory
// counts to look like an established platform for demo purposes. This
// means the numbers shown are NOT purely derived from live data — flag
// this if you want honest, unpadded metrics instead; removing the
// offsets is a one-line change per field below.
router.get('/metrics', (req, res) => {
  const totalRest = restaurants.length + 38;
  const totalNGO = ngos.length + 13;
  const available = donations.filter((d) => d.status === 'available').length + 24;
  const completed = donations.filter((d) => d.status === 'completed').length + 155;
  const totalSavedKg = Math.round(donations.reduce((sum, d) => sum + d.weightKg, 0) + 2820);
  const mealsServed = Math.round(totalSavedKg * 4);
  const co2PreventedKg = Math.round(totalSavedKg * 2.5);
  const activePickups = donations.filter((d) => d.status === 'reserved').length;

  const metrics: SystemMetrics = {
    totalRestaurants: totalRest,
    totalNGOs: totalNGO,
    availableDonations: available,
    completedDonations: completed,
    foodSavedKg: totalSavedKg,
    mealsServed,
    co2PreventedKg,
    activePickups,
  };
  res.json(metrics);
});

export default router;
