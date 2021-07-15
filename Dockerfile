FROM node:14-buster-slim

# Install system dependencies
RUN apt-get update && apt-get install --no-install-recommends --yes \
    tini && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

USER node

# Set environment variables 
ENV HOST 0.0.0.0
ENV NODE_ENV production

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false && yarn cache clean --all

# Bundle app source
COPY . .

# Build project
RUN yarn build

EXPOSE 8080

CMD ["tini", "--", "node", "./dist/index.js"]
