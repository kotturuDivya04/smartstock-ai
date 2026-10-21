import { Link } from 'react-router-dom';
import { Lock, Compass } from 'lucide-react';
export default function AccessDenied({ notFound }) {
  const I = notFound ? Compass : Lock;
  return <div className="card" style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center', padding: 44 }}>
    <div style={{ width: 72, height: 72, borderRadius: 22, background: notFound ? '#F1F5F9' : '#FEE2E2', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}><I size={32} color={notFound ? '#64748B' : '#DC2626'} /></div>
    <h2 style={{ fontSize: 22 }}>{notFound ? 'Page not found' : 'Access Restricted'}</h2>
    <p style={{ color: '#64748B', margin: '8px 0 22px' }}>{notFound ? "The page you're looking for doesn't exist." : "Your role doesn't have permission to view this page. Contact an administrator if you need access."}</p>
    <Link to="/dashboard" className="btn pri">Back to dashboard</Link></div>;
}
