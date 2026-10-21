import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import * as productApi from '../api/productApi';
import * as supplierApi from '../api/supplierApi';
import * as inventoryApi from '../api/inventoryApi';
import * as salesApi from '../api/salesApi';
import * as predictionApi from '../api/predictionApi';
import * as stockoutApi from '../api/stockoutApi';
import * as reorderApi from '../api/reorderApi';
import { stockStatus, RISK_ORDER } from '../utils/derive';
const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((type, message) => {
    const id = Math.random(); setToasts((t) => [...t, { id, type, message }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    // SUPPLIER role cannot access products/inventory/sales/reorder/stockout APIs.
    // Set empty placeholder data so Gate renders and supplier pages can load their own data.
    if (user?.role === 'SUPPLIER') {
      setData({ products: [], suppliers: [], inventory: [], sales: [], risks: [], reorders: [], predictions: [] });
      setError(null);
      setLoading(false);
      return;
    }
    try {
      const [products, suppliers, inventory, sales, risks, reorders] = await Promise.all([productApi.getProducts(), supplierApi.getSuppliers(), inventoryApi.getInventory(), salesApi.getSales(), stockoutApi.getRisks(), reorderApi.getRecommendations()]);
      const predictions = await predictionApi.getLatestPredictions(products);
      setData({ products, suppliers, inventory, sales, risks, reorders, predictions }); setError(null);
    } catch (e) { setError(e.message || 'Failed to load data'); }
    setLoading(false);
  }, [user]);
  useEffect(() => { if (user) load(); else { setData(null); setLoading(true); } }, [user, load]);

  // One joined row per product: the single source the pages render from.
  const rows = useMemo(() => {
    if (!data) return [];
    return data.products.map((p) => {
      const inv = data.inventory.find((i) => i.productId === p.id) || {};
      const sup = data.suppliers.find((s) => s.id === p.supplierId);
      const pred = data.predictions.find((x) => x.productId === p.id);
      const rk = data.risks.find((x) => x.productId === p.id);
      const rec = data.reorders.find((x) => x.productId === p.id && x.status === 'PENDING') || data.reorders.find((x) => x.productId === p.id);
      const min = p.minStockLevel ?? p.minimumStock ?? 0; const stock = inv.currentStock ?? 0;
      return { id: p.id, product: p, inv, sup, pred, rec, min, max: p.maxStockLevel ?? p.maximumStock ?? 0, stock, status: stockStatus(stock, min), lead: sup?.leadTimeDays ?? 7, predicted: Math.round(pred?.predictedQuantity || 0), risk: rk ? { ...rk, lead: sup?.leadTimeDays ?? 7 } : null };
    });
  }, [data]);
  const stats = useMemo(() => {
    if (!data) return {};
    const t = new Date().toDateString();
    return {
      total: rows.length, low: rows.filter((r) => r.status !== 'HEALTHY').length, healthy: rows.filter((r) => r.status === 'HEALTHY').length, lowOnly: rows.filter((r) => r.status === 'LOW').length, critical: rows.filter((r) => r.status === 'CRITICAL').length,
      atRisk: data.risks.filter((r) => RISK_ORDER[r.riskLevel] <= 1).length, pending: data.reorders.filter((r) => r.status === 'PENDING').length,
      todaySales: data.sales.filter((s) => new Date(s.saleDate).toDateString() === t).reduce((a, s) => a + Number(s.totalAmount), 0),
    };
  }, [data, rows]);
  return <Ctx.Provider value={{ data, rows, stats, loading, error, reload: load, toast }}>
    {children}
    <div className="toasts" role="status" aria-live="polite">{toasts.map((t) => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div>
  </Ctx.Provider>;
}
