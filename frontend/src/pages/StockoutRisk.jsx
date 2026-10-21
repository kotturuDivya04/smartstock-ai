import { useMemo, useState } from 'react';
import Gate from '../components/Gate';
import { Card, CardHead, PageHeader, Badge, DataTable, SearchBox } from '../components/ui';
import { RiskBars } from '../components/charts';
import RiskDrawer from '../components/RiskDrawer';
import { useApp } from '../context/AppContext';
import { RISK_ORDER, toneColor } from '../utils/derive';
function Risk() {
  const { rows } = useApp(); const [q, setQ] = useState(''); const [lv, setLv] = useState(''); const [sel, setSel] = useState(null);
  const withRisk = rows.filter((r) => r.risk); const count = (l) => withRisk.filter((r) => r.risk.riskLevel === l).length;
  const list = useMemo(() => withRisk.filter((r) => (!lv || r.risk.riskLevel === lv) && r.product.name.toLowerCase().includes(q.toLowerCase())), [withRisk, q, lv]);
  const dist = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => ({ name: l[0] + l.slice(1).toLowerCase(), value: count(l), color: toneColor[l] }));
  const cols = [
    { key: 'p', label: 'Product', sortValue: (r) => r.product.name, render: (r) => <><div className="cell-main">{r.product.name}</div><div className="cell-sub">{r.product.sku}</div></> },
    { key: 's', label: 'Current Stock', sortValue: (r) => r.stock, render: (r) => r.stock }, { key: 'd', label: 'Predicted Demand (7d)', sortValue: (r) => r.predicted, render: (r) => `${r.predicted} units` },
    { key: 'e', label: 'Days Until Stockout', sortValue: (r) => r.risk.daysUntilStockout, render: (r) => <b>{r.risk.daysUntilStockout >= 999 ? '—' : `${r.risk.daysUntilStockout} days`}</b> },
    { key: 'l', label: 'Supplier Lead Time', sortValue: (r) => r.lead, render: (r) => `${r.lead} days` }, { key: 'r', label: 'Risk', sortValue: (r) => RISK_ORDER[r.risk.riskLevel], render: (r) => <Badge v={r.risk.riskLevel} /> },
  ];
  return <div><PageHeader title="Stockout Risk" sub="Find products likely to run out before restock arrives." />
    <div className="row">{['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => <div key={l} className="c3"><Card className="hover" onClick={() => setLv(lv === l ? '' : l)} style={{ cursor: 'pointer', borderColor: lv === l ? toneColor[l] : undefined }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Badge v={l} /><span style={{ width: 10, height: 10, borderRadius: 9, background: toneColor[l] }} /></div><div style={{ fontSize: 32, fontWeight: 800, margin: '10px 0 0' }}>{count(l)}</div><div className="cell-sub">products at {l.toLowerCase()} risk</div></Card></div>)}</div>
    <div className="row"><div className="c4"><Card style={{ height: '100%' }}><CardHead title="Risk distribution" /><RiskBars items={dist} /></Card></div>
      <div className="c8"><div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search products…" /><select className="select" aria-label="Risk level" value={lv} onChange={(e) => setLv(e.target.value)}><option value="">All risk levels</option>{['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((l) => <option key={l}>{l}</option>)}</select></div>
        <DataTable columns={cols} rows={list} onRowClick={setSel} initialSort={{ key: 'r', dir: 'asc' }} /><p className="cell-sub" style={{ marginTop: 8 }}>Click a row to see why a product is at risk.</p></div></div>
    {sel && <RiskDrawer row={sel} onClose={() => setSel(null)} />}</div>;
}
export default function StockoutRisk() { return <Gate><Risk /></Gate>; }
