import { isMock } from '../config';
import { http } from './http';
import { delay, getDb, save, nowIso } from './mockDb';
const withSup = (p) => ({ ...p, supplierName: getDb().suppliers.find((s) => s.id === p.supplierId)?.name });
// GET /api/products
export const getProducts = async () => (isMock ? (await delay(), getDb().products.map(withSup)) : http('/api/products'));
// POST /api/products  { sku,name,description,category,unitPrice,costPrice,minStockLevel,maxStockLevel,supplierId }
export async function createProduct(d) {
  if (!isMock) return http('/api/products', { method: 'POST', body: d });
  await delay(300); const db = getDb();
  if (db.products.some((p) => p.sku.toLowerCase() === d.sku.toLowerCase())) throw new Error('SKU already exists');
  const id = db.seq.product++;
  const p = { id, sku: d.sku, name: d.name, description: d.description, category: d.category, sellingPrice: d.unitPrice, unitPrice: d.unitPrice, costPrice: d.costPrice, minimumStock: d.minStockLevel, minStockLevel: d.minStockLevel, maximumStock: d.maxStockLevel, maxStockLevel: d.maxStockLevel, supplierId: d.supplierId, createdAt: nowIso() };
  db.products.push(p);
  db.inventory.push({ id, productId: id, productSku: p.sku, productName: p.name, currentStock: 0, reservedStock: 0, availableStock: 0, minStockLevel: p.minStockLevel, maxStockLevel: p.maxStockLevel, warehouseLocation: 'WH-A / Unassigned', lastRestockedAt: null, updatedAt: nowIso() });
  db.predictions.push({ id, productId: id, productSku: p.sku, productName: p.name, predictedQuantity: 0, forecastDays: 7, confidenceScore: 0.5, modelName: 'Tribuo CART Regression', predictionDate: nowIso() });
  save(); return withSup(p);
}
// PUT /api/products/{id}
export async function updateProduct(id, d) {
  if (!isMock) return http(`/api/products/${id}`, { method: 'PUT', body: d });
  await delay(300); const db = getDb(); const p = db.products.find((x) => x.id === id);
  if (db.products.some((x) => x.id !== id && x.sku.toLowerCase() === d.sku.toLowerCase())) throw new Error('SKU already exists');
  Object.assign(p, { sku: d.sku, name: d.name, description: d.description, category: d.category, sellingPrice: d.unitPrice, unitPrice: d.unitPrice, costPrice: d.costPrice, minimumStock: d.minStockLevel, minStockLevel: d.minStockLevel, maximumStock: d.maxStockLevel, maxStockLevel: d.maxStockLevel, supplierId: d.supplierId });
  const inv = db.inventory.find((i) => i.productId === id); Object.assign(inv, { productSku: p.sku, productName: p.name, minStockLevel: p.minStockLevel, maxStockLevel: p.maxStockLevel });
  save(); return withSup(p);
}
// DELETE /api/products/{id}
export async function deleteProduct(id) {
  if (!isMock) return http(`/api/products/${id}`, { method: 'DELETE' });
  await delay(300); const db = getDb();
  ['products', 'inventory', 'predictions', 'reorders'].forEach((k) => { db[k] = db[k].filter((x) => (k === 'products' ? x.id : x.productId) !== id); });
  save();
}
