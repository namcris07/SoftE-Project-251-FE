# LIGHTWEIGHT NODE
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# NO DEV DEPENDENCIES
RUN npm run build --only=production

FROM nginx:1.27-alpine3.21-slim

# COPY THE BUILD FILE
COPY --from=build /app/build /usr/share/nginx/html

# NGINX DEFAULT PORT
EXPOSE 80
