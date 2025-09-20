#!/bin/bash

# Script de démarrage Docker pour l'application de gestion de factures

echo "🚀 Démarrage de l'application avec Docker Compose..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up --build

echo "✅ Application démarrée avec succès!"
echo "🌐 Frontend: http://localhost:5173"
echo "📡 Backend API: http://localhost:3001/api"
echo "🗄️ PostgreSQL: localhost:5432"
