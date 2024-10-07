# Use uma imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos para o diretório de trabalho
COPY . .

# Compile o TypeScript para JavaScript (caso esteja usando TypeScript)
RUN npm run build

# Exponha a porta que sua aplicação usa
EXPOSE 3333

ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_PORT=${DB_PORT}
ENV DB_TYPE=${DB_TYPE}

CMD ["node", "dist/src/http/server.js"]
