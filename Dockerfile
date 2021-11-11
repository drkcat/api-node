FROM node:latest
LABEL org.opencontainers.image.source https://github.com/drkcat/api-node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY /usr/src/app/node_modules ./
COPY /usr/src/app/server.js ./
COPY /usr/src/app/utils.js ./
COPY /usr/src/app/controller.js ./
COPY /usr/src/app/service.js ./
COPY /usr/src/app/package.json ./

CMD ["npm", "start"]