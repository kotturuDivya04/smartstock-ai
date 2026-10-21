// Local mock database (persisted in localStorage). Shapes mirror the Spring Boot response DTOs.
const KEY = 'ss_mockdb_v2';
export const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const iso = (d) => { const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`; };
const rng = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;

function seed() {
  const now = new Date();
  const suppliers = [
    [1, 'TechNova Distribution', 'orders@technova.example', '+91 40 5550 1101', 3, 'Plot 12, Gachibowli, Hyderabad'],
    [2, 'PeriphEx Global', 'sales@periphex.example', '+91 80 5550 2202', 5, '88 Whitefield Rd, Bengaluru'],
    [3, 'AudioWave Imports', 'hello@audiowave.example', '+91 22 5550 3303', 6, 'Andheri East, Mumbai'],
    [4, 'DataCore Storage', 'supply@datacore.example', '+91 44 5550 4404', 10, 'Guindy Industrial Estate, Chennai'],
    [5, 'Viewpoint Optics', 'trade@viewpoint.example', '+91 11 5550 5505', 7, 'Okhla Phase II, New Delhi'],
  ].map(([id, name, contactEmail, contactPhone, leadTimeDays, address]) => ({ id, name, contactEmail, contactPhone, leadTimeDays, address, createdAt: iso(new Date(now - 400 * 864e5)) }));
  // id, sku, name, category, sell, cost, min, max, supplier, stock, reserved, predicted7d, trend, wh, description
  const P = [
    [1, 'WM-101', 'Wireless Mouse', 'Accessories', 24.99, 12.5, 50, 300, 1, 42, 6, 58, .35, 'WH-A / Aisle 1', 'Ergonomic 2.4GHz wireless mouse with silent clicks'],
    [2, 'MK-210', 'Mechanical Keyboard', 'Accessories', 89.99, 52, 30, 200, 1, 118, 10, 41, 0, 'WH-A / Aisle 2', 'Hot-swappable mechanical keyboard, tactile switches'],
    [3, 'UH-330', 'USB-C Hub', 'Accessories', 39.99, 21, 40, 250, 2, 18, 3, 49, .45, 'WH-B / Aisle 1', '7-in-1 USB-C hub with HDMI and card reader'],
    [4, 'LS-415', 'Laptop Stand', 'Ergonomics', 34.99, 16, 25, 150, 2, 96, 4, 22, -.1, 'WH-B / Aisle 3', 'Adjustable aluminium laptop stand'],
    [5, 'WC-520', 'Webcam', 'Video', 59.99, 31, 20, 120, 5, 24, 2, 19, .15, 'WH-C / Aisle 1', '1080p webcam with autofocus and dual microphones'],
    [6, 'BH-630', 'Bluetooth Headphones', 'Audio', 79.99, 41, 35, 220, 3, 140, 8, 38, .08, 'WH-C / Aisle 2', 'Over-ear ANC headphones, 40h battery'],
    [7, 'PS-740', 'Portable SSD', 'Storage', 119.99, 78, 25, 150, 4, 61, 5, 30, .12, 'WH-C / Aisle 4', '1TB NVMe portable SSD, USB 3.2'],
    [8, 'WL-850', 'Wireless Charger', 'Accessories', 29.99, 14, 40, 240, 2, 105, 7, 33, .05, 'WH-A / Aisle 4', '15W Qi fast wireless charging pad'],
  ];
  const sup = (id) => suppliers.find((s) => s.id === id);
  const products = P.map((p) => ({ id: p[0], sku: p[1], name: p[2], description: p[14], category: p[3], sellingPrice: p[4], unitPrice: p[4], costPrice: p[5], minimumStock: p[6], minStockLevel: p[6], maximumStock: p[7], maxStockLevel: p[7], supplierId: p[8], createdAt: iso(new Date(now - 300 * 864e5)) }));
  const inventory = P.map((p) => ({ id: p[0], productId: p[0], productSku: p[1], productName: p[2], currentStock: p[9], reservedStock: p[10], availableStock: p[9] - p[10], minStockLevel: p[6], maxStockLevel: p[7], warehouseLocation: p[13], lastRestockedAt: iso(new Date(now - (8 + p[0] * 3) * 864e5)), updatedAt: iso(new Date(now - p[0] * 36e5)) }));
  const predictions = P.map((p, i) => ({ id: p[0], productId: p[0], productSku: p[1], productName: p[2], predictedQuantity: p[11], forecastDays: 7, confidenceScore: [0.86, 0.91, 0.83, 0.88, 0.8, 0.9, 0.87, 0.89][i], modelName: 'Tribuo CART Regression', predictionDate: iso(now) }));
  const sales = []; let n = 1000; const r = rng(42);
  P.forEach((p) => {
    const base = p[11] / 7 / (1 + p[12] * 0.9);
    for (let d = 89; d >= 0; d--) {
      const dt = new Date(now); dt.setDate(dt.getDate() - d); dt.setHours(9 + Math.floor(r() * 8), Math.floor(r() * 60), 0, 0);
      if (d === 0 && dt > now) dt.setHours(Math.max(0, now.getHours() - 1));
      const wk = [0, 6].includes(dt.getDay()) ? 1.25 : 1;
      const q = Math.round(base * (0.7 + 0.6 * r()) * wk * (1 + p[12] * ((90 - d) / 90)));
      if (q <= 0) continue;
      sales.push({ id: ++n, productId: p[0], productSku: p[1], productName: p[2], quantity: q, unitPrice: p[4], totalAmount: +(q * p[4]).toFixed(2), saleDate: iso(dt), customerReference: r() < 0.5 ? 'WALK-IN' : `ORD-${n}`, createdAt: iso(dt) });
    }
  });
  const R = [[1, 220, 'HIGH', 'PENDING'], [3, 200, 'CRITICAL', 'PENDING'], [5, 70, 'HIGH', 'PENDING'], [2, 80, 'LOW', 'APPROVED'], [4, 40, 'LOW', 'REJECTED'], [6, 120, 'LOW', 'MODIFIED'], [7, 60, 'MEDIUM', 'APPROVED'], [8, 100, 'LOW', 'APPROVED']];
  const reorders = R.map(([pid, q, urgency, status], i) => {
    const p = products[pid - 1]; const rev = status !== 'PENDING';
    return { id: i + 1, productId: pid, productSku: p.sku, productName: p.name, currentStock: inventory[pid - 1].currentStock, minStockLevel: p.minStockLevel, maxStockLevel: p.maxStockLevel, suggestedReorderQuantity: q, unitCost: p.costPrice, estimatedTotalCost: +(q * p.costPrice).toFixed(2), supplierName: sup(p.supplierId).name, urgency, status, reviewedBy: rev ? 'manager@smartstock.ai' : null, reviewedAt: rev ? iso(new Date(now - (i + 1) * 864e5)) : null };
  });
  const users = [
    { id: 1, name: 'System Admin', email: 'admin@smartstock.ai', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-10' },
    { id: 2, name: 'Inventory Manager', email: 'manager@smartstock.ai', role: 'MANAGER', status: 'ACTIVE', createdAt: '2025-01-12' },
    { id: 3, name: 'Floor Staff', email: 'staff@smartstock.ai', role: 'STAFF', status: 'ACTIVE', createdAt: '2025-02-03' },
  ];
  return { suppliers, products, inventory, predictions, sales, reorders, users, seq: { product: 9, supplier: 6, user: 4, sale: n + 1 } };
}

let db = null;
try { db = JSON.parse(localStorage.getItem(KEY)); } catch { /* ignore */ }
if (!db) { db = seed(); localStorage.setItem(KEY, JSON.stringify(db)); }
export const getDb = () => db;
export const save = () => localStorage.setItem(KEY, JSON.stringify(db));
export const resetDb = () => { db = seed(); save(); };
export const nowIso = () => iso(new Date());
