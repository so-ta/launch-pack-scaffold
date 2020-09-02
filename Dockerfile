FROM node:12.10.0

ARG ENV="local"
ENV ENV=${ENV}

RUN mkdir /node
WORKDIR /node

COPY . .
RUN yarn install

RUN yarn build:${ENV}
CMD yarn launch -- ${ENV}

EXPOSE 1337
