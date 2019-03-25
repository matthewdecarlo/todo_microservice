# Build Application
FROM node:8.10 as build-application
WORKDIR to_do_app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
CMD yarn build