# SmartStock AI — local Docker test

This runs the Spring Boot API and React/Vite frontend in containers. The database remains your existing Aiven Cloud MySQL service; no local MySQL container is created.

## 1. Place files

Copy the backend `Dockerfile` and `.dockerignore` into `SmartStock-AI/backend/`.
Copy the frontend `Dockerfile`, `nginx.conf`, and `.dockerignore` into `SmartStock-AI/frontend/`.
Copy `compose.yaml` into the `SmartStock-AI/` project root (beside `backend/` and `frontend/`).

## 2. Check backend/.env

Use your existing local `backend/.env` if it contains the correct Aiven connection values. It must define `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`, and `JWT_SECRET`. Set `DB_DRIVER=com.mysql.cj.jdbc.Driver`.

If you need to create it, copy `backend/.env.example` to `backend/.env` and replace all placeholders. Do not commit `.env`.

## 3. Run from project root

```bash
docker compose config
docker compose up --build
```

Open the frontend at http://localhost:3000 and the backend health endpoint at http://localhost:8080/api/health.

To follow logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Stop containers without deleting data:

```bash
docker compose down
```

Rebuild after changing frontend/backend source:

```bash
docker compose up --build
```

## Notes

- The frontend container serves the built React app and proxies `/api/...` to the `backend` container. It uses live API mode, not mock mode.
- `VITE_API_URL` is intentionally empty so browser requests use same-origin `/api/...`; Nginx forwards those requests to Spring Boot.
- Aiven is external to Docker. Docker Compose does not start, wake, pause, or manage Aiven. If Aiven has powered off the service due to inactivity, power it on in the Aiven Console, wait for its status to become Running, then restart/retry the backend. Data remains in Aiven, not in the containers.
- `docker compose down` does not delete your Aiven database. Avoid `docker compose down -v` (there are no app data volumes required here anyway).
- The backend Docker build skips tests to keep image builds straightforward. Run `mvnw.cmd clean test` in `backend/` and `npm run build` in `frontend/` separately before relying on the image.
- Spring Boot has `spring.jpa.hibernate.ddl-auto=update`; on first connection it may update schema. This configuration does not intentionally drop tables, but always keep a backup of important data.
- This Compose setup is for local verification. Render/Vercel deployment settings will be configured separately.
