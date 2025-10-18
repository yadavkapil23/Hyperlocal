FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .
EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


