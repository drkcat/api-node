FROM node:alpine
LABEL org.opencontainers.image.source https://github.com/drkcat/api-node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000/udp

CMD ["npm", "start"]