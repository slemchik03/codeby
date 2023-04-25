FROM node:19-alpine

ENV NODE_ENV production

WORKDIR /app

COPY ./public ./public
COPY ./package.json ./package.json

RUN npm install

COPY ./.next/ ./.next/
COPY ./next.config.js ./next.config.js
COPY ./.env.local ./.env.local

CMD ["npx next start -H 0.0.0.0 -p 3000"]