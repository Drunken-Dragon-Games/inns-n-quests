#install dependencies only when needed
FROM node:alpine AS deps

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json ./
RUN npm install

#rebuild the source code only when needed

#install dependencies only when needed
FROM node:alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY next.config.js ./
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Productio Image, copy all the files and run next
FROM node:alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]