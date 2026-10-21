import { isMock } from '../config';
import { http } from './http';
import { delay, getDb } from './mockDb';
// GET /api/inventory
export const getInventory = async () => (isMock ? (await delay(400), getDb().inventory.map((i) => ({ ...i }))) : http('/api/inventory'));
