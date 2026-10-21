import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';
const ax = { fontSize: 11, fill: '#64748B' };
export function ForecastChart({ data, height = 300 }) {
  const split = data.find((d) => d.historical === null)?.label;
  return <div style={{ height }}><ResponsiveContainer><ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
    <CartesianGrid stroke="#EEF2F6" vertical={false} /><XAxis dataKey="label" tick={ax} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} interval="preserveStartEnd" minTickGap={28} /><YAxis tick={ax} tickLine={false} axisLine={false} />
    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} formatter={(v, n) => [`${v} units`, n]} /><Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
    {split && <ReferenceLine x={split} stroke="#94A3B8" strokeDasharray="2 3" label={{ value: 'Today', fontSize: 10, fill: '#64748B', position: 'insideTopLeft' }} />}
    <Line name="Historical demand" type="monotone" dataKey="historical" stroke="#0F172A" strokeWidth={2} dot={false} connectNulls={false} animationDuration={700} />
    <Line name="Predicted demand" type="monotone" dataKey="predicted" stroke="#16A34A" strokeWidth={2.5} strokeDasharray="6 4" dot={false} animationDuration={900} />
  </ComposedChart></ResponsiveContainer></div>;
}
export function Donut({ items, center, sub }) {
  return <div style={{ position: 'relative', width: 170, height: 170, flexShrink: 0 }}><ResponsiveContainer><PieChart><Pie data={items} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3} stroke="none" startAngle={90} endAngle={-270} animationDuration={800}>{items.map((i) => <Cell key={i.name} fill={i.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} /></PieChart></ResponsiveContainer>
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }}><div><div style={{ fontSize: 26, fontWeight: 800 }}>{center}</div><div style={{ fontSize: 11, color: '#64748B' }}>{sub}</div></div></div></div>;
}
export function Spark({ values, color = '#16A34A', height = 56 }) {
  const d = values.map((v, i) => ({ i, v }));
  return <div style={{ height }}><ResponsiveContainer><AreaChart data={d} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}><defs><linearGradient id={'sp' + color.slice(1)} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs><Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sp${color.slice(1)})`} isAnimationActive /></AreaChart></ResponsiveContainer></div>;
}
export function RiskBars({ items }) {
  return <div style={{ height: 180 }}><ResponsiveContainer><BarChart data={items} margin={{ left: -24, top: 6 }}><CartesianGrid stroke="#EEF2F6" vertical={false} /><XAxis dataKey="name" tick={ax} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={ax} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: 10, fontSize: 12 }} /><Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={700}>{items.map((i) => <Cell key={i.name} fill={i.color} />)}</Bar></BarChart></ResponsiveContainer></div>;
}
