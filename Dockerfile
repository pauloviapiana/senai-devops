FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.js JogoNumeroSecreto.js ./
COPY test ./test

ENV NODE_ENV=test

CMD ["npm", "test"]