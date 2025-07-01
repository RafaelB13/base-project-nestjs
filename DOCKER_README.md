# Docker Development Environment

Este projeto inclui um ambiente de desenvolvimento completo usando Docker com hot reload.

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NestJS App    │    │   PostgreSQL    │    │     Redis       │
│   (Port 3000)   │◄──►│   (Port 5432)   │    │   (Port 6379)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    PgAdmin      │
                    │   (Port 8080)   │
                    └─────────────────┘
```

## Serviços Incluídos

### 🚀 Aplicação NestJS
- **Container**: `upload-s3-dev`
- **Porta**: 3000
- **Debug Porta**: 9229
- **Hot Reload**: ✅ Ativado
- **Volume**: Código fonte mapeado para desenvolvimento

### 🗄️ PostgreSQL Database
- **Container**: `upload-s3-postgres`
- **Porta**: 5432
- **Usuário**: devuser
- **Senha**: devpass
- **Database**: upload_s3_dev
- **Volume**: Dados persistentes

### 📊 PgAdmin (Administração DB)
- **Container**: `upload-s3-pgadmin`
- **Porta**: 8080
- **URL**: http://localhost:8080
- **Email**: admin@example.com
- **Senha**: admin123

### 🔄 Redis
- **Container**: `upload-s3-redis`
- **Porta**: 6379
- **Persistence**: ✅ Ativada
- **Volume**: Dados persistentes

## Comandos Disponíveis

### Desenvolvimento
```bash
# Iniciar ambiente completo
npm run docker:dev

# Parar ambiente
npm run docker:stop

# Ver logs em tempo real
npm run docker:logs

# Reconstruir containers
npm run docker:build

# Limpar tudo (containers + volumes)
npm run docker:clean
```

### Comandos Docker Diretos
```bash
# Iniciar apenas alguns serviços
docker-compose up postgres redis -d

# Executar comandos dentro do container
docker-compose exec app npm run test

# Acessar shell do container
docker-compose exec app sh

# Ver logs de um serviço específico
docker-compose logs -f postgres

# Resetar database
docker-compose restart postgres
```

## Hot Reload

O hot reload está configurado e funcionando:

1. **Volume Mapping**: O diretório local `./` é mapeado para `/app` no container
2. **Node Modules**: Volume anônimo protege node_modules de conflitos
3. **Watch Mode**: NestJS roda em modo `--watch`
4. **TypeScript**: Compilação automática ao salvar arquivos

### Testando Hot Reload

1. Inicie o ambiente: `npm run docker:dev`
2. Edite qualquer arquivo `.ts` em `src/`
3. Veja os logs: `npm run docker:logs`
4. A aplicação será recompilada automaticamente

## Debugging

### VS Code Debug Configuration

Adicione ao `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

### Debugging Steps

1. Inicie o ambiente: `npm run docker:dev`
2. A porta 9229 está exposta para debugging
3. Use VS Code para anexar ao processo
4. Coloque breakpoints e debug normalmente

## Conectando ao Database

### Via Aplicação
```typescript
// As variáveis já estão configuradas no docker-compose.yml
DATABASE_URL=postgresql://devuser:devpass@postgres:5432/upload_s3_dev
```

### Via PgAdmin
1. Acesse: http://localhost:8080
2. Email: admin@example.com
3. Senha: admin123
4. Adicionar servidor:
   - Host: postgres
   - Port: 5432
   - Database: upload_s3_dev
   - Username: devuser
   - Password: devpass

### Via Cliente Externo
```bash
# psql
psql -h localhost -p 5432 -U devuser -d upload_s3_dev

# Connection string
postgresql://devuser:devpass@localhost:5432/upload_s3_dev
```

## Volumes Persistentes

Os dados são mantidos entre reinicializações:

- **postgres_data**: Dados do PostgreSQL
- **redis_data**: Dados do Redis
- **pgadmin_data**: Configurações do PgAdmin

### Limpar Dados
```bash
# Remover apenas containers
docker-compose down

# Remover containers + volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

## Performance

### Recomendações para macOS
- Use Docker Desktop 4.0+
- Ative "Use the new Virtualization Framework"
- Considere usar volumes nomeados para melhor performance

### Monitoramento
```bash
# Ver uso de recursos
docker stats

# Ver espaço em disco
docker system df

# Limpar cache
docker system prune -f
```

## Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs app

# Verificar portas em uso
lsof -i :3000
```

### Hot reload não funciona
```bash
# Verificar volumes
docker-compose exec app ls -la /app

# Reconstruir container
docker-compose build --no-cache app
```

### Problemas de permissão
```bash
# Verificar usuário do container
docker-compose exec app whoami

# Corrigir permissões se necessário
sudo chown -R $USER:$USER .
```

### Database connection issues
```bash
# Verificar se PostgreSQL está pronto
docker-compose exec postgres pg_isready

# Resetar database
docker-compose restart postgres
```
