import { useEffect, useState } from 'react';
import { Plus, Pencil, Power } from 'lucide-react';
import { Card, PageHeader, Button, Badge, DataTable, Modal, Field, Skeleton, ErrorState, SearchBox } from '../components/ui';
import { useApp } from '../context/AppContext';
import * as api from '../api/userApi';
import { dstr, initials } from '../utils/derive';
function UserForm({ item, onClose, onSaved }) {
  const { toast } = useApp(); const [f, setF] = useState(item ? { name: item.name, email: item.email, role: item.role, password: '' } : { name: '', email: '', role: 'STAFF', password: '' }); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false);
  const submit = async () => {
    const e = {}; if (!f.name.trim()) e.name = 'Name is required'; if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email'; if (!item && f.password.length < 6) e.password = 'At least 6 characters'; setErr(e); if (Object.keys(e).length) return; setBusy(true);
    try { item ? await api.updateUser(item.id, { name: f.name, email: f.email, role: f.role }) : await api.createUser(f); toast('success', item ? 'User updated' : 'User created'); await onSaved(); onClose(); } catch (x) { toast('error', x.message); setBusy(false); }
  };
  return <Modal title={item ? 'Edit User' : 'Add User'} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="pri" loading={busy} onClick={submit}>{item ? 'Save Changes' : 'Create User'}</Button></>}>
    <div className="form-grid"><Field full label="Full name" error={err.name} id="un"><input id="un" className={`input ${err.name ? 'err' : ''}`} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Email" error={err.email} id="ue"><input id="ue" type="email" className={`input ${err.email ? 'err' : ''}`} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
      <Field label="Role" id="ur"><select id="ur" className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="ADMIN">Admin</option><option value="MANAGER">Manager</option><option value="STAFF">Staff</option><option value="SUPPLIER">Supplier</option></select></Field>
      {!item && <Field full label="Temporary password" error={err.password} id="up"><input id="up" type="password" className={`input ${err.password ? 'err' : ''}`} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>}</div></Modal>;
}
export default function Users() {
  const { toast } = useApp(); const [users, setUsers] = useState(null); const [error, setError] = useState(null); const [form, setForm] = useState(null); const [q, setQ] = useState('');
  const load = () => api.getUsers().then((u) => { setUsers(u); setError(null); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  if (error) return <ErrorState message={error} onRetry={load} />; if (!users) return <div><Skeleton h={34} w={240} style={{ marginBottom: 20 }} /><Skeleton h={260} /></div>;
  const toggle = async (u) => { try { await api.updateUser(u.id, { status: u.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED' }); toast('success', `${u.name} ${u.status === 'DISABLED' ? 'enabled' : 'disabled'}`); load(); } catch (e) { toast('warning', e.message); } };
  const cols = [
    { key: 'n', label: 'Name', sortValue: (u) => u.name, render: (u) => <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span className="avatar">{initials(u.name)}</span><span className="cell-main">{u.name}</span></div> }, { key: 'e', label: 'Email', render: (u) => u.email },
    { key: 'r', label: 'Role', sortValue: (u) => u.role, render: (u) => <Badge cls={u.role === 'ADMIN' ? 'b-blue' : u.role === 'MANAGER' ? 'b-green' : u.role === 'SUPPLIER' ? 'b-amb' : 'b-gray'}>{u.role}</Badge> },
    { key: 's', label: 'Status', render: (u) => <Badge v={u.status || 'ACTIVE'}>{(u.status || 'ACTIVE') === 'ACTIVE' ? 'Active' : 'Disabled'}</Badge> }, { key: 'c', label: 'Created', render: (u) => dstr(u.createdAt) },
    { key: 'a', label: 'Actions', render: (u) => <div style={{ display: 'flex', gap: 4 }}><Button size="sm" variant="ghost" aria-label={`Edit ${u.name}`} onClick={() => setForm(u)}><Pencil size={14} /></Button><Button size="sm" variant="ghost" aria-label={`Toggle ${u.name}`} onClick={() => toggle(u)}><Power size={14} />{u.status === 'DISABLED' ? 'Enable' : 'Disable'}</Button></div> },
  ];
  return <div><PageHeader title="Users" sub="Manage who can access SmartStock AI."><Button variant="pri" onClick={() => setForm({})}><Plus size={16} />Add User</Button></PageHeader>
    <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search users…" /></div>
    <DataTable columns={cols} rows={users.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()))} />
    {form && <UserForm item={form.id ? form : null} onClose={() => setForm(null)} onSaved={load} />}</div>;
}
