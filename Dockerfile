FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock prisma/schema.prisma ./

RUN yarn install


RUN yarn generate

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn migrate && yarn seed && yarn start:dev"]
