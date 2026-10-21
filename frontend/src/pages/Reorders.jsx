import { useState } from 'react';
import { Check, Pencil, X, Package, Truck, Sparkles, Lock } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, PageHeader, Badge, Button, Segmented, Modal, Confirm, Field, Empty } from '../components/ui';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/reorderApi';
import { money, RISK_ORDER, dtstr } from '../utils/derive';

function Reorders_() {
  const { data, rows, reload, toast } = useApp(); const { role } = useAuth(); const can = role === 'MANAGER';
  const [f, setF] = useState('ALL'); const [act, setAct] = useState(null); const [qty, setQty] = useState(''); const [reason, setReason] = useState(''); const [err, setErr] = useState('');
  const c = (s) => data.reorders.filter((r) => r.status === s).length;
  const list = data.reorders.filter((r) => f === 'ALL' || r.status === f).sort((a, b) => (a.status === 'PENDING' ? 0 : 1) - (b.status === 'PENDING' ? 0 : 1) || RISK_ORDER[a.urgency] - RISK_ORDER[b.urgency]);
  const done = async (fn, msg) => { try { await fn(); toast('success', msg); await reload(true); setAct(null); } catch (e) { toast('error', e.message); setAct(null); } };
  const reasonOf = (r) => { const row = rows.find((x) => x.id === r.productId); if (!row) return 'Recommended to keep stock above the minimum level.'; const d = row.risk?.daysUntilStockout; return d && d < 999 ? `Stock covers ~${d} days against a ${row.lead}-day lead time; predicted demand is ${row.predicted} units this week.` : `Predicted demand of ${row.predicted} units/week; top up toward the max level of ${row.max}.`; };
  return <div><PageHeader title="Reorder Recommendations" sub="AI-generated actions to prevent stockouts." />
    {!can && <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', background: '#F8FAFC' }}><Lock size={16} color="#64748B" />Approving, modifying or rejecting recommendations requires the Manager role. You have view-only access.</div>}
    <div className="row">{[['Pending', 'PENDING', '#D97706'], ['Approved', 'APPROVED', '#16A34A'], ['Modified', 'MODIFIED', '#2563EB'], ['Rejected', 'REJECTED', '#DC2626']].map(([l, s, col]) => <div key={s} className="c3"><Card className="hover" style={{ borderTop: `3px solid ${col}` }}><div className="cell-sub">{l}</div><b style={{ fontSize: 28 }}>{c(s)}</b></Card></div>)}</div>
    <div className="toolbar"><Segmented label="Status filter" value={f} onChange={setF} options={[{ v: 'ALL', l: 'All' }, { v: 'PENDING', l: 'Pending' }, { v: 'APPROVED', l: 'Approved' }, { v: 'MODIFIED', l: 'Modified' }, { v: 'REJECTED', l: 'Rejected' }]} /></div>
    {list.length ? <div style={{ display: 'grid', gap: 14 }}>{list.map((r) => { const row = rows.find((x) => x.id === r.productId);
      return <Card key={r.id} className="hover"><div className="rc">
        <div style={{ display: 'flex', gap: 12 }}><span className="pimg" style={{ width: 44, height: 44 }}><Package size={20} /></span><div><div style={{ fontWeight: 700, fontSize: 15 }}>{r.productName}</div><div className="cell-sub">{r.productSku} · {r.supplierName}</div><div style={{ display: 'flex', gap: 6, marginTop: 8 }}><Badge v={r.urgency}>{r.urgency} priority</Badge><Badge v={r.status} /></div></div></div>
        <div><div className="st"><div><small>Current stock</small><b>{r.currentStock}</b></div><div><small>Predicted demand (7d)</small><b>{row?.predicted ?? '—'}</b></div><div><small><Truck size={11} /> Lead time</small><b>{row?.lead ?? '—'} days</b></div><div><small>Recommended order</small><b style={{ color: '#16A34A' }}>{r.suggestedReorderQuantity} units</b></div></div>
          <p className="cell-sub" style={{ marginTop: 10, display: 'flex', gap: 6 }}><Sparkles size={13} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />{reasonOf(r)} Est. cost {money(r.estimatedTotalCost)}.</p>
          {r.reviewedBy && <p className="cell-sub">Reviewed by {r.reviewedBy} · {dtstr(r.reviewedAt)}</p>}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{r.status === 'PENDING' && can ? <><Button variant="pri" onClick={() => setAct({ t: 'accept', r })}><Check size={15} />Accept</Button><Button onClick={() => { setQty(r.suggestedReorderQuantity); setErr(''); setAct({ t: 'modify', r }); }}><Pencil size={14} />Modify</Button><Button style={{ color: '#DC2626' }} onClick={() => { setReason(''); setAct({ t: 'reject', r }); }}><X size={15} />Reject</Button></> : r.status === 'PENDING' ? <span className="cell-sub">Awaiting manager</span> : null}</div></div></Card>; })}</div>
      : <Card><Empty title="No recommendations" text="Nothing matches this filter." /></Card>}
    {act?.t === 'accept' && <Confirm title="Approve reorder?" confirmText="Approve order" onClose={() => setAct(null)} onConfirm={() => done(() => api.acceptRecommendation(act.r.id), `Approved: ${act.r.suggestedReorderQuantity} × ${act.r.productName}`)}><p>Order <b>{act.r.suggestedReorderQuantity} units</b> of <b>{act.r.productName}</b> from {act.r.supplierName} for an estimated <b>{money(act.r.estimatedTotalCost)}</b>?</p></Confirm>}
    {act?.t === 'reject' && <Confirm danger title="Reject recommendation?" confirmText="Reject" onClose={() => setAct(null)} onConfirm={() => done(() => api.rejectRecommendation(act.r.id), `Rejected recommendation for ${act.r.productName}`)}><p style={{ marginBottom: 12 }}>The AI suggested ordering {act.r.suggestedReorderQuantity} units of <b>{act.r.productName}</b>.</p><Field label="Reason (optional)" id="rr"><textarea id="rr" className="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Overstocked, supplier delay…" /></Field></Confirm>}
    {act?.t === 'modify' && <Modal small title="Modify quantity" onClose={() => setAct(null)} footer={<><Button onClick={() => setAct(null)}>Cancel</Button><Button variant="pri" onClick={() => { const n = Number(qty); if (!Number.isInteger(n) || n <= 0) return setErr('Enter a positive whole number'); if (n > act.r.maxStockLevel * 2) return setErr('Quantity is unreasonably large'); done(() => api.modifyRecommendation(act.r.id, n), `Modified: ${n} × ${act.r.productName}`); }}>Confirm & approve</Button></>}>
      <p style={{ marginBottom: 12 }}>AI recommends <b>{act.r.suggestedReorderQuantity}</b> units of <b>{act.r.productName}</b>. Set your own quantity:</p><Field label="Order quantity" error={err} id="mq"><input id="mq" type="number" min="1" className={`input ${err ? 'err' : ''}`} value={qty} onChange={(e) => setQty(e.target.value)} autoFocus /></Field>
      <p className="cell-sub" style={{ marginTop: 10 }}>Est. cost: {money((Number(qty) || 0) * act.r.unitCost)}</p></Modal>}</div>;
}
export default function Reorders() { return <Gate><Reorders_ /></Gate>; }
