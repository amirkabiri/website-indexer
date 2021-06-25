FROM mongo
WORKDIR /home
COPY ./src/backup .
CMD mongorestore --uri "mongodb://mongo:27017" "/home/backup/backup2-thousand-pages-of-github-repos-indexed"

FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN npm install yarn && yarn install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:web"]
