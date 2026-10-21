import { isMock } from '../config';
import { http } from './http';
import { delay, getDb, save, nowIso } from './mockDb';
// GET /api/suppliers
export const getSuppliers = async () => (isMock ? (await delay(350), [...getDb().suppliers]) : http('/api/suppliers'));
// POST /api/suppliers  { name, contactEmail, contactPhone, leadTimeDays, address }
export async function createSupplier(d) {
  if (!isMock) return http('/api/suppliers', { method: 'POST', body: d });
  await delay(300); const db = getDb(); const s = { ...d, id: db.seq.supplier++, createdAt: nowIso() }; db.suppliers.push(s); save(); return s;
}
// PUT /api/suppliers/{id}
export async function updateSupplier(id, d) {
  if (!isMock) return http(`/api/suppliers/${id}`, { method: 'PUT', body: d });
  await delay(300); const s = getDb().suppliers.find((x) => x.id === id); Object.assign(s, d); save(); return s;
}
// DELETE /api/suppliers/{id}
export async function deleteSupplier(id) {
  if (!isMock) return http(`/api/suppliers/${id}`, { method: 'DELETE' });
  await delay(300); const db = getDb();
  if (db.products.some((p) => p.supplierId === id)) throw new Error('Supplier still has products assigned');
  db.suppliers = db.suppliers.filter((s) => s.id !== id); save();
}

// PUT /api/suppliers/{id}/association
export async function updateAssociation(id, status) {
  if (!isMock) return http(`/api/suppliers/${id}/association?status=${status}`, { method: 'PUT' });
  await delay(300); const s = getDb().suppliers.find((x) => x.id === id); s.associationStatus = status; save(); return s;
}
