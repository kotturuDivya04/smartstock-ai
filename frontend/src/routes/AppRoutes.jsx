import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ALL_ITEMS } from './navConfig';
import Login from '../pages/Login';
import SupplierRegister from '../pages/SupplierRegister';
import Dashboard from '../pages/Dashboard';
import SupplierDashboard from '../pages/SupplierDashboard';
import Products from '../pages/Products';
import Suppliers from '../pages/Suppliers';
import SupplierOrders from '../pages/SupplierOrders';
import Inventory from '../pages/Inventory';
import Sales from '../pages/Sales';
import SalesHistory from '../pages/SalesHistory';
import DemandForecast from '../pages/DemandForecast';
import StockoutRisk from '../pages/StockoutRisk';
import Reorders from '../pages/Reorders';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import AccessDenied from '../pages/AccessDenied';

const PAGES = { '/dashboard': Dashboard, '/supplier-dashboard': SupplierDashboard, '/products': Products, '/suppliers': Suppliers, '/supplier-orders': SupplierOrders, '/inventory': Inventory, '/sales': Sales, '/sales-history': SalesHistory, '/forecast': DemandForecast, '/stockout-risk': StockoutRisk, '/reorders': Reorders, '/users': Users, '/settings': Settings };
function Guard({ roles, children }) { const { role } = useAuth(); return roles.includes(role) ? children : <AccessDenied />; }
function Protected() { const { user } = useAuth(); return user ? <Layout /> : <Navigate to="/login" replace />; }
export default function AppRoutes() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
    <Route path="/supplier/register" element={user ? <Navigate to="/dashboard" replace /> : <SupplierRegister />} />
    <Route element={<Protected />}>
      {ALL_ITEMS.map((i) => { const P = PAGES[i.path]; return <Route key={i.path} path={i.path} element={<Guard roles={i.roles}><P /></Guard>} />; })}
      <Route path="*" element={<AccessDenied notFound />} />
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
