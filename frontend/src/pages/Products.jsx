import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Gate from '../components/Gate';
import { PageHeader, Button, Badge, DataTable, SearchBox, Modal, Field, Confirm, Empty } from '../components/ui';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/productApi';
import { money } from '../utils/derive';

const blank = { name: '', sku: '', category: '', description: '', costPrice: '', unitPrice: '', supplierId: '', minStockLevel: '', maxStockLevel: '' };
function ProductForm({ item, suppliers, onClose, onSaved }) {
  const { toast } = useApp();
  const [f, setF] = useState(item ? { name: item.name, sku: item.sku, category: item.category || '', description: item.description || '', costPrice: item.costPrice, unitPrice: item.unitPrice ?? item.sellingPrice, supplierId: item.supplierId || '', minStockLevel: item.minStockLevel, maxStockLevel: item.maxStockLevel } : blank);
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const e = {}; const n = (k) => Number(f[k]);
    if (!f.name.trim()) e.name = 'Name is required'; if (!f.sku.trim()) e.sku = 'SKU is required'; if (!f.category.trim()) e.category = 'Category is required';
    if (f.costPrice === '' || n('costPrice') < 0) e.costPrice = 'Enter a valid cost'; if (f.unitPrice === '' || n('unitPrice') <= 0) e.unitPrice = 'Enter a valid price';
    else if (n('unitPrice') < n('costPrice')) e.unitPrice = 'Price is below cost';
    if (!f.supplierId) e.supplierId = 'Choose a supplier';
    if (f.minStockLevel === '' || n('minStockLevel') < 0) e.minStockLevel = 'Enter minimum stock'; if (f.maxStockLevel === '' || n('maxStockLevel') <= n('minStockLevel')) e.maxStockLevel = 'Must exceed minimum';
    setErr(e); if (Object.keys(e).length) return;
    const body = { sku: f.sku.trim(), name: f.name.trim(), description: f.description, category: f.category.trim(), unitPrice: n('unitPrice'), costPrice: n('costPrice'), minStockLevel: n('minStockLevel'), maxStockLevel: n('maxStockLevel'), supplierId: n('supplierId') };
    setBusy(true);
    try { item ? await api.updateProduct(item.id, body) : await api.createProduct(body); toast('success', item ? 'Product updated' : 'Product added'); await onSaved(); onClose(); } catch (x) { toast('error', x.message); setBusy(false); }
  };
  const inp = (k, label, type = 'text', full) => <Field label={label} error={err[k]} full={full} id={'f' + k}><input id={'f' + k} type={type} className={`input ${err[k] ? 'err' : ''}`} value={f[k]} onChange={set(k)} min={type === 'number' ? 0 : undefined} step={k.includes('Price') ? '0.01' : undefined} /></Field>;
  return <Modal title={item ? 'Edit Product' : 'Add Product'} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="pri" loading={busy} onClick={submit}>{item ? 'Save Changes' : 'Add Product'}</Button></>}>
    <div className="form-grid">{inp('name', 'Name')}{inp('sku', 'SKU')}{inp('category', 'Category')}
      <Field label="Supplier" error={err.supplierId} id="fsup"><select id="fsup" className={`select ${err.supplierId ? 'err' : ''}`} value={f.supplierId} onChange={set('supplierId')}><option value="">Select supplier</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
      <Field label="Description" full id="fdesc"><textarea id="fdesc" className="textarea" rows={2} value={f.description} onChange={set('description')} /></Field>
      {inp('costPrice', 'Cost Price (₹)', 'number')}{inp('unitPrice', 'Selling Price (₹)', 'number')}{inp('minStockLevel', 'Minimum Stock', 'number')}{inp('maxStockLevel', 'Maximum Stock', 'number')}</div></Modal>;
}
function Prod() {
  const { rows, data, reload, toast } = useApp(); const { role } = useAuth(); const canEdit = ['ADMIN', 'MANAGER'].includes(role);
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [st, setSt] = useState(''); const [sup, setSup] = useState(''); const [form, setForm] = useState(null); const [del, setDel] = useState(null);
  const cats = [...new Set(rows.map((r) => r.product.category).filter(Boolean))];
  const list = useMemo(() => rows.filter((r) => (!cat || r.product.category === cat) && (!st || r.status === st) && (!sup || String(r.product.supplierId) === sup) && (r.product.name + r.product.sku).toLowerCase().includes(q.toLowerCase())), [rows, q, cat, st, sup]);
  const cols = [
    { key: 'name', label: 'Product', sortValue: (r) => r.product.name, render: (r) => <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="pimg" style={{ fontWeight: 700 }}>{r.product.name[0]}</span><span className="cell-main">{r.product.name}</span></div> },
    { key: 'sku', label: 'SKU', sortValue: (r) => r.product.sku, render: (r) => r.product.sku }, { key: 'cat', label: 'Category', sortValue: (r) => r.product.category || '', render: (r) => r.product.category },
    { key: 'sup', label: 'Supplier', sortValue: (r) => r.product.supplierName || '', render: (r) => r.product.supplierName || r.sup?.name || '—' },
    { key: 'price', label: 'Selling Price', sortValue: (r) => Number(r.product.unitPrice), render: (r) => money(r.product.unitPrice ?? r.product.sellingPrice) },
    { key: 'stock', label: 'Stock', sortValue: (r) => r.stock, render: (r) => <b>{r.stock}</b> }, { key: 'min', label: 'Min Stock', sortValue: (r) => r.min, render: (r) => r.min },
    { key: 'st', label: 'Status', sortValue: (r) => r.status, render: (r) => <Badge v={r.status} /> },
    { key: 'act', label: 'Actions', render: (r) => canEdit ? <div style={{ display: 'flex', gap: 4 }}><Button size="sm" variant="ghost" aria-label={`Edit ${r.product.name}`} onClick={(e) => { e.stopPropagation(); setForm(r.product); }}><Pencil size={14} /></Button>
      {role === 'ADMIN' && <Button size="sm" variant="ghost" aria-label={`Delete ${r.product.name}`} style={{ color: '#DC2626' }} onClick={() => setDel(r.product)}><Trash2 size={14} /></Button>}</div> : <span className="cell-sub">View only</span> },
  ];
  return <div><PageHeader title="Products" sub="Manage your product catalogue.">{canEdit && <Button variant="pri" onClick={() => setForm({})}><Plus size={16} />Add Product</Button>}</PageHeader>
    <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search products or SKU…" />
      <select className="select" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
      <select className="select" aria-label="Stock status" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All stock status</option><option value="HEALTHY">Healthy</option><option value="LOW">Low</option><option value="CRITICAL">Critical</option></select>
      <select className="select" aria-label="Supplier" value={sup} onChange={(e) => setSup(e.target.value)}><option value="">All suppliers</option>{data.suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
    <DataTable columns={cols} rows={list} empty={<Empty title="No products found" text="Try adjusting your search or filters." />} />
    {form && <ProductForm item={form.id ? form : null} suppliers={data.suppliers} onClose={() => setForm(null)} onSaved={() => reload(true)} />}
    {del && <Confirm danger title="Delete product?" confirmText="Delete" onClose={() => setDel(null)} onConfirm={async () => { try { await api.deleteProduct(del.id); toast('success', `${del.name} deleted`); await reload(true); setDel(null); } catch (x) { toast('error', x.message); } }}><p>This will permanently remove <b>{del.name}</b> and its inventory record. This can't be undone.</p></Confirm>}</div>;
}
export default function Products() { return <Gate><Prod /></Gate>; }
