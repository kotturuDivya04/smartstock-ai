import { useState } from 'react';
import { Plus, Pencil, Trash2, Truck, Zap, Clock } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, CardHead, PageHeader, Button, Badge, DataTable, SearchBox, Modal, Field, Confirm } from '../components/ui';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/supplierApi';

function SupForm({ item, onClose, onSaved }) {
  const { toast } = useApp(); const [f, setF] = useState(item ? { name: item.name, contactEmail: item.contactEmail || '', contactPhone: item.contactPhone || '', leadTimeDays: item.leadTimeDays, address: item.address || '' } : { name: '', contactEmail: '', contactPhone: '', leadTimeDays: 5, address: '' });
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const e = {}; if (!f.name.trim()) e.name = 'Name is required'; if (!/^\S+@\S+\.\S+$/.test(f.contactEmail)) e.contactEmail = 'Enter a valid email'; if (!(Number(f.leadTimeDays) >= 1)) e.leadTimeDays = 'At least 1 day';
    setErr(e); if (Object.keys(e).length) return; setBusy(true);
    try { const body = { ...f, leadTimeDays: Number(f.leadTimeDays) }; item ? await api.updateSupplier(item.id, body) : await api.createSupplier(body); toast('success', item ? 'Supplier updated' : 'Supplier added'); await onSaved(); onClose(); } catch (x) { toast('error', x.message); setBusy(false); }
  };
  const inp = (k, l, t = 'text', full) => <Field label={l} error={err[k]} full={full} id={'s' + k}><input id={'s' + k} type={t} className={`input ${err[k] ? 'err' : ''}`} value={f[k]} onChange={set(k)} /></Field>;
  return <Modal title={item ? 'Edit Supplier' : 'Add Supplier'} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="pri" loading={busy} onClick={submit}>{item ? 'Save Changes' : 'Add Supplier'}</Button></>}>
    <div className="form-grid">{inp('name', 'Supplier name', 'text', true)}{inp('contactEmail', 'Email', 'email')}{inp('contactPhone', 'Phone')}{inp('leadTimeDays', 'Lead time (days)', 'number')}{inp('address', 'Address', 'text', true)}</div></Modal>;
}
function Sup() {
  const { data, reload, toast } = useApp(); const { role } = useAuth(); const [q, setQ] = useState(''); const [form, setForm] = useState(null); const [del, setDel] = useState(null);
  const S = data.suppliers; const count = (id) => data.products.filter((p) => p.supplierId === id).length;
  const list = S.filter((s) => (s.name + (s.contactEmail || '')).toLowerCase().includes(q.toLowerCase()));
  const avg = S.length ? (S.reduce((a, s) => a + s.leadTimeDays, 0) / S.length).toFixed(1) : 0; const fastest = [...S].sort((a, b) => a.leadTimeDays - b.leadTimeDays)[0]; const maxLead = Math.max(...S.map((s) => s.leadTimeDays), 1);
  const toggleAssoc = async (s) => {
    try {
      await api.updateAssociation(s.id, s.associationStatus === 'ASSOCIATED' ? 'DEACTIVATED' : 'ASSOCIATED');
      toast('success', `Status updated for ${s.name}`);
      reload(true);
    } catch (e) {
      toast('error', e.message);
    }
  };

  const cols = [
    { key: 'name', label: 'Supplier', sortValue: (s) => s.name, render: (s) => <><div className="cell-main">{s.name}</div><div className="cell-sub">{s.address}</div></> },
    { key: 'email', label: 'Email', render: (s) => s.contactEmail }, { key: 'phone', label: 'Phone', render: (s) => s.contactPhone },
    { key: 'lead', label: 'Lead Time', sortValue: (s) => s.leadTimeDays, render: (s) => <b>{s.leadTimeDays} days</b> }, { key: 'prod', label: 'Products', sortValue: (s) => count(s.id), render: (s) => count(s.id) },
    { key: 'st', label: 'Status', render: (s) => <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><Badge v={count(s.id) ? 'ACTIVE' : 'DISABLED'}>{count(s.id) ? 'Active' : 'Idle'}</Badge><Badge v={s.associationStatus === 'ASSOCIATED' ? 'ACTIVE' : 'WARNING'}>{s.associationStatus || 'REGISTERED'}</Badge></div> },
    { key: 'act', label: 'Actions', render: (s) => <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {role === 'ADMIN' && (
         <Button size="sm" variant="ghost" style={{ fontSize: 12, padding: '0 6px', color: s.associationStatus === 'ASSOCIATED' ? '#D97706' : '#16A34A' }} onClick={() => toggleAssoc(s)}>
            {s.associationStatus === 'ASSOCIATED' ? 'Deactivate' : 'Associate'}
         </Button>
      )}
      <Button size="sm" variant="ghost" aria-label={`Edit ${s.name}`} onClick={() => setForm(s)}><Pencil size={14} /></Button>
      {role === 'ADMIN' && <Button size="sm" variant="ghost" aria-label={`Delete ${s.name}`} style={{ color: '#DC2626' }} onClick={() => setDel(s)}><Trash2 size={14} /></Button>}
    </div> },
  ];
  return <div><PageHeader title="Suppliers" sub="Track supplier performance and lead times."><Button variant="pri" onClick={() => setForm({})}><Plus size={16} />Add Supplier</Button></PageHeader>
    <div className="row"><div className="c4"><Card className="hover"><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span className="pimg"><Clock size={18} /></span><div><div className="cell-sub">Average lead time</div><b style={{ fontSize: 24 }}>{avg} days</b></div></div></Card></div>
      <div className="c4"><Card className="hover"><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span className="pimg"><Truck size={18} /></span><div><div className="cell-sub">Active suppliers</div><b style={{ fontSize: 24 }}>{S.filter((s) => count(s.id)).length} / {S.length}</b></div></div></Card></div>
      <div className="c4"><Card className="hover"><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span className="pimg"><Zap size={18} /></span><div><div className="cell-sub">Fastest supplier</div><b style={{ fontSize: 18 }}>{fastest?.name}</b> <span className="cell-sub">{fastest?.leadTimeDays}d</span></div></div></Card></div></div>
    <div className="row"><div className="c4"><Card style={{ height: '100%' }}><CardHead title="Lead time comparison" />{[...S].sort((a, b) => a.leadTimeDays - b.leadTimeDays).map((s) => <div key={s.id} style={{ marginBottom: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}><span>{s.name}</span><b>{s.leadTimeDays}d</b></div><div className="bar" style={{ marginTop: 4 }}><i style={{ width: (s.leadTimeDays / maxLead) * 100 + '%', background: s.leadTimeDays <= 5 ? '#16A34A' : s.leadTimeDays <= 7 ? '#D97706' : '#DC2626' }} /></div></div>)}</Card></div>
      <div className="c8"><div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search suppliers…" /></div><DataTable columns={cols} rows={list} /></div></div>
    {form && <SupForm item={form.id ? form : null} onClose={() => setForm(null)} onSaved={() => reload(true)} />}
    {del && <Confirm danger title="Delete supplier?" confirmText="Delete" onClose={() => setDel(null)} onConfirm={async () => { try { await api.deleteSupplier(del.id); toast('success', `${del.name} deleted`); await reload(true); setDel(null); } catch (x) { toast('error', x.message); setDel(null); } }}><p>Remove <b>{del.name}</b>? Suppliers with assigned products can't be deleted.</p></Confirm>}</div>;
}
export default function Suppliers() { return <Gate><Sup /></Gate>; }
