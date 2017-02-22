FROM node:6.2-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

# Build client
RUN npm run build-prod

# Build server
RUN npm run build-server


ENV APP_PORT 80
EXPOSE 80

CMD [ "npm", "start" ]
