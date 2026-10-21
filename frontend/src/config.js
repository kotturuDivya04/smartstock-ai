// API mode: "mock" (local demo data, default) or "live" (Spring Boot REST API via /api proxy).
// API mode: mock or live
export const MODE = import.meta.env.VITE_API_MODE || 'mock';
export const API_BASE = import.meta.env.VITE_API_URL || '';
export const isMock = MODE === 'mock';
// Frontend-only demo credentials. In live mode the seeded backend users are used instead.
export const DEMO_ACCOUNTS = [
  { role: 'ADMIN', name: 'System Admin', email: 'admin@smartstock.ai', password: isMock ? 'Admin@123' : 'Admin123!', blurb: 'Full access' },
  { role: 'MANAGER', name: 'Inventory Manager', email: 'manager@smartstock.ai', password: isMock ? 'Manager@123' : 'Manager123!', blurb: 'Approves reorders' },
  { role: 'STAFF', name: 'Floor Staff', email: 'staff@smartstock.ai', password: isMock ? 'Staff@123' : 'Staff123!', blurb: 'Sales & stock' },
];
