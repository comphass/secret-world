FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que a aplicação irá utilizar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]