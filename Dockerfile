FROM node:12-alpine as frontend-application-build
WORKDIR /app
RUN apk update && apk add git
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY public public
COPY tsconfig.json tsconfig.json
COPY env.example env.example
RUN cp env.example .env
COPY src src
RUN yarn run build
COPY settings settings


FROM nginx:1.18-alpine
COPY --from=frontend-application-build /app/settings/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=frontend-application-build /app/settings/app-nginx.conf /etc/nginx/conf.d/app-nginx.conf
COPY --from=frontend-application-build /app/build /app
COPY --from=frontend-application-build /app/.env /app
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD  ["nginx","-g","daemon off;"]
