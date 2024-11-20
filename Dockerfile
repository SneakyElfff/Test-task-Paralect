# Этап сборки клиентской части
FROM node:16 AS build

WORKDIR /app/client

COPY ./client/package.json ./client/package-lock.json ./

RUN npm install
RUN npm run build

# Этап для сервера
FROM node:16

WORKDIR /app

COPY ./server/package.json ./server/package-lock.json ./
RUN npm install

COPY ./server ./server
COPY --from=build /app/client/build ./client/build

EXPOSE 3001

CMD ["node", "./server/bin/www"]