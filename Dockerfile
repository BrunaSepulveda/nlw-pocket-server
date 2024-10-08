# Use a imagem base do Node.js
FROM node:latest

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json primeiro para otimizar o cache de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Dê permissão de execução ao script entrypoint.sh
RUN chmod +x entrypoint.sh

# Exponha a porta usada pela aplicação
EXPOSE 3333

# Comando para iniciar o script de entrada
CMD ["sh", "entrypoint.sh"]
