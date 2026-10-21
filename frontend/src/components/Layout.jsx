import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, PanelLeftClose, PanelLeftOpen, LogOut, ChevronDown, Package, Truck, ShoppingCart, ShieldAlert, ClipboardCheck, Sparkles, Settings } from 'lucide-react';
import { Logo } from './Brand';
import { NAV, ALL_ITEMS } from '../routes/navConfig';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { initials, money, dtstr } from '../utils/derive';
import { Badge } from './ui';

function useOutside(ref, fn) { useEffect(() => { const h = (e) => ref.current && !ref.current.contains(e.target) && fn(); document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, [ref, fn]); }

function GlobalSearch() {
  const { data } = useApp(); const nav = useNavigate(); const [q, setQ] = useState(''); const [open, setOpen] = useState(false); const ref = useRef(); const inp = useRef();
  useOutside(ref, () => setOpen(false));
  useEffect(() => { const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); inp.current?.focus(); setOpen(true); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const res = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s || !data) return [];
    const p = data.products.filter((x) => (x.name + x.sku).toLowerCase().includes(s)).slice(0, 4).map((x) => ({ k: 'p' + x.id, icon: Package, t: x.name, s: `Product · ${x.sku}`, to: '/products' }));
    const su = data.suppliers.filter((x) => x.name.toLowerCase().includes(s)).slice(0, 3).map((x) => ({ k: 's' + x.id, icon: Truck, t: x.name, s: `Supplier · ${x.leadTimeDays}d lead time`, to: '/suppliers' }));
    const sa = data.sales.filter((x) => (x.productName + (x.customerReference || '')).toLowerCase().includes(s)).slice(0, 4).map((x) => ({ k: 'a' + x.id, icon: ShoppingCart, t: `${x.productName} × ${x.quantity}`, s: `Sale · ${x.customerReference || ''} · ${money(x.totalAmount)}`, to: '/sales-history' }));
    return [...p, ...su, ...sa];
  }, [q, data]);
  const go = (to) => { nav(to); setOpen(false); setQ(''); };
  return <div className="rel grow" ref={ref} style={{ flex: 1, maxWidth: 440 }}>
    <div className="sbox"><Search size={15} /><input ref={inp} className="input" placeholder="Search products, suppliers, sales…  Ctrl K" aria-label="Global search" value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onKeyDown={(e) => { if (e.key === 'Enter' && res[0]) go(res[0].to); if (e.key === 'Escape') { setOpen(false); inp.current.blur(); } }} /></div>
    {open && q && <div className="menu" style={{ left: 0, right: 0, minWidth: 0 }}>{res.length ? res.map((r) => <button key={r.k} onClick={() => go(r.to)}><r.icon size={16} color="#16A34A" /><span><b style={{ fontWeight: 600 }}>{r.t}</b><br /><span className="cell-sub">{r.s}</span></span></button>) : <div className="empty" style={{ padding: 20 }}>No results for “{q}”</div>}</div>}</div>;
}

function Notifications() {
  const { data, stats } = useApp(); const { role } = useAuth(); const nav = useNavigate(); const [open, setOpen] = useState(false); const [read, setRead] = useState(false); const ref = useRef(); useOutside(ref, () => setOpen(false));
  const items = useMemo(() => {
    if (!data) return []; const out = [];
    if (['ADMIN', 'MANAGER'].includes(role)) {
      data.risks.filter((r) => ['CRITICAL', 'HIGH'].includes(r.riskLevel)).forEach((r) => out.push({ k: 'r' + r.productId, icon: ShieldAlert, t: `${r.productName} is at ${r.riskLevel.toLowerCase()} stockout risk.`, s: `${r.daysUntilStockout} days of stock left`, to: '/stockout-risk' }));
      if (stats.pending) out.push({ k: 'pend', icon: ClipboardCheck, t: `${stats.pending} reorder recommendation${stats.pending > 1 ? 's are' : ' is'} awaiting review.`, s: 'Action needed', to: '/reorders' });
      out.push({ k: 'pred', icon: Sparkles, t: 'Daily demand prediction updated.', s: 'Tribuo CART Regression · today', to: '/forecast' });
    } else data.inventory.filter((i) => i.currentStock <= i.minStockLevel).forEach((i) => out.push({ k: 'i' + i.productId, icon: Package, t: `${i.productName} is running low.`, s: `${i.currentStock} units left`, to: '/inventory' }));
    return out;
  }, [data, role, stats]);
  return <div className="rel" ref={ref}><button className="btn ghost icon" aria-label={`Notifications (${read ? 0 : items.length} new)`} onClick={() => { setOpen(!open); }}><Bell size={19} />{!read && items.length > 0 && <span className="dot" />}</button>
    {open && <div className="menu" style={{ width: 340 }}><div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #E2E8F0' }}><b>Notifications</b><button style={{ border: 0, background: 'none', color: '#16A34A', fontWeight: 600, width: 'auto', padding: 0 }} onClick={() => setRead(true)}>Mark all read</button></div>
      <div style={{ maxHeight: 360, overflow: 'auto' }}>{items.length ? items.map((n) => <button key={n.k} onClick={() => { nav(n.to); setOpen(false); }}><n.icon size={17} color="#16A34A" style={{ flexShrink: 0 }} /><span style={{ opacity: read ? .6 : 1 }}>{n.t}<br /><span className="cell-sub">{n.s}</span></span></button>) : <div className="empty" style={{ padding: 24 }}>You're all caught up</div>}</div></div>}</div>;
}

function UserMenu() {
  const { user, logout } = useAuth(); const nav = useNavigate(); const [open, setOpen] = useState(false); const ref = useRef(); useOutside(ref, () => setOpen(false));
  return <div className="rel" ref={ref}><button className="btn ghost" style={{ padding: '4px 6px', gap: 9 }} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><span className="avatar">{initials(user.name)}</span>
    <span className="hide-m" style={{ textAlign: 'left', lineHeight: 1.2 }}><div style={{ fontWeight: 600 }}>{user.name}</div><Badge cls="b-green">{user.role}</Badge></span><ChevronDown size={14} className="hide-m" /></button>
    {open && <div className="menu" style={{ minWidth: 220 }} role="menu"><div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0' }}><b>{user.name}</b><div className="cell-sub">{user.email}</div></div>
      <button role="menuitem" onClick={() => { nav('/settings'); setOpen(false); }}><Settings size={16} />Settings</button><button role="menuitem" style={{ color: '#DC2626' }} onClick={() => { logout(); nav('/login'); }}><LogOut size={16} />Log out</button></div>}</div>;
}

export default function Layout() {
  const { role } = useAuth(); const loc = useLocation(); const [collapsed, setCollapsed] = useState(false); const [mob, setMob] = useState(false);
  useEffect(() => setMob(false), [loc.pathname]);
  const title = ALL_ITEMS.find((i) => loc.pathname.startsWith(i.path))?.label || 'SmartStock AI';
  return <div className="app">
    <div className={`scrim ${mob ? 'show' : ''}`} onClick={() => setMob(false)} />
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mob ? 'open' : ''}`} aria-label="Sidebar">
      <div className="side-top"><Logo size={34} /><span className="lbl">SmartStock AI<small>Inventory intelligence</small></span></div>
      <nav className="side-nav">{NAV.map((g) => { const items = g.items.filter((i) => i.roles.includes(role)); return items.length ? <div key={g.group}><div className="nav-group">{g.group}</div>{items.map((i) => <NavLink key={i.path} to={i.path} title={i.label} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><i.icon size={18} /><span className="lbl">{i.label}</span></NavLink>)}</div> : null; })}</nav>
      <div className="side-foot hide-m"><button className="btn ghost" style={{ width: '100%' }} onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">{collapsed ? <PanelLeftOpen size={17} /> : <><PanelLeftClose size={17} /><span className="lbl">Collapse</span></>}</button></div>
    </aside>
    <div className="main"><header className="topbar">
      <button className="btn ghost icon mob-only" aria-label="Open menu" onClick={() => setMob(true)}><Menu size={20} /></button>
      <h1 className="hide-m">{title}</h1><GlobalSearch /><div style={{ flex: 1 }} /><Notifications /><UserMenu /></header>
      <main className="content" key={loc.pathname}><Outlet /></main></div></div>;
}
