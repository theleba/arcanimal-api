FROM node:latest
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
COPY .env ./.env

RUN yarn install
RUN yarn generate
RUN yarn build

EXPOSE 8000
ENV NODE_ENV production
CMD ["yarn" , "start:migrate:prod"]