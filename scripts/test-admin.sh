#!/bin/bash

# Script para testar configuração do banco e seed

echo "🗄️  Testando configuração do PostgreSQL com Seed Admin"
echo "====================================================="

API_URL="http://localhost:3000"

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

echo "🔐 1. Testando login do usuário admin..."
LOGIN_DATA='{
  "email": "admin@sistema.com",
  "password": "Admin@2025!"
}'

LOGIN_RESPONSE=$(make_request "POST" "/auth/login" "$LOGIN_DATA")
echo "Resposta do login admin:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extrair token do admin
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo "✅ Admin login successful!"
    echo ""

    echo "👤 2. Verificando perfil do admin..."
    PROFILE_RESPONSE=$(make_request "GET" "/auth/profile" "" "$ADMIN_TOKEN")
    echo "Perfil do admin:"
    echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
    echo ""

    echo "📊 3. Testando endpoint de estatísticas (só admin)..."
    STATS_RESPONSE=$(make_request "GET" "/users/admin/stats" "" "$ADMIN_TOKEN")
    echo "Estatísticas do sistema:"
    echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"
    echo ""

    echo "📋 4. Listando todos os usuários (só admin)..."
    USERS_RESPONSE=$(make_request "GET" "/users" "" "$ADMIN_TOKEN")
    echo "Lista de usuários:"
    echo "$USERS_RESPONSE" | jq '.' 2>/dev/null || echo "$USERS_RESPONSE"
    echo ""
else
    echo "❌ Admin login failed!"
    echo ""
fi

echo "🧪 5. Testando registro de usuário comum..."
REGISTER_DATA='{
  "email": "teste@exemplo.com",
  "username": "teste123",
  "password": "Teste123!"
}'

REGISTER_RESPONSE=$(make_request "POST" "/auth/register" "$REGISTER_DATA")
echo "Registro de usuário comum:"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extrair token do usuário comum
USER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ -n "$USER_TOKEN" ] && [ "$USER_TOKEN" != "null" ]; then
    echo "🚫 6. Testando acesso negado para usuário comum..."
    DENIED_RESPONSE=$(make_request "GET" "/users/admin/stats" "" "$USER_TOKEN")
    echo "Tentativa de acesso às estatísticas:"
    echo "$DENIED_RESPONSE" | jq '.' 2>/dev/null || echo "$DENIED_RESPONSE"
    echo ""
fi

echo "✅ Teste de configuração concluído!"
echo ""
echo "📋 Credenciais do Admin:"
echo "   Email: admin@sistema.com"
echo "   Senha: Admin@2025!"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!"
