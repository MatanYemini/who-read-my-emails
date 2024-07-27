FROM node:lts-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV development

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "./src/server.js"]