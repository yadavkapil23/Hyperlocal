FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]


