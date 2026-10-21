import { http } from './http';

// GET /api/supplier-orders
export async function getAllOrders() {
  return http('/api/supplier-orders');
}

// GET /api/supplier-orders/my
export async function getMyOrders() {
  return http(`/api/supplier-orders/my`);
}

// PUT /api/supplier-orders/:id/status
export async function updateOrderStatus(orderId, status) {
  return http(`/api/supplier-orders/${orderId}/status?status=${status}`, { method: 'PUT' });
}
