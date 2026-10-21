import { useMemo, useState } from 'react';
import { Brain, History, Activity, TrendingUp, CalendarDays, Sparkles } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, CardHead, PageHeader, Segmented, Button } from '../components/ui';
import { ForecastChart } from '../components/charts';
import { Sparkle } from '../components/Brand';
import { useApp } from '../context/AppContext';
import * as predApi from '../api/predictionApi';
import { buildForecast, demandStats } from '../utils/derive';
function Forecast() {
  const { rows, data, reload, toast } = useApp(); const [pid, setPid] = useState(rows[0]?.id); const [days, setDays] = useState(14); const [busy, setBusy] = useState(false);
  const sel = rows.find((r) => r.id === pid) || rows[0]; const fc = useMemo(() => buildForecast(data.sales, sel.pred, sel.id, days), [sel, days, data.sales]); const st = useMemo(() => demandStats(data.sales, sel.id), [sel, data.sales]);
  const regen = async () => { setBusy(true); try { await predApi.generateAll(); await reload(true); toast('success', 'Predictions regenerated for all products'); } catch (e) { toast('error', e.message); } setBusy(false); };
  const how = [[History, 'Historical Sales', `${st.total90} units sold over the last 90 days`], [Activity, 'Moving Averages', `7-day avg ${st.ma7.toFixed(1)}/day · 30-day avg ${st.ma30.toFixed(1)}/day`], [TrendingUp, 'Sales Trend', `${st.trend >= 0 ? '+' : ''}${st.trend.toFixed(1)}% vs. the previous week`], [CalendarDays, 'Seasonality', `Weekends sell ${st.weekendLift >= 0 ? '+' : ''}${st.weekendLift.toFixed(0)}% vs. weekdays`]];
  return <div><PageHeader title="Demand Forecast" sub="AI-powered demand predictions for smarter inventory planning."><Button loading={busy} onClick={regen}><Sparkles size={15} />Regenerate predictions</Button></PageHeader>
    <div className="toolbar"><select className="select" aria-label="Product" value={sel.id} onChange={(e) => setPid(+e.target.value)}>{rows.map((r) => <option key={r.id} value={r.id}>{r.product.name}</option>)}</select><Segmented label="Forecast period" value={days} onChange={setDays} options={[{ v: 7, l: '7 days' }, { v: 14, l: '14 days' }, { v: 30, l: '30 days' }]} /></div>
    <div className="row"><div className="c8"><Card><CardHead title={`${sel.product.name} — Historical vs Predicted`} sub={`Last ${days} days and next ${days} days`} /><ForecastChart data={fc.data} height={340} /></Card></div>
      <div className="c4"><Card className="hero" style={{ height: '100%' }}><div style={{ position: 'relative', zIndex: 1 }}><span className="tag"><Sparkle size={12} />AI PREDICTION</span>
        <div className="cell-sub" style={{ marginTop: 16, color: '#166534' }}>Predicted {days}-Day Demand</div><div style={{ fontSize: 40, fontWeight: 800, color: '#14532D', letterSpacing: '-.03em' }}>{fc.total} <span style={{ fontSize: 16 }}>units</span></div>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>{[['Current Stock', `${sel.stock} units`], ['Demand Trend', `${st.trend >= 0 ? '+' : ''}${st.trend.toFixed(1)}%`], ['Confidence', sel.pred ? `${Math.round(sel.pred.confidenceScore * 100)}%` : '—'], ['Model', sel.pred?.modelName || 'Tribuo CART Regression']].map(([l, v]) => <div key={l} className="mini" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><small style={{ display: 'inline' }}>{l}</small><b style={{ fontSize: 14 }}>{v}</b></div>)}</div></div></Card></div></div>
    <Card><CardHead title="How this prediction works" sub="Signals the model learns from" /><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 }}>{how.map(([I, t, d]) => <div key={t} className="card hover" style={{ boxShadow: 'none', background: '#F8FAFC' }}><span className="pimg"><I size={18} /></span><div className="cell-main" style={{ margin: '10px 0 4px' }}>{t}</div><div className="cell-sub" style={{ fontSize: 12.5 }}>{d}</div></div>)}</div>
      <p className="cell-sub" style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}><Brain size={15} color="#16A34A" />A Tribuo CART regression tree combines these features into a daily demand estimate, which feeds stockout risk and reorder quantities.</p></Card></div>;
}
export default function DemandForecast() { return <Gate><Forecast /></Gate>; }
