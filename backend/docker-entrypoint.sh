#!/bin/sh

# Script d'entrée Docker pour initialiser Prisma et démarrer l'application

echo "🚀 Démarrage du backend avec Prisma..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données PostgreSQL..."
until nc -z database 5432; do
  echo "Base de données non disponible - attente..."
  sleep 2
done

echo "✅ Base de données PostgreSQL disponible"

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "📊 Application des migrations Prisma..."
npx prisma db push

echo "✅ Base de données initialisée avec succès"

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
exec "$@"
