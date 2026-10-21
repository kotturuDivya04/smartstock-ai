import { isMock } from '../config';
import { http } from './http';
import { delay, getDb, save } from './mockDb';
// GET /api/users
export async function getUsers() {
  if (isMock) { await delay(350); return [...getDb().users]; }
  return (await http('/api/users')).map((u) => ({ ...u, name: u.name || u.fullName }));
}
// POST /api/auth/register
export async function createUser(d) {
  if (!isMock) return http('/api/auth/register', { method: 'POST', body: { name: d.name, email: d.email, password: d.password, role: d.role } });
  await delay(300); const db = getDb();
  if (db.users.some((u) => u.email === d.email)) throw new Error('Email already in use');
  const u = { id: db.seq.user++, name: d.name, email: d.email, role: d.role, status: 'ACTIVE', createdAt: new Date().toISOString().slice(0, 10) }; db.users.push(u); save(); return u;
}
export async function updateUser(id, d) {
  if (!isMock) {
    // If updating status only
    if (d.status !== undefined) return http(`/api/users/${id}/status`, { method: 'PATCH' });
    // Otherwise update name/role (if backend supports a full update)
    return http(`/api/users/${id}`, { method: 'PUT', body: d });
  }
  await delay(300); const u = getDb().users.find((x) => x.id === id); Object.assign(u, d); save(); return u;
}
