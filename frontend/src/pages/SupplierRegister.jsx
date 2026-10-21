import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Brand';
import { Button } from '../components/ui';
import { registerSupplier } from '../api/authApi';

export default function SupplierRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');
    if (formData.password !== formData.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const response = await registerSupplier({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setSuccessMsg(response.message || "Supplier registration successful.");
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 5000);
    } catch (x) {
      setErr(x.response?.data?.message || x.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <div className="left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20 }}><Logo size={40} />SMARTSTOCK AI</div>
        <div>
          <h1 style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: '-.03em', margin: '16px 0 12px', color: '#14532D' }}>Join as a Supplier</h1>
          <p style={{ color: '#166534', maxWidth: 420, fontSize: 15 }}>Register your company to start receiving automated reorders.</p>
        </div>
      </div>
      <div className="right">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>Register Supplier</h2>
          <p style={{ color: '#64748B', margin: '4px 0 22px' }}>Fill in your details to create an account.</p>
          
          {err && <div role="alert" style={{ background: '#FEE2E2', color: '#B91C1C', padding: '9px 12px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{err}</div>}
          {successMsg && <div role="alert" style={{ background: '#DCFCE7', color: '#166534', padding: '9px 12px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{successMsg}</div>}
          
          <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 14 }}>
            <div className="field"><label>Company Name</label><input name="companyName" className="input" value={formData.companyName} onChange={handleChange} /></div>
            <div className="field"><label>Contact Person</label><input name="contactPerson" className="input" value={formData.contactPerson} onChange={handleChange} /></div>
            <div className="field"><label>Email</label><input name="email" type="email" className="input" value={formData.email} onChange={handleChange} /></div>
            <div className="field"><label>Phone</label><input name="phone" className="input" value={formData.phone} onChange={handleChange} /></div>
            <div className="field"><label>Password</label><input name="password" type="password" className="input" value={formData.password} onChange={handleChange} /></div>
            <div className="field"><label>Confirm Password</label><input name="confirmPassword" type="password" className="input" value={formData.confirmPassword} onChange={handleChange} /></div>
            <Button variant="pri" loading={busy} style={{ padding: 11, marginTop: 10 }}>Register</Button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
            Already registered? <Link to="/login" style={{ color: '#16A34A', fontWeight: 600 }}>Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
