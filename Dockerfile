FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock prisma/schema.prisma ./

RUN yarn install


RUN yarn generate

COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn" , "start:migrate:prod"]
