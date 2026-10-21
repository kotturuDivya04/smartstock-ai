import { useMemo, useState } from 'react';
import Gate from '../components/Gate';
import { Card, PageHeader, DataTable, SearchBox } from '../components/ui';
import { useApp } from '../context/AppContext';
import { money, dtstr, dayKey } from '../utils/derive';
function Hist() {
  const { data } = useApp(); const [q, setQ] = useState(''); const [pid, setPid] = useState(''); const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const sum = (ms) => data.sales.filter((s) => Date.now() - new Date(s.saleDate) < ms && new Date(s.saleDate) <= Date.now() + 864e5).reduce((a, s) => a + Number(s.totalAmount), 0);
  const today = data.sales.filter((s) => dayKey(s.saleDate) === dayKey(new Date())).reduce((a, s) => a + Number(s.totalAmount), 0);
  const list = useMemo(() => data.sales.filter((s) => (!pid || String(s.productId) === pid) && (!from || dayKey(s.saleDate) >= from) && (!to || dayKey(s.saleDate) <= to) && (s.productName + (s.customerReference || '')).toLowerCase().includes(q.toLowerCase())), [data.sales, q, pid, from, to]);
  const cols = [
    { key: 'date', label: 'Date', sortValue: (s) => s.saleDate, render: (s) => dtstr(s.saleDate) }, { key: 'p', label: 'Product', sortValue: (s) => s.productName, render: (s) => <span className="cell-main">{s.productName}</span> },
    { key: 'q', label: 'Quantity', sortValue: (s) => s.quantity }, { key: 'u', label: 'Unit Price', render: (s) => money(s.unitPrice) },
    { key: 't', label: 'Total', sortValue: (s) => Number(s.totalAmount), render: (s) => <b>{money(s.totalAmount)}</b> }, { key: 'c', label: 'Customer Ref', render: (s) => s.customerReference || '—' },
  ];
  return <div><PageHeader title="Sales History" sub="Every recorded transaction." />
    <div className="row">{[["Today's Sales", today], ['Last 7 Days', sum(7 * 864e5)], ['Last 30 Days', sum(30 * 864e5)]].map(([l, v]) => <div key={l} className="c4"><Card className="hover"><div className="cell-sub">{l}</div><b style={{ fontSize: 26 }}>{money(v)}</b></Card></div>)}</div>
    <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search product or reference…" />
      <select className="select" aria-label="Product" value={pid} onChange={(e) => setPid(e.target.value)}><option value="">All products</option>{data.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <input type="date" className="input" style={{ width: 'auto' }} aria-label="From date" value={from} onChange={(e) => setFrom(e.target.value)} /><input type="date" className="input" style={{ width: 'auto' }} aria-label="To date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
    <DataTable columns={cols} rows={list} pageSize={25} initialSort={{ key: 'date', dir: 'desc' }} /></div>;
}
export default function SalesHistory() { return <Gate><Hist /></Gate>; }
