# SmartStock AI — Frontend
`npm install && npm run dev` → http://localhost:5173

- `VITE_API_MODE=mock` (default): local demo data in localStorage. Demo logins: admin@smartstock.ai / Admin@123, manager@smartstock.ai / Manager@123, staff@smartstock.ai / Staff@123
- `VITE_API_MODE=live`: calls the Spring Boot backend (proxied `/api` → http://localhost:8080). Uses the seeded backend users (Admin123!, Manager123!, Staff123!).
- All backend calls live in `src/api/*.js`; components never touch mock data directly.
