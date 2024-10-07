# Use uma imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos para o contêiner
COPY . .

# Instale o dotenv-cli para garantir que as variáveis de ambiente sejam carregadas corretamente
RUN npm install dotenv-cli -g

# Exporte as variáveis de ambiente e execute a migração do Drizzle
CMD ["dotenv", "-e", ".env", "npx", "drizzle-kit", "migrate"]

# Compile o TypeScript para JavaScript
RUN npm run build

# Exponha a porta que sua aplicação usa
EXPOSE 3333

# Execute o servidor
CMD ["node", "dist/src/http/server.js"]
