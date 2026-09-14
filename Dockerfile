# Isotope AI - Self-hosted AI study planner
# Multi-stage build for production deployments
# Usage: docker build -t isotope . && docker run -p 3000:3000 -e SUPABASE_URL=... -e SUPABASE_ANON_KEY=... isotope

# ── Build stage ─────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies (production only for smaller image)
RUN npm ci --omit=dev --prefer-offline

# Copy application source
COPY . .

# ── Runtime stage ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY --from=builder /app/. .
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/sql ./sql
COPY --from=builder /app/public ./public
COPY --from=builder /app/supabase ./supabase

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Environment defaults
ENV PORT=3000
ENV NODE_ENV=production

# Expose the configured port
EXPOSE ${PORT}

# Health check (optional, can be enabled on platforms that support it)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/api/health || exit 1

# Start the server (requires .env with SUPABASE_URL and SUPABASE_ANON_KEY)
CMD ["node", "server.mjs"]