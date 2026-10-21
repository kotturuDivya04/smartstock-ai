import { useState } from 'react';
import { User, Palette, Bell, Info, RotateCcw } from 'lucide-react';
import { Card, CardHead, PageHeader, Button, Field } from '../components/ui';
import { Logo } from '../components/Brand';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MODE, isMock } from '../config';
import { resetDb } from '../api/mockDb';
const Toggle = ({ on, onChange, label }) => <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} style={{ width: 42, height: 24, borderRadius: 99, border: 0, background: on ? '#16A34A' : '#CBD5E1', position: 'relative', transition: '.2s' }}><span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: 9, background: '#fff', transition: '.2s' }} /></button>;
export default function Settings() {
  const { user, updateProfile } = useAuth(); const { toast } = useApp(); const [name, setName] = useState(user.name); const [email, setEmail] = useState(user.email);
  const [n, setN] = useState(() => JSON.parse(localStorage.getItem('ss_notif') || '{"risk":true,"reorder":true,"daily":false}'));
  const setNotif = (k, v) => { const x = { ...n, [k]: v }; setN(x); localStorage.setItem('ss_notif', JSON.stringify(x)); };
  const [theme, setTheme] = useState(() => localStorage.getItem('ss_theme') || 'light');
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ss_theme', newTheme);
    document.body.className = newTheme;
  };
  return <div style={{ maxWidth: 820 }}><PageHeader title="Settings" sub="Personal preferences for your workspace." />
    <Card style={{ marginBottom: 16 }}><CardHead title="Profile" sub="Saved on this device" /><div className="form-grid"><Field label="Name" id="pn"><input id="pn" className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field><Field label="Email" id="pe"><input id="pe" className="input" value={email} onChange={(e) => setEmail(e.target.value)} disabled /></Field></div>
      <div style={{ marginTop: 14 }}><Button variant="pri" onClick={() => { if (!name.trim()) return toast('error', 'Name cannot be empty'); updateProfile({ name: name.trim() }); toast('success', 'Profile updated'); }}><User size={15} />Save profile</Button></div></Card>
    <Card style={{ marginBottom: 16 }}><CardHead title="Appearance" /><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div className="cell-main"><Palette size={14} style={{ verticalAlign: -2 }} /> Theme</div><div className="cell-sub">Switch between Light and Dark mode.</div></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant={theme === 'light' ? 'pri' : 'ghost'} onClick={() => toggleTheme('light')}>Light</Button>
        <Button variant={theme === 'dark' ? 'pri' : 'ghost'} onClick={() => toggleTheme('dark')}>Dark</Button>
      </div>
    </div></Card>
    <Card style={{ marginBottom: 16 }}><CardHead title="Notifications" />{[['risk', 'Stockout risk alerts'], ['reorder', 'Reorder recommendation reminders'], ['daily', 'Daily prediction summary']].map(([k, l]) => <div key={k} className="list-i"><Bell size={16} color="#16A34A" /><div style={{ flex: 1 }} className="cell-main">{l}</div><Toggle on={n[k]} onChange={(v) => setNotif(k, v)} label={l} /></div>)}</Card>
    <Card><CardHead title="Application" /><div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><Logo size={46} /><div><b style={{ fontSize: 16 }}>SmartStock AI</b><div className="cell-sub">Inventory intelligence platform · v1.0</div><div className="cell-sub"><Info size={11} /> Data source: {MODE === 'mock' ? 'local demo data' : 'Spring Boot API'}</div></div></div>
      {isMock && <div style={{ marginTop: 14 }}><Button onClick={() => { resetDb(); toast('success', 'Demo data reset'); setTimeout(() => location.reload(), 600); }}><RotateCcw size={14} />Reset demo data</Button></div>}</Card></div>;
}
