# -------- STAGE 1: Install & Build --------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

# -------- STAGE 2: Run-only (slim) --------
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/apps/api-gateway/src/main.js"]
