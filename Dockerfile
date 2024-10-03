FROM node:20.17.0

WORKDIR /server/app

COPY ./package.json /server/app
COPY ./package-lock.json /server/app
RUN npm install

COPY . /server/app/

EXPOSE 3333

CMD ["npm", "run", "dev"]