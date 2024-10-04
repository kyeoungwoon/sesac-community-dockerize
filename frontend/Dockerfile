# 첫 번째 단계: 빌드
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 두 번째 단계: 배포
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/ /etc/nginx/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]