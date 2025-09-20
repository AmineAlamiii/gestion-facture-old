-- Script d'initialisation de la base de données PostgreSQL
-- Ce script est exécuté automatiquement au premier démarrage du conteneur PostgreSQL

-- Créer la base de données si elle n'existe pas
-- (La base est déjà créée par POSTGRES_DB, mais on peut ajouter des configurations ici)

-- Activer les extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer un utilisateur spécifique pour l'application (optionnel)
-- CREATE USER app_user WITH PASSWORD 'app_password';
-- GRANT ALL PRIVILEGES ON DATABASE invoice_management TO app_user;

-- Les tables seront créées automatiquement par Prisma lors du premier démarrage
-- Ce fichier peut être utilisé pour des configurations spécifiques à PostgreSQL
