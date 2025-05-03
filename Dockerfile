FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Mostra o conteúdo do diretório antes do build
RUN ls -la
# Executa o build
RUN npm run build && ls -la dist && find /app -name "index.html"

FROM nginx:alpine
# Copia os arquivos do build para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Verifica se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html || echo "Diretório vazio!"
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]