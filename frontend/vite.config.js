import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// In live mode, /api requests are proxied to the Spring Boot backend (CORS is disabled there).
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:8080' } } });
