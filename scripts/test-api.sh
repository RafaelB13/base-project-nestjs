#!/bin/bash

# Script para testar a API de autenticação

API_URL="http://localhost:3000"

echo "🧪 Testando API de Autenticação"
echo "================================="

# Função para fazer requisições HTTP
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    if [ -n "$token" ]; then
        curl -s -X "$method" \
             -H "Content-Type: application/json" \
             -H "Authorization: Bearer $token" \
             -d "$data" \
             "$API_URL$endpoint"
    else
        curl -s -X "$method" \
             -H "Content-Type: application/json" \
             -d "$data" \
             "$API_URL$endpoint"
    fi
}

# Teste 1: Registrar usuário
echo "📝 1. Registrando novo usuário..."
REGISTER_DATA='{
  "email": "teste@exemplo.com",
  "username": "teste123",
  "password": "senha123"
}'

REGISTER_RESPONSE=$(make_request "POST" "/auth/register" "$REGISTER_DATA")
echo "Resposta do registro:"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extrair token do registro
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

# Teste 2: Login
echo "🔐 2. Fazendo login..."
LOGIN_DATA='{
  "email": "teste@exemplo.com",
  "password": "senha123"
}'

LOGIN_RESPONSE=$(make_request "POST" "/auth/login" "$LOGIN_DATA")
echo "Resposta do login:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Atualizar token se necessário
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)
fi

# Teste 3: Acessar perfil (rota protegida)
echo "👤 3. Acessando perfil do usuário..."
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    PROFILE_RESPONSE=$(make_request "GET" "/auth/profile" "" "$TOKEN")
    echo "Resposta do perfil:"
    echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
    echo ""
else
    echo "❌ Token não disponível para teste do perfil"
    echo ""
fi

# Teste 4: Listar usuários (rota protegida)
echo "📋 4. Listando usuários..."
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    USERS_RESPONSE=$(make_request "GET" "/users" "" "$TOKEN")
    echo "Resposta da lista de usuários:"
    echo "$USERS_RESPONSE" | jq '.' 2>/dev/null || echo "$USERS_RESPONSE"
    echo ""
else
    echo "❌ Token não disponível para teste da listagem"
    echo ""
fi

# Teste 5: Tentar acessar rota protegida sem token
echo "🚫 5. Tentando acessar rota protegida sem token..."
NO_AUTH_RESPONSE=$(make_request "GET" "/users" "")
echo "Resposta sem autenticação:"
echo "$NO_AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "$NO_AUTH_RESPONSE"
echo ""

echo "✅ Testes concluídos!"
