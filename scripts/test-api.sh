#!/bin/bash

# Script to test the authentication API

API_URL="http://localhost:3000"

echo "🧪 Testing Authentication API"
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
echo "📝 1. Registering new user..."
REGISTER_DATA='{
  "email": "teste@exemplo.com",
  "username": "teste123",
  "password": "senha123"
}'

REGISTER_RESPONSE=$(make_request "POST" "/auth/register" "$REGISTER_DATA")
echo "Registration response:"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extrair token do registro
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

# Teste 2: Login
echo "🔐 2. Logging in..."
LOGIN_DATA='{
  "email": "teste@exemplo.com",
  "password": "senha123"
}'

LOGIN_RESPONSE=$(make_request "POST" "/auth/login" "$LOGIN_DATA")
echo "Login response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Atualizar token se necessário
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)
fi

# Teste 3: Acessar perfil (rota protegida)
echo "👤 3. Accessing user profile..."
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    PROFILE_RESPONSE=$(make_request "GET" "/auth/profile" "" "$TOKEN")
    echo "Profile response:"
    echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
    echo ""
else
    echo "❌ Token not available for profile test"
    echo ""
fi

# Teste 4: Listar usuários (rota protegida)
echo "📋 4. Listing users..."
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    USERS_RESPONSE=$(make_request "GET" "/users" "" "$TOKEN")
    echo "List of users response:"
    echo "$USERS_RESPONSE" | jq '.' 2>/dev/null || echo "$USERS_RESPONSE"
    echo ""
else
    echo "❌ Token not available for listing test"
    echo ""
fi

# Teste 5: Tentar acessar rota protegida sem token
echo "🚫 5. Attempting to access protected route without token..."
NO_AUTH_RESPONSE=$(make_request "GET" "/users" "")
echo "Response without authentication:"
echo "$NO_AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "$NO_AUTH_RESPONSE"
echo ""

echo "✅ Tests completed!"
