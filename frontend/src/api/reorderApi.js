import { http } from './http';

// GET /api/reorders/recommendations — fetch existing recommendations
export async function getRecommendations() {
  return http('/api/reorders/recommendations');
}

// POST /api/reorders/generate
export async function generate() { 
  return http('/api/reorders/generate', { method: 'POST' }); 
}

async function review(id, status, qty, path) {
  return http(path, { method: 'POST' });
}

// POST /api/reorders/{id}/accept | /modify?newQuantity= | /reject
export const acceptRecommendation = (id) => review(id, 'APPROVED', null, `/api/reorders/${id}/accept`);
export const modifyRecommendation = (id, q) => review(id, 'MODIFIED', q, `/api/reorders/${id}/modify?newQuantity=${q}`);
export const rejectRecommendation = (id) => review(id, 'REJECTED', null, `/api/reorders/${id}/reject`);

