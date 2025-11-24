# Usar uma imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json para o container
COPY package*.json ./

# Instalar as dependências do Node.js
RUN npm install

# Copiar o restante dos arquivos da aplicação para o container
COPY . .

# Expor a porta que o servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "src/server.js"]
