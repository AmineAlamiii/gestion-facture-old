#!/bin/bash

# Script pour exécuter les migrations Prisma dans Docker

echo "🚀 Exécution de la migration Prisma dans Docker..."

# Vérifier si le conteneur backend existe
if [ ! "$(docker ps -q -f name=gestion-facture-backend)" ]; then
    echo "⚠️  Le conteneur backend n'est pas en cours d'exécution."
    echo "📦 Démarrage des conteneurs..."
    docker-compose up -d
    echo "⏳ Attente du démarrage des services (15 secondes)..."
    sleep 15
fi

echo "📊 Génération du client Prisma..."
docker exec gestion-facture-backend npx prisma generate

echo "🔄 Exécution de la migration..."
docker exec gestion-facture-backend npx prisma migrate dev --name add_payment_method

echo "✅ Migration terminée!"
echo ""
echo "📋 Pour voir les tables de la base de données:"
echo "   docker exec gestion-facture-backend npx prisma studio"
echo ""
echo "🔄 Pour redémarrer le backend:"
echo "   docker-compose restart backend"

