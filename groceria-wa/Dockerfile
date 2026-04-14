# --- Build SPA ---
FROM node:22-alpine AS builder
WORKDIR /app

# Build-time env for Vite (baked into the JS bundle)
ARG VITE_WHATSAPP_NUMBER=
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- Serve static files ---
FROM nginx:1.27-alpine AS runner
RUN apk add --no-cache curl

LABEL org.opencontainers.image.title="groceria-wa"
LABEL org.opencontainers.image.description="WhatsApp grocery storefront + admin (React)"
LABEL org.opencontainers.image.source="https://hub.docker.com/repositories/akhilthadaa"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://127.0.0.1/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
