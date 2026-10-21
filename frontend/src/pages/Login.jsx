import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, UserCog, UserRound } from 'lucide-react';
import { Logo, LoginArt, Sparkle } from '../components/Brand';
import { Button, Modal } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, isMock } from '../config';
const icons = { ADMIN: ShieldCheck, MANAGER: UserCog, STAFF: UserRound };
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' }); const [remember, setRemember] = useState(true); const [show, setShow] = useState(false);
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [forgot, setForgot] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!f.email || !f.password) return setErr('Enter your email and password.');
    setBusy(true);
    try { const u = await login(f.email, f.password, remember); nav(u.role === 'SUPPLIER' ? '/supplier-dashboard' : '/dashboard', { replace: true }); } catch (x) { setErr(x.message); setBusy(false); }
  };
  return <div className="login">
    <div className="left"><div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20 }}><Logo size={40} />SMARTSTOCK AI</div>
      <div><span className="tag"><Sparkle size={12} />AI-POWERED INVENTORY INTELLIGENCE</span>
        <h1 style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: '-.03em', margin: '16px 0 12px', color: '#14532D' }}>Predict Demand.<br />Prevent Shortages.</h1>
        <p style={{ color: '#166534', maxWidth: 420, fontSize: 15 }}>Forecast demand, spot stockout risk early and act on smart reorder recommendations — all in one place.</p></div>
      <LoginArt /></div>
    <div className="right"><div style={{ width: '100%', maxWidth: 420 }}>
      <div className="mob-only" style={{ alignItems: 'center', gap: 10, fontWeight: 800, marginBottom: 20 }}><Logo size={34} />SmartStock AI</div>
      <h2 style={{ fontSize: 26, fontWeight: 800 }}>Welcome back</h2><p style={{ color: '#64748B', margin: '4px 0 22px' }}>Sign in to your SmartStock AI workspace.</p>
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 14 }}>
        <div className="field"><label htmlFor="em">Email</label><div className="sbox"><Mail size={15} /><input id="em" type="email" autoComplete="username" className="input" placeholder="you@company.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div></div>
        <div className="field"><label htmlFor="pw">Password</label><div className="sbox"><Lock size={15} /><input id="pw" type={show ? 'text' : 'password'} autoComplete="current-password" className="input" placeholder="••••••••" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'none', color: '#94A3B8' }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 500 }}><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label>
          <button type="button" onClick={() => setForgot(true)} style={{ border: 0, background: 'none', color: '#16A34A', fontWeight: 600 }}>Forgot password?</button></div>
        {err && <div role="alert" style={{ background: '#FEE2E2', color: '#B91C1C', padding: '9px 12px', borderRadius: 10, fontSize: 13 }}>{err}</div>}
        <Button variant="pri" loading={busy} style={{ padding: 11 }}>Sign In</Button></form>
      <div style={{ margin: '26px 0 10px', color: '#64748B', fontWeight: 600, fontSize: 12 }}>DEMO ACCOUNTS {!isMock && '(live backend)'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>{DEMO_ACCOUNTS.map((a) => { const I = icons[a.role]; return <button key={a.role} type="button" className={`demo ${f.email === a.email ? 'on' : ''}`} onClick={() => { setF({ email: a.email, password: a.password }); setErr(''); }}><I size={17} color="#16A34A" /><div style={{ fontWeight: 700, marginTop: 4 }}>{a.role[0] + a.role.slice(1).toLowerCase()}</div><div className="cell-sub" style={{ fontSize: 10.5, wordBreak: 'break-all' }}>{a.email}</div></button>; })}</div>
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
        Want to become a supplier? <Link to="/supplier/register" style={{ color: '#16A34A', fontWeight: 600 }}>Register here</Link>
      </div>
      </div></div>
    {forgot && <Modal small title="Forgot password?" onClose={() => setForgot(false)} footer={<Button variant="pri" onClick={() => setForgot(false)}>Got it</Button>}><p>This is a demo environment, so password reset is disabled. Use one of the demo accounts below the sign-in form — click a card to auto-fill the credentials.</p></Modal>}
  </div>;
}
