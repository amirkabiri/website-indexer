FROM alpine

# init envrionment
RUN \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update

# install mongodb
RUN apk add --no-cache mongodb
RUN \
    mkdir /data && \
    mkdir /data/db
RUN apk add mongodb-tools

# install node.js
RUN apk add nodejs && apk add npm

# install app dependencies
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g yarn && yarn install

COPY . .
EXPOSE 3000

# set env variables
ENV DATABASE_URL=mongodb://localhost:27017/ir
ENV PORT=3000

# start up command
CMD \
    mongod --bind_ip 0.0.0.0 --fork --logpath /var/log/mongod.log && \
    mongorestore --uri mongodb://localhost:27017 ./backup/backup2-thousand-pages-of-github-repos-indexed && \
    npm run start:web