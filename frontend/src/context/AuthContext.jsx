import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/authApi';
import { store } from '../api/http';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => store.get()?.user || null);
  const login = async (email, password, remember) => {
    const r = await authApi.login(email, password);
    const prof = JSON.parse(localStorage.getItem('ss_profile_' + r.user.email) || 'null');
    const u = { ...r.user, ...(prof || {}) };
    store.set({ token: r.token, user: u }, remember); setUser(u); return u;
  };
  const logout = () => { store.clear(); setUser(null); };
  const updateProfile = (p) => {
    const u = { ...user, ...p }; localStorage.setItem('ss_profile_' + user.email, JSON.stringify(p));
    const cur = store.get(); store.set({ ...cur, user: u }, !!localStorage.getItem('ss_auth')); setUser(u);
  };
  return <Ctx.Provider value={{ user, role: user?.role, login, logout, updateProfile }}>{children}</Ctx.Provider>;
}
