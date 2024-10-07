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

# Comando para rodar a aplicação
CMD ["node", "dist/src/http/server.js"]
