FROM node:20

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["node", "dist/index.js"]
