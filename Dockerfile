FROM node:latest
WORKDIR /app
COPY . .
RUN npm install && npx drizzle-kit migrate 
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["node", "dist/src/http/server.js"]
