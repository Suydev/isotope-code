# ── IsotopeAI Self-Host — Docker Image ─────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install deps first (cached layer)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy app files
COPY server.mjs ./
COPY public/ ./public/
COPY index.html ./

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.mjs"]
