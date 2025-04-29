# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o restante do código da aplicação
COPY . .

# Etapa 2: imagem final e leve
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "src/server.js"]