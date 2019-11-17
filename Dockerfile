FROM node:10-alpine

# Override for non-production image with docker build --build-arg NODE_ENV=dev .
ARG NODE_ENV=production
ARG API_PORT=10010
ARG WS_URL

ENV NODE_ENV ${NODE_ENV}
ENV API_PORT ${API_PORT}
ENV WS_URL ${WS_URL}
ENV APP_HOME /home/node/app/

RUN yarn global add npm@5.1.0 &&\
    mkdir -p $APP_HOME &&\
    chown node:node $APP_HOME

WORKDIR $APP_HOME


COPY package.json package-lock.json $APP_HOME
RUN npm install

ADD . $APP_HOME
RUN chown -R node:node $APP_HOME

USER node

EXPOSE $API_PORT
CMD ["node", "src/app.js"]
