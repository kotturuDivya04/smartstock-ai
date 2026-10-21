import { isMock, DEMO_ACCOUNTS } from '../config';
import { http } from './http';
import { delay } from './mockDb';
// POST /api/auth/login
export async function login(email, password) {
  if (isMock) {
    await delay(500);
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase() && a.password === password);
    if (!acc) throw new Error('Invalid email or password');
    return { token: 'mock-token', user: { id: DEMO_ACCOUNTS.indexOf(acc) + 1, name: acc.name, email: acc.email, role: acc.role } };
  }
  const r = await http('/api/auth/login', { method: 'POST', body: { email, password } });
  return { token: r.token, user: { ...r.user, name: r.user.name || r.user.fullName } };
}

// POST /api/auth/supplier/register
export async function registerSupplier(data) {
  return http('/api/auth/supplier/register', { method: 'POST', body: data });
}
