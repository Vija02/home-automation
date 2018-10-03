FROM node:alpine as dependencies

WORKDIR /temp-build

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

FROM node:alpine

WORKDIR /var/www/app/

COPY --from=dependencies /temp-build/ ./

EXPOSE 8000
CMD ["node", "./index.js"]