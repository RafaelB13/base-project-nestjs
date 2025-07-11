# Dockerfile for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy node_modules and dist from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Production command
CMD ["node", "dist/main"]
