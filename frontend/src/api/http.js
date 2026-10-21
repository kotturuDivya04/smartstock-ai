import { API_BASE } from '../config';
export const store = {
  get: () => { try { return JSON.parse(localStorage.getItem('ss_auth') || sessionStorage.getItem('ss_auth')); } catch { return null; } },
  set: (v, remember = true) => { localStorage.removeItem('ss_auth'); sessionStorage.removeItem('ss_auth'); (remember ? localStorage : sessionStorage).setItem('ss_auth', JSON.stringify(v)); },
  clear: () => { localStorage.removeItem('ss_auth'); sessionStorage.removeItem('ss_auth'); },
};
export async function http(path, { method = 'GET', body } = {}) {
  const token = store.get()?.token;
  const res = await fetch(API_BASE + path, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const j = await res.json(); msg = j.message || j.error || msg; } catch { /* no body */ }
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}
