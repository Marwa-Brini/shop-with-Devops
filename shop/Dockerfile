# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create non-root user for security
RUN addgroup -S shopgroup && adduser -S shopuser -G shopgroup
USER shopuser

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Start the app
CMD ["node", "server.js"]
