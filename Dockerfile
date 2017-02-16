FROM node:6.2-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

ENV APP_PORT 3234
EXPOSE 3234

CMD [ "npm", "start" ]
