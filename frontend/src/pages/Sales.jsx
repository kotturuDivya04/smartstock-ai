import { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, CardHead, PageHeader, Button, Field } from '../components/ui';
import { useApp } from '../context/AppContext';
import * as api from '../api/salesApi';
import { money, dtstr, toLocalInput } from '../utils/derive';
function SalesPage() {
  const { rows, data, reload, toast } = useApp();
  const init = { productId: '', quantity: '', unitPrice: '', customerReference: '', saleDate: toLocalInput() };
  const [f, setF] = useState(init); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false);
  const row = rows.find((r) => String(r.id) === String(f.productId)); const avail = row ? row.inv.availableStock ?? row.stock : 0;
  const total = (Number(f.quantity) || 0) * (Number(f.unitPrice) || 0);
  const pick = (e) => { const r = rows.find((x) => String(x.id) === e.target.value); setF({ ...f, productId: e.target.value, unitPrice: r ? r.product.unitPrice ?? r.product.sellingPrice : '' }); };
  const submit = async (e) => {
    e.preventDefault(); const er = {}; const q = Number(f.quantity);
    if (!f.productId) er.productId = 'Select a product'; if (!Number.isInteger(q) || q <= 0) er.quantity = 'Quantity must be a positive whole number'; else if (row && q > avail) er.quantity = `Only ${avail} units available`;
    if (!(Number(f.unitPrice) > 0)) er.unitPrice = 'Enter a valid price'; setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { await api.recordSale({ productId: +f.productId, quantity: q, unitPrice: +f.unitPrice, customerReference: f.customerReference || 'WALK-IN', saleDate: f.saleDate.length === 16 ? f.saleDate + ':00' : f.saleDate });
      toast('success', `Sale recorded: ${q} × ${row.product.name} (${money(total)})`); setF({ ...init, saleDate: toLocalInput() }); await reload(true); } catch (x) { toast('error', x.message); }
    setBusy(false);
  };
  return <div><PageHeader title="Record Sale" sub="Log a sale — inventory updates instantly." />
    <div className="row"><div className="c5"><Card><CardHead title="New sale" /><form onSubmit={submit} noValidate className="form-grid">
      <Field full label="Product" error={err.productId} id="sp"><select id="sp" className={`select ${err.productId ? 'err' : ''}`} value={f.productId} onChange={pick}><option value="">Select product</option>{rows.map((r) => <option key={r.id} value={r.id}>{r.product.name} ({r.stock} in stock)</option>)}</select></Field>
      <Field label="Quantity" error={err.quantity} id="sq"><input id="sq" type="number" min="1" className={`input ${err.quantity ? 'err' : ''}`} value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} />{row && <span className="cell-sub">{avail} available</span>}</Field>
      <Field label="Unit price (₹)" error={err.unitPrice} id="su"><input id="su" type="number" step="0.01" className={`input ${err.unitPrice ? 'err' : ''}`} value={f.unitPrice} onChange={(e) => setF({ ...f, unitPrice: e.target.value })} /></Field>
      <Field label="Customer reference" id="sc"><input id="sc" className="input" placeholder="e.g. ORD-1234" value={f.customerReference} onChange={(e) => setF({ ...f, customerReference: e.target.value })} /></Field>
      <Field label="Sale date" id="sd"><input id="sd" type="datetime-local" className="input" value={f.saleDate} onChange={(e) => setF({ ...f, saleDate: e.target.value })} /></Field>
      <div className="full" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#166534', fontWeight: 600 }}>Total amount</span><b style={{ fontSize: 24, color: '#14532D' }}>{money(total)}</b></div>
      <div className="full"><Button variant="pri" loading={busy} style={{ width: '100%', padding: 11 }}><ShoppingCart size={16} />Record Sale</Button></div></form></Card></div>
      <div className="c7"><Card style={{ height: '100%' }}><CardHead title="Recent sales" sub="Newest first" />{data.sales.slice(0, 8).map((s) => <div key={s.id} className="list-i"><span className="pimg"><Package size={16} /></span><div style={{ flex: 1 }}><div className="cell-main">{s.productName}</div><div className="cell-sub">{dtstr(s.saleDate)} · {s.customerReference}</div></div><div style={{ textAlign: 'right' }}><b>{money(s.totalAmount)}</b><div className="cell-sub">{s.quantity} × {money(s.unitPrice)}</div></div></div>)}</Card></div></div></div>;
}
export default function Sales() { return <Gate><SalesPage /></Gate>; }
