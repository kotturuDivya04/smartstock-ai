# Build React/Vite frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production must use the real Spring Boot API, not mock/demo data.
ARG VITE_API_MODE=live
ARG VITE_API_URL=
ENV VITE_API_MODE=${VITE_API_MODE}
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Serve SPA and reverse-proxy API calls to backend container
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
