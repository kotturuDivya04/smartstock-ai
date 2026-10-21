import { Clock, Truck, Package, TrendingUp, ArrowRight } from 'lucide-react';
import { Drawer, Badge } from './ui';
import { riskReason, toneColor } from '../utils/derive';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function RiskDrawer({ row, onClose }) {
  const { role } = useAuth(); const nav = useNavigate(); const r = row.risk || { riskLevel: 'LOW', daysUntilStockout: 999, currentStock: row.stock, lead: row.lead, recommendation: '' };
  const days = r.daysUntilStockout >= 999 ? null : r.daysUntilStockout; const scale = Math.max(days || 0, row.lead, 1) * 1.25;
  const rr = { ...r, lead: row.lead, currentStock: row.stock };
  return <Drawer title="Why is this risky?" onClose={onClose}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}><div className="pimg" style={{ width: 46, height: 46 }}><Package size={22} /></div><div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 18 }}>{row.product.name}</div><div className="cell-sub">{row.product.sku} · {row.sup?.name || 'No supplier'}</div></div><Badge v={r.riskLevel} /></div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
      {[[Package, 'Current stock', `${row.stock} units`], [TrendingUp, 'Predicted 7-day demand', `${row.predicted} units`], [Truck, 'Supplier lead time', `${row.lead} days`], [Clock, 'Estimated stockout', days === null ? 'No risk' : `${days} days`]].map(([I, l, v]) => <div key={l} className="card" style={{ padding: 14, boxShadow: 'none', background: '#F8FAFC' }}><I size={16} color="#16A34A" /><div className="cell-sub" style={{ marginTop: 6 }}>{l}</div><b style={{ fontSize: 17 }}>{v}</b></div>)}</div>
    <h3 style={{ fontSize: 13, marginBottom: 10 }}>Stockout timeline</h3>
    <div style={{ position: 'relative', height: 64, margin: '0 6px 8px' }}><div style={{ position: 'absolute', top: 30, left: 0, right: 0, height: 6, borderRadius: 9, background: '#E2E8F0' }} />
      {days !== null && <div style={{ position: 'absolute', top: 30, left: 0, width: `${(days / scale) * 100}%`, height: 6, borderRadius: 9, background: toneColor[r.riskLevel] }} />}
      <div style={{ position: 'absolute', left: `${(row.lead / scale) * 100}%`, top: 0, transform: 'translateX(-50%)', textAlign: 'center', fontSize: 11, color: '#166534', fontWeight: 600 }}>Restock arrives<br />day {row.lead}<div style={{ width: 2, height: 16, background: '#16A34A', margin: '2px auto 0' }} /></div>
      {days !== null && <div style={{ position: 'absolute', left: `${(days / scale) * 100}%`, top: 38, transform: 'translateX(-50%)', textAlign: 'center', fontSize: 11, color: toneColor[r.riskLevel], fontWeight: 600 }}><div style={{ width: 2, height: 8, background: toneColor[r.riskLevel], margin: '0 auto' }} />Stockout day {days}</div>}</div>
    <div className="card" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', boxShadow: 'none', marginTop: 24 }}><b style={{ fontSize: 12, color: '#166534' }}>REASON</b><p style={{ marginTop: 6 }}>{riskReason(rr)}</p></div>
    <div className="card" style={{ boxShadow: 'none', marginTop: 12 }}><b style={{ fontSize: 12, color: '#64748B' }}>AI RECOMMENDATION</b><p style={{ marginTop: 6 }}>{r.recommendation || 'No action needed.'}</p></div>
    {['ADMIN', 'MANAGER'].includes(role) && <button className="btn pri" style={{ width: '100%', marginTop: 16 }} onClick={() => nav('/reorders')}>Open reorder recommendations <ArrowRight size={15} /></button>}
  </Drawer>;
}
