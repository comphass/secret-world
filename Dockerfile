FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Mostra o conteúdo do diretório antes do build
RUN ls -la
# Executa o build
RUN npm run build
# Verifica se o build gerou os arquivos esperados
RUN ls -la dist || true
RUN echo "Verificando se o arquivo index.html foi criado:"
RUN find /app -name "index.html" || echo "Nenhum arquivo index.html encontrado"

FROM nginx:alpine
# Copia os arquivos do build para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Verifica se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html || echo "Diretório vazio!"
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]