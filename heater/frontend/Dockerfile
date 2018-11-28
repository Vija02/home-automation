FROM node:lts-alpine as build

RUN apk add --update gzip

WORKDIR /temp-build

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build
RUN yarn gzip

FROM drakerin/rpi-alpine-nginx

COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=build /temp-build/build /usr/share/nginx/html