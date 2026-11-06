FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev && chown -R node:node /app/data
ENV PORT=9000
EXPOSE 9000
USER node
CMD ["node", "dist/index.js"]