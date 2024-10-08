FROM node:latest
WORKDIR /app
COPY . .
RUN npm install 
COPY . .
RUN npm run build && npx drizzle-kit migrate
EXPOSE 3333
CMD ["node", "dist/src/http/server.js"]
