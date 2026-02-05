FROM node:20-alpine AS builder
WORKDIR /k

COPY package*.json ./
RUN npm install

COPY . .

FROM node:20-alpine AS runner
WORKDIR /k

ENV NODE_ENV=production

COPY --from=builder /k /k

EXPOSE 3000

CMD ["node", "backend/server.js"]

