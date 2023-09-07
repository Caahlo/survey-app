FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install typescript -g
RUN npm install
RUN tsc

FROM nginx:latest
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/src /usr/share/nginx/html
EXPOSE 80
