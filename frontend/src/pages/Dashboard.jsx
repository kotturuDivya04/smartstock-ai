import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, ShieldAlert, ClipboardCheck, TrendingUp, TrendingDown, ArrowRight, Sparkles, Clock } from 'lucide-react';
import Gate from '../components/Gate';
import { Card, CardHead, Badge, Button, Segmented, useCountUp, Empty } from '../components/ui';
import { ForecastChart, Donut, Spark } from '../components/charts';
import RiskDrawer from '../components/RiskDrawer';
import { Sparkle } from '../components/Brand';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buildForecast, dailySeries, money, dtstr, RISK_ORDER, toneColor } from '../utils/derive';

function Kpi({ cls = '', icon: I, value, label, trend, up, tint, spark, onClick }) {
  const n = useCountUp(value);
  return <Card className={`kpi hover ${cls}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="ic" style={{ background: cls ? 'rgba(255,255,255,.15)' : tint[0], color: cls ? '#fff' : tint[1] }}><I size={19} /></div>
    <div className="v">{n}</div><div className="l">{label}</div>
    <div className="tr" style={{ color: cls ? '#BBF7D0' : up ? '#16A34A' : '#D97706' }}>{up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{trend}</div>
    {spark && <div style={{ position: 'absolute', right: 10, bottom: 8, width: 90, opacity: .9 }}><Spark values={spark} color={cls ? '#86EFAC' : tint[1]} height={44} /></div>}
  </Card>;
}
function Dash() {
  const { data, rows, stats } = useApp(); const { user, role } = useAuth(); const nav = useNavigate(); const isAI = ['ADMIN', 'MANAGER'].includes(role);
  const [pid, setPid] = useState(rows[0]?.id); const [days, setDays] = useState(14); const [drawer, setDrawer] = useState(null);
  const hr = new Date().getHours(); const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const atRisk = useMemo(() => rows.filter((r) => r.risk && RISK_ORDER[r.risk.riskLevel] <= 1).sort((a, b) => a.risk.daysUntilStockout - b.risk.daysUntilStockout), [rows]);
  const top = atRisk[0] || [...rows].sort((a, b) => a.stock / (a.min || 1) - b.stock / (b.min || 1))[0];
  const sel = rows.find((r) => r.id === pid) || rows[0];
  const fc = useMemo(() => sel && buildForecast(data.sales, sel.pred, sel.id, days), [sel, days, data.sales]);
  const heroSpark = useMemo(() => top ? dailySeries(data.sales, top.id, 21).map((d) => d.qty) : [], [top, data.sales]);
  const donut = [{ name: 'Healthy', value: stats.healthy, color: '#16A34A' }, { name: 'Low Stock', value: stats.lowOnly, color: '#D97706' }, { name: 'Critical', value: stats.critical, color: '#DC2626' }];
  const pendingRecs = data.reorders.filter((r) => r.status === 'PENDING');
  const weekSales = data.sales.filter((s) => Date.now() - new Date(s.saleDate) < 7 * 864e5).reduce((a, s) => a + s.quantity, 0);
  return <div>
    <div className="page-h"><div><h2>{greet}, {user.name.split(' ')[0]}</h2><p>Here's what's happening with your inventory today.</p></div>
      <span className="badge b-gray" style={{ padding: '7px 12px', fontSize: 12 }}><Clock size={13} />{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
    <div className="row">
      <div className="c3"><Kpi cls="dark" icon={Package} value={stats.total} label="Total Products" trend={`${money(stats.todaySales)} sold today`} up spark={[3, 5, 4, 6, 5, 8, 7]} onClick={() => nav('/products')} /></div>
      <div className="c3"><Kpi icon={AlertTriangle} tint={['#FEF3C7', '#D97706']} value={stats.low} label="Low Stock" trend={`${stats.critical} critical`} spark={[2, 2, 3, 3, 2, 3, stats.low]} onClick={() => nav('/inventory')} /></div>
      {isAI ? <><div className="c3"><Kpi icon={ShieldAlert} tint={['#FEE2E2', '#DC2626']} value={stats.atRisk} label="Stockout Risk" trend="High or critical" onClick={() => nav('/stockout-risk')} /></div>
        <div className="c3"><Kpi icon={ClipboardCheck} tint={['#DBEAFE', '#2563EB']} value={stats.pending} label="Pending Reorders" trend="Awaiting review" up onClick={() => nav('/reorders')} /></div></>
        : <><div className="c3"><Kpi icon={TrendingUp} tint={['#DCFCE7', '#16A34A']} value={weekSales} label="Units Sold (7d)" trend="Last 7 days" up onClick={() => nav('/sales-history')} /></div>
          <div className="c3"><Kpi icon={ClipboardCheck} tint={['#DBEAFE', '#2563EB']} value={stats.healthy} label="Healthy Products" trend="Well stocked" up onClick={() => nav('/inventory')} /></div></>}
    </div>
    {isAI && top && <div className="row"><div className="c12"><Card className="hero"><div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 360px' }}><span className="tag"><Sparkle size={12} />AI INVENTORY INSIGHT</span>
        <h2 style={{ fontSize: 22, margin: '12px 0 6px', color: '#14532D', letterSpacing: '-.02em' }}>{stats.atRisk} product{stats.atRisk !== 1 && 's'} may reach critical stock levels within the next 7 days.</h2>
        <p style={{ color: '#166534' }}>Most urgent: <b>{top.product.name}</b>{top.risk && <> — about {top.risk.daysUntilStockout} days of stock left.</>}</p>
        <div style={{ display: 'flex', gap: 10, margin: '14px 0', flexWrap: 'wrap' }}><div className="mini"><small>Predicted demand (7d)</small><b>{top.predicted} units</b></div><div className="mini"><small>Current inventory</small><b>{top.stock} units</b></div><div className="mini"><small>Risk level</small><Badge v={top.risk?.riskLevel || 'LOW'} /></div></div>
        <Button variant="pri" onClick={() => nav('/stockout-risk')}>View AI Insights <ArrowRight size={15} /></Button></div>
      <div style={{ flex: '0 1 300px', width: '100%', background: 'rgba(255,255,255,.7)', borderRadius: 14, padding: '10px 14px' }}><div className="cell-sub">{top.product.name} · daily demand, last 21 days</div><Spark values={heroSpark} height={90} /></div></div></Card></div></div>}
    <div className="row">
      {isAI && sel && <div className="c8"><Card><CardHead title="Demand Forecast" sub="Historical vs AI-predicted units per day">
        <select className="select" aria-label="Product" style={{ width: 'auto' }} value={sel.id} onChange={(e) => setPid(+e.target.value)}>{rows.map((r) => <option key={r.id} value={r.id}>{r.product.name}</option>)}</select>
        <Segmented label="Period" value={days} onChange={setDays} options={[{ v: 7, l: '7 Days' }, { v: 14, l: '14 Days' }, { v: 30, l: '30 Days' }]} /></CardHead><ForecastChart data={fc.data} /></Card></div>}
      <div className={isAI ? 'c4' : 'c6'}><Card style={{ height: '100%' }}><CardHead title="Inventory Health" sub="Stock status across products" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}><Donut items={donut} center={stats.total} sub="products" />
          <div style={{ flex: 1, minWidth: 130 }}>{donut.map((d) => <div key={d.name} style={{ marginBottom: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 9, background: d.color, marginRight: 8 }} />{d.name}</span>{d.value}</div><div className="bar" style={{ marginTop: 5 }}><i style={{ width: (d.value / stats.total) * 100 + '%', background: d.color }} /></div></div>)}</div></div>
        <div style={{ marginTop: 6 }}>{rows.filter((r) => r.status !== 'HEALTHY').slice(0, 3).map((r) => <div key={r.id} className="list-i"><span className="pimg"><Package size={16} /></span><div style={{ flex: 1 }}><div className="cell-main">{r.product.name}</div><div className="cell-sub">{r.stock} / min {r.min}</div></div><Badge v={r.status} /></div>)}</div></Card></div>
      {!isAI && <div className="c6"><RecentSales /></div>}
    </div>
    {isAI && <div className="row">
      <div className="c5"><Card style={{ height: '100%' }}><CardHead title="Stockout Risk" sub="Closest to running out"><Button size="sm" onClick={() => nav('/stockout-risk')}>View all</Button></CardHead>
        {atRisk.length ? atRisk.slice(0, 5).map((r) => <div key={r.id} className="list-i click" onClick={() => setDrawer(r)}><span style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: toneColor[r.risk.riskLevel] }} /><div style={{ flex: 1 }}><div className="cell-main">{r.product.name}</div><div className="cell-sub">{r.stock} in stock · {r.risk.daysUntilStockout} days left</div></div><Badge v={r.risk.riskLevel} /></div>) : <Empty title="No stockout risks" text="Everything is well covered." />}</Card></div>
      <div className="c7"><Card style={{ height: '100%' }}><CardHead title="Reorder Recommendations" sub={`${pendingRecs.length} pending review`}><Button size="sm" onClick={() => nav('/reorders')}>Review</Button></CardHead>
        {pendingRecs.length ? pendingRecs.slice(0, 4).map((r) => <div key={r.id} className="list-i"><span className="pimg"><Sparkles size={16} /></span><div style={{ flex: 1 }}><div className="cell-main">{r.productName}</div><div className="cell-sub">Order {r.suggestedReorderQuantity} units · {money(r.estimatedTotalCost)}</div></div><Badge v={r.urgency} /></div>) : <Empty title="All caught up" text="No pending recommendations." />}</Card></div></div>}
    {isAI && <div className="row"><div className="c12"><RecentSales /></div></div>}
    {drawer && <RiskDrawer row={drawer} onClose={() => setDrawer(null)} />}
  </div>;
}
function RecentSales() {
  const { data } = useApp(); const nav = useNavigate();
  return <Card style={{ height: '100%' }}><CardHead title="Recent Sales" sub="Latest recorded transactions"><Button size="sm" onClick={() => nav('/sales-history')}>History</Button></CardHead>
    {data.sales.slice(0, 5).map((s) => <div key={s.id} className="list-i"><span className="pimg"><Package size={16} /></span><div style={{ flex: 1 }}><div className="cell-main">{s.productName}</div><div className="cell-sub">{dtstr(s.saleDate)} · {s.customerReference}</div></div><div style={{ textAlign: 'right' }}><b>{money(s.totalAmount)}</b><div className="cell-sub">{s.quantity} units</div></div></div>)}</Card>;
}
export default function Dashboard() { return <Gate><Dash /></Gate>; }
