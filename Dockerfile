# Dockerfile para produção
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar todos os arquivos do projeto
COPY . .

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Copiar node_modules e dist do estágio builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Mudar para usuário não-root
USER nestjs

# Expor a porta
EXPOSE 3000

# Comando para produção
CMD ["node", "dist/main"]
