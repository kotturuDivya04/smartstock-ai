import { useMemo, useState } from 'react';
import { Boxes, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, PageHeader, Badge, DataTable, SearchBox, StockBar, useCountUp } from '../components/ui';
import { useApp } from '../context/AppContext';
import { dtstr, num } from '../utils/derive';
const K = ({ icon: I, label, value, c, bg }) => { const n = useCountUp(value); return <Card className="hover"><div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><div className="pimg" style={{ width: 44, height: 44, background: bg, color: c }}><I size={20} /></div><div><div className="cell-sub">{label}</div><b style={{ fontSize: 24 }}>{num(n)}</b></div></div></Card>; };
function Inv() {
  const { rows, stats } = useApp(); const [q, setQ] = useState(''); const [st, setSt] = useState('');
  const list = useMemo(() => rows.filter((r) => (!st || r.status === st) && (r.product.name + r.product.sku).toLowerCase().includes(q.toLowerCase())), [rows, q, st]);
  const cols = [
    { key: 'name', label: 'Product', sortValue: (r) => r.product.name, render: (r) => <><div className="cell-main">{r.product.name}</div><div className="cell-sub">{r.product.sku}</div></> },
    { key: 'stock', label: 'Current Stock', sortValue: (r) => r.stock, render: (r) => <div style={{ minWidth: 130 }}><b>{r.stock}</b><StockBar stock={r.stock} min={r.min} max={r.max} /></div> },
    { key: 'min', label: 'Min', sortValue: (r) => r.min }, { key: 'max', label: 'Max', sortValue: (r) => r.max },
    { key: 'res', label: 'Reserved', sortValue: (r) => r.inv.reservedStock || 0, render: (r) => r.inv.reservedStock ?? 0 },
    { key: 'wh', label: 'Warehouse', render: (r) => r.inv.warehouseLocation || '—' },
    { key: 'status', label: 'Status', sortValue: (r) => r.status, render: (r) => <Badge v={r.status} /> },
    { key: 'upd', label: 'Last Updated', sortValue: (r) => r.inv.updatedAt || '', render: (r) => dtstr(r.inv.updatedAt) },
  ];
  return <div><PageHeader title="Inventory" sub="Live stock levels across warehouses." />
    <div className="row"><div className="c3"><K icon={Boxes} label="Total Stock Units" value={rows.reduce((a, r) => a + r.stock, 0)} c="#16A34A" bg="#DCFCE7" /></div><div className="c3"><K icon={AlertTriangle} label="Low Stock Items" value={stats.lowOnly} c="#D97706" bg="#FEF3C7" /></div>
      <div className="c3"><K icon={ShieldAlert} label="Critical Items" value={stats.critical} c="#DC2626" bg="#FEE2E2" /></div><div className="c3"><K icon={Lock} label="Reserved Units" value={rows.reduce((a, r) => a + (r.inv.reservedStock || 0), 0)} c="#2563EB" bg="#DBEAFE" /></div></div>
    <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search inventory…" /><select className="select" aria-label="Status" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All statuses</option><option value="HEALTHY">Healthy</option><option value="LOW">Low</option><option value="CRITICAL">Critical</option></select></div>
    <DataTable columns={cols} rows={list} /></div>;
}
export default function Inventory() { return <Gate><Inv /></Gate>; }
