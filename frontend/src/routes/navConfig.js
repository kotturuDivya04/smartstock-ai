import { LayoutDashboard, Package, Truck, Boxes, ShoppingCart, History, LineChart, ShieldAlert, ClipboardCheck, Users, Settings, ClipboardList } from 'lucide-react';
const ALL = ['ADMIN', 'MANAGER', 'STAFF']; 
const AM = ['ADMIN', 'MANAGER'];
const SUP = ['SUPPLIER'];
const NOT_SUP = ['ADMIN', 'MANAGER', 'STAFF'];

export const NAV = [
  { group: 'OVERVIEW', items: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ALL },
    { path: '/supplier-dashboard', label: 'Supplier Dashboard', icon: LayoutDashboard, roles: SUP }
  ] },
  { group: 'OPERATIONS', items: [
    { path: '/products', label: 'Products', icon: Package, roles: NOT_SUP }, 
    { path: '/suppliers', label: 'Suppliers', icon: Truck, roles: AM },
    { path: '/supplier-orders', label: 'Supplier Orders', icon: ClipboardList, roles: AM },
    { path: '/inventory', label: 'Inventory', icon: Boxes, roles: NOT_SUP }, 
    { path: '/sales', label: 'Sales', icon: ShoppingCart, roles: NOT_SUP }, 
    { path: '/sales-history', label: 'Sales History', icon: History, roles: NOT_SUP }
  ] },
  { group: 'AI INSIGHTS', items: [
    { path: '/forecast', label: 'Demand Forecast', icon: LineChart, roles: AM }, 
    { path: '/stockout-risk', label: 'Stockout Risk', icon: ShieldAlert, roles: AM }, 
    { path: '/reorders', label: 'Reorder Recommendations', icon: ClipboardCheck, roles: AM }
  ] },
  { group: 'ADMINISTRATION', items: [
    { path: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] }, 
    { path: '/settings', label: 'Settings', icon: Settings, roles: [...ALL, ...SUP] }
  ] },
];
export const ALL_ITEMS = NAV.flatMap((g) => g.items);
