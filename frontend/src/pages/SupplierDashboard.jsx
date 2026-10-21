import { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { getMyOrders, updateOrderStatus } from '../api/supplierOrderApi';
import { useAuth } from '../context/AuthContext';

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load supplier orders:', e);
      setError(e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Re-fetch from backend after status change
    } catch (e) {
      alert('Failed to update status: ' + (e.message || 'Unknown error'));
    }
  };

  const stats = [
    { title: 'Pending Orders', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock },
    { title: 'Processing', value: orders.filter(o => o.status === 'PROCESSING' || o.status === 'ACCEPTED').length, icon: Package },
    { title: 'Shipped', value: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck },
    { title: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Supplier Dashboard</h1>
          <p className="page-desc">Manage your orders and fulfillments</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <Card key={i} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{s.title}</span>
              <s.icon size={18} className="stat-icon" />
            </div>
            <div className="stat-value">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Active Orders</span>
          <button className="btn btn-sm" onClick={loadOrders} style={{ fontSize: 12 }}>↻ Refresh</button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>Loading orders…</td></tr>
              ) : error ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ color: '#DC2626', marginBottom: 8 }}>⚠ {error}</div>
                  <button className="btn btn-sm btn-pri" onClick={loadOrders}>Retry</button>
                </td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>No orders assigned to you yet. Orders will appear here when a manager approves a reorder for your products.</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>
                    <span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</td>
                  <td>
                    {o.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-pri" onClick={() => updateStatus(o.id, 'ACCEPTED')}>Accept</button>
                        <button className="btn btn-sm" onClick={() => updateStatus(o.id, 'REJECTED')} style={{ color: 'red' }}>Reject</button>
                      </div>
                    )}
                    {o.status === 'ACCEPTED' && (
                      <button className="btn btn-sm btn-pri" onClick={() => updateStatus(o.id, 'PROCESSING')}>Start Processing</button>
                    )}
                    {o.status === 'PROCESSING' && (
                      <button className="btn btn-sm btn-pri" onClick={() => updateStatus(o.id, 'SHIPPED')}>Mark Shipped</button>
                    )}
                    {o.status === 'SHIPPED' && (
                      <button className="btn btn-sm btn-pri" onClick={() => updateStatus(o.id, 'DELIVERED')}>Mark Delivered</button>
                    )}
                    {o.status === 'DELIVERED' && (
                      <button className="btn btn-sm" disabled>Delivered</button>
                    )}
                    {o.status === 'REJECTED' && (
                      <button className="btn btn-sm" disabled style={{ color: 'red' }}>Rejected</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
