import { isMock } from '../config';
import { http } from './http';
import { delay, getDb } from './mockDb';
// GET /api/stockout-risks -> { productId, productSku, productName, currentStock, dailyBurnRate, daysUntilStockout, riskLevel, recommendation }
export async function getRisks() {
  if (!isMock) return http('/api/stockout-risks');
  await delay(400); const db = getDb();
  return db.products.map((p) => {
    const stock = db.inventory.find((i) => i.productId === p.id)?.currentStock ?? 0;
    const pred = db.predictions.find((x) => x.productId === p.id);
    const lead = db.suppliers.find((s) => s.id === p.supplierId)?.leadTimeDays ?? 7;
    const burn = (pred?.predictedQuantity || 0) / (pred?.forecastDays || 7);
    const days = burn > 0 ? +(stock / burn).toFixed(1) : 999;
    const riskLevel = stock <= 0 || days <= lead ? 'CRITICAL' : days <= lead + 3 ? 'HIGH' : days <= lead + 10 ? 'MEDIUM' : 'LOW';
    const recommendation = riskLevel === 'LOW' ? 'Stock is sufficient. No action needed.' : riskLevel === 'MEDIUM' ? 'Plan a replenishment order soon.' : 'Reorder immediately to avoid a stockout.';
    return { productId: p.id, productSku: p.sku, productName: p.name, currentStock: stock, dailyBurnRate: +burn.toFixed(2), daysUntilStockout: days, riskLevel, recommendation };
  });
}
