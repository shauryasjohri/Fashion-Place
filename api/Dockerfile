# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

# ---- Production Stage ----
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy 2>/dev/null; npx prisma db push --accept-data-loss 2>/dev/null; node index.js"]
