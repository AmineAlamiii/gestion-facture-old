#!/bin/bash

# Script de build pour Railway
echo "🚀 Build Railway - Backend avec Prisma"

# Installer les dépendances
npm install

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "📊 Application des migrations..."
npx prisma db push

echo "✅ Build terminé avec succès"
