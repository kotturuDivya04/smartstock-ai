import { isMock } from '../config';
import { http } from './http';
import { delay, getDb, save, nowIso } from './mockDb';
const byDate = (a, b) => String(b.saleDate).localeCompare(String(a.saleDate));
// GET /api/sales
export const getSales = async () => (isMock ? (await delay(450), [...getDb().sales].sort(byDate)) : (await http('/api/sales')).sort(byDate));
// POST /api/sales  { productId, quantity, unitPrice, customerReference, saleDate }
export async function recordSale(d) {
  if (!isMock) return http('/api/sales', { method: 'POST', body: d });
  await delay(400); const db = getDb();
  const inv = db.inventory.find((i) => i.productId === d.productId); const p = db.products.find((x) => x.id === d.productId);
  if (!inv || inv.availableStock < d.quantity) throw new Error('Insufficient stock for this sale');
  inv.currentStock -= d.quantity; inv.availableStock -= d.quantity; inv.updatedAt = nowIso();
  const s = { id: db.seq.sale++, productId: p.id, productSku: p.sku, productName: p.name, quantity: d.quantity, unitPrice: d.unitPrice, totalAmount: +(d.quantity * d.unitPrice).toFixed(2), saleDate: d.saleDate || nowIso(), customerReference: d.customerReference || 'WALK-IN', createdAt: nowIso() };
  db.sales.push(s); save(); return s;
}
