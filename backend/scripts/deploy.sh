#!/bin/bash

# Script de déploiement pour Railway
echo "🚀 Déploiement sur Railway..."

# Vérifier que Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé. Installez-le avec:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Se connecter à Railway
echo "🔐 Connexion à Railway..."
railway login

# Créer un nouveau projet ou utiliser un existant
echo "📦 Configuration du projet..."
railway init

# Déployer
echo "🚀 Déploiement en cours..."
railway up

echo "✅ Déploiement terminé!"
echo "🌐 Votre application est maintenant en ligne sur Railway"
