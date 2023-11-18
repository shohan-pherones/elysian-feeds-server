FROM node:18-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN apk update && \
    apk add --no-cache make gcc g++ && \
    apk add --no-cache python3 || apk add --no-cache python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]