FROM node:latest
WORKDIR /app
COPY . .
RUN npm install 
COPY . .
RUN npm run build
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 3333
CMD ["sh", "/app/entrypoint.sh"]