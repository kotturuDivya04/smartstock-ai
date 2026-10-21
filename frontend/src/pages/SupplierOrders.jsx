import { useState, useEffect } from 'react';
import { Card, PageHeader, DataTable, Empty } from '../components/ui';
import Gate from '../components/Gate';
import { getAllOrders } from '../api/supplierOrderApi';

function SupplierOrdersPage() {
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
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load supplier orders:', e);
      setError(e.message || 'Failed to load supplier orders');
    } finally {
      setLoading(false);
    }
  };

  const cols = [
    { key: 'id', label: 'Order ID', render: (o) => `#${o.id}` },
    { key: 'product', label: 'Product', render: (o) => <div className="cell-main">{o.productName}</div> },
    { key: 'supplier', label: 'Supplier', render: (o) => <div><div className="cell-main">{o.supplierName}</div></div> },
    { key: 'qty', label: 'Quantity', render: (o) => o.quantity },
    { key: 'lead', label: 'Lead Time', render: (o) => o.leadTimeDays != null ? `${o.leadTimeDays} days` : '—' },
    { key: 'date', label: 'Order Date', render: (o) => o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—' },
    { key: 'expected', label: 'Expected', render: (o) => o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: (o) => (
      <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
        background: o.status === 'DELIVERED' ? '#DCFCE7' : o.status === 'REJECTED' ? '#FEE2E2' : o.status === 'SHIPPED' ? '#DBEAFE' : o.status === 'PROCESSING' ? '#FEF3C7' : '#F1F5F9',
        color: o.status === 'DELIVERED' ? '#166534' : o.status === 'REJECTED' ? '#B91C1C' : o.status === 'SHIPPED' ? '#1D4ED8' : o.status === 'PROCESSING' ? '#B45309' : '#475569' }}>
        {o.status}
      </span>
    )}
  ];

  return (
    <div>
      <PageHeader title="Supplier Orders" sub="Monitor all supplier orders and fulfillments." />
      <Card>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading orders…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ color: '#DC2626', marginBottom: 12 }}>⚠ {error}</div>
            <button className="btn btn-sm btn-pri" onClick={loadOrders}>Retry</button>
          </div>
        ) : (
          <DataTable columns={cols} rows={orders} empty={<Empty title="No supplier orders" text="Approved reorder recommendations will appear here as supplier orders." />} />
        )}
      </Card>
    </div>
  );
}

export default function SupplierOrders() {
  return <Gate><SupplierOrdersPage /></Gate>;
}
