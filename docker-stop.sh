#!/bin/bash

# Script d'arrêt Docker pour l'application de gestion de factures

echo "🛑 Arrêt de l'application Docker..."

# Arrêter les conteneurs
docker-compose down

echo "✅ Application arrêtée avec succès!"

# Optionnel: Supprimer les volumes (ATTENTION: supprime les données)
read -p "Voulez-vous supprimer les volumes (données de la base) ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Suppression des volumes..."
    docker-compose down -v
    echo "✅ Volumes supprimés"
fi
