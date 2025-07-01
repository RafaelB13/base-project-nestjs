# Sistema de Autenticação JWT - NestJS

Este projeto implementa um sistema completo de autenticação JWT usando NestJS com suporte a Docker para desenvolvimento.

## Funcionalidades

- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Proteção de rotas
- ✅ Validação de dados
- ✅ Hash de senhas com bcrypt
- ✅ Guards de autenticação
- ✅ Estratégias Passport (Local e JWT)
- ✅ Docker para desenvolvimento com hot reload
- ✅ PostgreSQL e Redis configurados
- ✅ PgAdmin para administração do banco

## Configuração e Execução

### Usando Docker (Recomendado)

1. **Clone o repositório e entre na pasta:**
```bash
git clone <seu-repo>
cd upload-to-s3
```

2. **Inicie o ambiente de desenvolvimento:**
```bash
npm run docker:dev
```

Ou use o script diretamente:
```bash
./scripts/dev-start.sh
```

3. **Acesse a aplicação:**
- API: http://localhost:3000
- PgAdmin: http://localhost:8080 (admin@example.com / admin123)

### Comandos Docker Úteis

```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev

# Parar ambiente
npm run docker:stop

# Ver logs da aplicação
npm run docker:logs

# Reconstruir containers
npm run docker:build

# Limpar containers e volumes
npm run docker:clean

# Produção
npm run docker:prod
```

### Configuração Manual (Sem Docker)

1. **Copie o arquivo de exemplo de variáveis de ambiente:**
```bash
cp .env.example .env
```

2. **Configure as variáveis no arquivo .env:**
```
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
NODE_ENV=development
PORT=3000
```

3. **Instale as dependências:**
```bash
npm install
```

4. **Execute a aplicação:**
```bash
npm run start:dev
```

## Endpoints da API

### Autenticação

#### POST /auth/register
Registra um novo usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "username": "usuario123",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "usuario123",
    "createdAt": "2025-06-30T...",
    "updatedAt": "2025-06-30T..."
  }
}
```

#### POST /auth/login
Faz login do usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "usuario123"
  }
}
```

#### GET /auth/profile
Obtém o perfil do usuário autenticado (requer token JWT).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Usuários

#### GET /users/me
Obtém os dados do usuário autenticado (requer token JWT).

#### GET /users
Lista todos os usuários (requer token JWT).

## Como usar

1. **Registrar um usuário:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "username": "teste",
    "password": "123456"
  }'
```

2. **Fazer login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456"
  }'
```

3. **Acessar rota protegida:**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do Projeto

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Executar o projeto

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run start:dev

# Executar em modo de produção
npm run start:prod
```

## Segurança

- As senhas são hasheadas usando bcrypt
- Os tokens JWT têm expiração de 24 horas
- Validação de dados de entrada
- Guards para proteção de rotas

## Próximos passos

Para melhorar ainda mais o sistema, você pode adicionar:

- Refresh tokens
- Rate limiting
- Logs de auditoria
- Verificação de email
- Recuperação de senha
- Roles e permissões
- Integração com banco de dados (PostgreSQL, MongoDB, etc.)
