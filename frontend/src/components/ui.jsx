import { useEffect, useMemo, useState } from 'react';
import { X, Search, ArrowUp, ArrowDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { EmptyArt } from './Brand';
import { tone, toneColor } from '../utils/derive';

export const Badge = ({ v, children, cls }) => <span className={`badge ${cls || tone[v] || 'b-gray'}`}>{children || v}</span>;
export const Card = ({ children, className = '', ...p }) => <div className={`card ${className}`} {...p}>{children}</div>;
export const CardHead = ({ title, sub, children }) => <div className="card-h"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div><div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div></div>;
export const PageHeader = ({ title, sub, children }) => <div className="page-h"><div><h2>{title}</h2>{sub && <p>{sub}</p>}</div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{children}</div></div>;
export const Button = ({ variant = '', size = '', loading, children, ...p }) => <button className={`btn ${variant} ${size}`} disabled={loading || p.disabled} {...p}>{loading ? 'Please wait…' : children}</button>;
export const Segmented = ({ options, value, onChange, label }) => <div className="seg" role="group" aria-label={label}>{options.map((o) => <button key={o.v} className={value === o.v ? 'on' : ''} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>{o.l}</button>)}</div>;
export const Field = ({ label, error, children, full, id }) => <div className={`field ${full ? 'full' : ''}`}><label htmlFor={id}>{label}</label>{children}{error && <span className="em" role="alert">{error}</span>}</div>;
export const SearchBox = ({ value, onChange, placeholder = 'Search…' }) => <div className="sbox grow"><Search size={15} /><input className="input" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
export const Skeleton = ({ h = 20, w = '100%', style }) => <div className="sk" style={{ height: h, width: w, ...style }} />;
export const PageSkeleton = () => <div><Skeleton h={34} w={280} style={{ marginBottom: 22 }} /><div className="row">{[1, 2, 3, 4].map((i) => <div key={i} className="c3"><Skeleton h={130} /></div>)}</div><div className="row"><div className="c8"><Skeleton h={320} /></div><div className="c4"><Skeleton h={320} /></div></div></div>;
export const Empty = ({ title = 'Nothing here yet', text = 'No records match your filters.', action }) => <div className="empty"><EmptyArt /><h3>{title}</h3><p>{text}</p>{action && <div style={{ marginTop: 14 }}>{action}</div>}</div>;
export const ErrorState = ({ message, onRetry }) => <Card><div className="empty"><AlertTriangle size={40} color="#DC2626" /><h3>Something went wrong</h3><p>{message}</p><div style={{ marginTop: 14 }}><Button onClick={onRetry}><RefreshCw size={14} />Try again</Button></div></div></Card>;

export function Modal({ title, onClose, children, footer, small }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return <div className="ov" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className={`modal ${small ? 'sm' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
    <div className="m-h"><h3>{title}</h3><button className="btn ghost icon" aria-label="Close" onClick={onClose}><X size={18} /></button></div><div className="m-b">{children}</div>{footer && <div className="m-f">{footer}</div>}</div></div>;
}
export function Drawer({ title, onClose, children }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return <div className="ov dr" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
    <div className="m-h"><h3>{title}</h3><button className="btn ghost icon" aria-label="Close" onClick={onClose}><X size={18} /></button></div><div className="m-b">{children}</div></aside></div>;
}
export function Confirm({ title, children, confirmText = 'Confirm', danger, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  return <Modal small title={title} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant={danger ? 'dan' : 'pri'} loading={busy} onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); } }}>{confirmText}</Button></>}>{children}</Modal>;
}
export function StockBar({ stock, min, max }) {
  const pct = Math.min(100, (stock / (max || 1)) * 100); const st = stock <= min * 0.5 ? 'CRITICAL' : stock <= min * 1.25 ? 'LOW' : 'HEALTHY';
  return <div className="bar" title={`${stock} of max ${max}`}><i style={{ width: pct + '%', background: st === 'HEALTHY' ? '#16A34A' : st === 'LOW' ? '#D97706' : '#DC2626' }} /><u style={{ left: Math.min(100, (min / (max || 1)) * 100) + '%' }} /></div>;
}
export const riskDot = (l) => <span style={{ width: 8, height: 8, borderRadius: 9, background: toneColor[l], display: 'inline-block' }} />;

export function DataTable({ columns, rows, onRowClick, initialSort, pageSize = 0, empty }) {
  const [sort, setSort] = useState(initialSort || null); const [limit, setLimit] = useState(pageSize || Infinity);
  const sorted = useMemo(() => {
    if (!sort) return rows; const c = columns.find((x) => x.key === sort.key); const g = c?.sortValue || ((r) => r[sort.key]);
    return [...rows].sort((a, b) => { const x = g(a), y = g(b); const r = typeof x === 'string' ? x.localeCompare(y) : (x ?? 0) - (y ?? 0); return sort.dir === 'asc' ? r : -r; });
  }, [rows, sort, columns]);
  if (!rows.length) return <div className="tw">{empty || <Empty />}</div>;
  return <div className="tw"><table><thead><tr>{columns.map((c) => <th key={c.key} className={c.sortValue || c.sort ? 's' : ''} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
    onClick={() => (c.sortValue || c.sort) && setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 'asc' ? 'desc' : 'asc' }))}>
    {c.label}{sort?.key === c.key && (sort.dir === 'asc' ? <ArrowUp size={11} style={{ marginLeft: 4 }} /> : <ArrowDown size={11} style={{ marginLeft: 4 }} />)}</th>)}</tr></thead>
    <tbody>{sorted.slice(0, limit).map((r, i) => <tr key={r.id ?? i} className={onRowClick ? 'click' : ''} onClick={() => onRowClick?.(r)} tabIndex={onRowClick ? 0 : undefined} onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(r)}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody></table>
    {sorted.length > limit && <div style={{ padding: 12, textAlign: 'center' }}><Button size="sm" onClick={() => setLimit((l) => l + pageSize)}>Show more ({sorted.length - limit} remaining)</Button></div>}</div>;
}
export function useCountUp(v, ms = 700) {
  const [n, setN] = useState(0);
  useEffect(() => { let raf; const t0 = performance.now(); const f = (t) => { const p = Math.min(1, (t - t0) / ms); setN(Math.round(v * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [v, ms]);
  return n;
}
