# Use uma imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY . .

# Instale as dependências
RUN npm install && npx drizzle-kit migrate

# Copie todos os arquivos para o diretório de trabalho
COPY . .

# Compile o TypeScript para JavaScript (caso esteja usando TypeScript)
RUN npm run build

# Exponha a porta que sua aplicação usa
EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]
