# Stage 1: Install dependencies and build
FROM node:22.16.0-alpine AS build

WORKDIR /app

# Copy only the dependency files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally, install dependencies, and cache layers properly
RUN npm install -g pnpm@10.12.4 && pnpm install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Build the application and remove dev dependencies to save space in next stage
RUN pnpm build && pnpm prune --prod

# Stage 2: Production image
FROM node:22.16.0-alpine

WORKDIR /app

# Install `node-prune` to remove unnecessary files from node_modules

# Copy only the build output and production node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Run node-prune to clean up
RUN wget -q -O - https://gobinaries.com/tj/node-prune | sh && node-prune

# Use non-root user
USER node

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]

# Optional healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --quiet --spider http://localhost:3000/ || exit 1
