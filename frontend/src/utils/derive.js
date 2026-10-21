export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const num = (n) => Number(n || 0).toLocaleString('en-IN');
export const dstr = (s) => (s ? new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const dtstr = (s) => (s ? new Date(s).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
export const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
export const toLocalInput = (d = new Date()) => `${dayKey(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
export const stockStatus = (stock, min) => (stock <= min * 0.5 ? 'CRITICAL' : stock <= min * 1.25 ? 'LOW' : 'HEALTHY');
export const RISK_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
export const tone = { CRITICAL: 'b-red', HIGH: 'b-org', MEDIUM: 'b-amb', LOW: 'b-green', HEALTHY: 'b-green', PENDING: 'b-amb', APPROVED: 'b-green', REJECTED: 'b-red', MODIFIED: 'b-blue', ACTIVE: 'b-green', DISABLED: 'b-gray' };
export const toneColor = { CRITICAL: '#DC2626', HIGH: '#EA580C', MEDIUM: '#D97706', LOW: '#16A34A', HEALTHY: '#16A34A' };
export const initials = (n = '') => n.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();

// Per-day units sold for a product over the last `days` days.
export function dailySeries(sales, productId, days) {
  const map = {}; sales.forEach((s) => { if (s.productId === productId) map[dayKey(s.saleDate)] = (map[dayKey(s.saleDate)] || 0) + s.quantity; });
  const out = []; for (let i = days - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push({ date: d, key: dayKey(d), qty: map[dayKey(d)] || 0 }); }
  return out;
}
const lbl = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
// Historical (solid) + predicted (dashed) chart data. Prediction is the model's daily average spread over the horizon.
export function buildForecast(sales, prediction, productId, days) {
  const hist = dailySeries(sales, productId, days);
  const avg = prediction ? prediction.predictedQuantity / (prediction.forecastDays || 7) : 0;
  const data = hist.map((h, i) => ({ label: lbl(h.date), historical: h.qty, predicted: i === hist.length - 1 ? h.qty : null }));
  let total = 0;
  for (let i = 1; i <= days; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const v = Math.max(0, +(avg * (1 + 0.12 * Math.sin(i * 0.9)) * ([0, 6].includes(d.getDay()) ? 1.15 : 1)).toFixed(1)); total += v;
    data.push({ label: lbl(d), historical: null, predicted: v });
  }
  return { data, total: Math.round(total) };
}
export function demandStats(sales, productId) {
  const s = dailySeries(sales, productId, 90).map((x) => x.qty); const sum = (a) => a.reduce((x, y) => x + y, 0);
  const last7 = sum(s.slice(-7)), prev7 = sum(s.slice(-14, -7)); const trend = prev7 ? ((last7 - prev7) / prev7) * 100 : 0;
  const dd = dailySeries(sales, productId, 90); const wk = dd.filter((x) => [0, 6].includes(x.date.getDay())), wd = dd.filter((x) => ![0, 6].includes(x.date.getDay()));
  const aw = sum(wk.map((x) => x.qty)) / (wk.length || 1), ad = sum(wd.map((x) => x.qty)) / (wd.length || 1);
  return { total90: sum(s), ma7: sum(s.slice(-7)) / 7, ma30: sum(s.slice(-30)) / 30, trend, weekendLift: ad ? ((aw - ad) / ad) * 100 : 0 };
}
export function riskReason(r) {
  const d = r.daysUntilStockout, l = r.lead;
  if (r.currentStock <= 0) return 'This product is already out of stock.';
  if (d <= l) return `Predicted demand will exhaust inventory in ${d} days, before the next expected replenishment (${l} days lead time).`;
  if (r.riskLevel === 'HIGH') return `Stock lasts ${d} days, only ${(d - l).toFixed(1)} days longer than the supplier lead time. Any demand spike causes a stockout.`;
  if (r.riskLevel === 'MEDIUM') return `Stock should cover ${d} days, a modest buffer over the ${l}-day supplier lead time. Plan a reorder soon.`;
  return 'Available inventory comfortably covers predicted demand beyond the supplier lead time.';
}
