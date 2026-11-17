FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS test
ENV NODE_ENV=test
RUN npm ci
COPY src ./src
COPY test ./test
RUN npm test

FROM base AS production
ENV NODE_ENV=production
# Depender do estágio de teste obriga o BuildKit a executá-lo; sem isso ele seria ignorado.
COPY --from=test /app/package.json ./package.json
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node src ./src
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
