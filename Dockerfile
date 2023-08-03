FROM node:16.14.2

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

ENV PORT 5173

EXPOSE $PORT

CMD [ "npm", "run", "prodBuild" ]