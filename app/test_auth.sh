#!/bin/bash
echo "1. Logging in..."
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"user@boumbapp.com","password":"password123"}' http://localhost:8080/api/login_check | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Login Failed (No Token)"
    exit 1
fi
echo "Token Acquired."

echo "2. Posting Project..."
curl -v -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/ld+json" -d '{"name":"Debug Project","isPublic":false}' http://localhost:8080/api/projects
