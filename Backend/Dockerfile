FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install npm-run-all
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package.json ./package.json
CMD ["npm", "run", "start"]
EXPOSE 8000
