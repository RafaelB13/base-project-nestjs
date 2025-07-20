#!/bin/bash

# Script to test database configuration and seed

echo "🗄️  Testing PostgreSQL configuration with Admin Seed"
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

echo "🔐 1. Testing admin user login..."
LOGIN_DATA='{
  "email": "admin@sistema.com",
  "password": "Admin@2025!"
}'

LOGIN_RESPONSE=$(make_request "POST" "/auth/login" "$LOGIN_DATA")
echo "Admin login response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extrair token do admin
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo "✅ Admin login successful!"
    echo ""

    echo "👤 2. Verifying admin profile..."
    PROFILE_RESPONSE=$(make_request "GET" "/auth/profile" "" "$ADMIN_TOKEN")
    echo "Admin profile:"
    echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
    echo ""

    echo "📊 3. Testing statistics endpoint (admin only)..."
    STATS_RESPONSE=$(make_request "GET" "/users/admin/stats" "" "$ADMIN_TOKEN")
    echo "System statistics:"
    echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"
    echo ""

    echo "📋 4. Listing all users (admin only)..."
    USERS_RESPONSE=$(make_request "GET" "/users" "" "$ADMIN_TOKEN")
    echo "List of users:"
    echo "$USERS_RESPONSE" | jq '.' 2>/dev/null || echo "$USERS_RESPONSE"
    echo ""
else
    echo "❌ Admin login failed!"
    echo ""
fi

echo "🧪 5. Testing common user registration..."
REGISTER_DATA='{
  "email": "teste@exemplo.com",
  "username": "teste123",
  "password": "Teste123!"
}'

REGISTER_RESPONSE=$(make_request "POST" "/auth/register" "$REGISTER_DATA")
echo "Common user registration:"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extrair token do usuário comum
USER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ -n "$USER_TOKEN" ] && [ "$USER_TOKEN" != "null" ]; then
    echo "🚫 6. Testing denied access for common user..."
    DENIED_RESPONSE=$(make_request "GET" "/users/admin/stats" "" "$USER_TOKEN")
    echo "Attempt to access statistics:"
    echo "$DENIED_RESPONSE" | jq '.' 2>/dev/null || echo "$DENIED_RESPONSE"
    echo ""
fi

echo "✅ Configuration test completed!"
echo ""
echo "📋 Admin Credentials:"
echo "   Email: admin@system.com"
echo "   Password: Admin@2025!"
echo ""
echo "⚠️  IMPORTANT: Change the admin password after the first login!"
