import { isMock } from '../config';
import { http } from './http';
import { delay, getDb } from './mockDb';
// GET /api/predictions/product/{id}/latest (one per product)
export async function getLatestPredictions(products) {
  if (isMock) { await delay(400); return getDb().predictions.map((p) => ({ ...p })); }
  const all = await Promise.all(products.map((p) => http(`/api/predictions/product/${p.id}/latest`).catch(() => null)));
  return all.filter(Boolean);
}
// POST /api/predictions/generate-all
export async function generateAll() {
  if (isMock) { await delay(900); return getDb().predictions; }
  return http('/api/predictions/generate-all', { method: 'POST' });
}
