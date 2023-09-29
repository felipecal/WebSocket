FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npx", "babel-node", "--presets", "@babel/preset-env", "src/socket/index.js" ]
