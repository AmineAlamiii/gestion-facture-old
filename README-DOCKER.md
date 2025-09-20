# 🐳 Docker Setup - PostgreSQL + Prisma

## 📋 Prérequis

- **Docker Desktop** installé
- **Docker Compose** installé
- **Git** pour cloner le projet

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd gestion-facture
```

### 2. Démarrer avec Docker
```bash
# Méthode 1: Script automatique
chmod +x docker-start.sh
./docker-start.sh

# Méthode 2: Commande manuelle
docker-compose up --build
```

### 3. Accéder à l'application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001/api
- **PostgreSQL** : localhost:5432

## 🛠️ Services Docker

### **PostgreSQL Database**
- **Image** : `postgres:15-alpine`
- **Port** : 5432
- **Base** : `invoice_management`
- **Utilisateur** : `postgres`
- **Mot de passe** : `postgres123`

### **Backend API**
- **Base** : Node.js 18 Alpine
- **Port** : 3001
- **ORM** : Prisma
- **Base de données** : PostgreSQL

### **Frontend React**
- **Base** : Node.js 18 Alpine
- **Port** : 5173
- **Framework** : React + Vite

## 🔧 Commandes utiles

### **Démarrer l'application**
```bash
docker-compose up --build
```

### **Démarrer en arrière-plan**
```bash
docker-compose up -d --build
```

### **Voir les logs**
```bash
# Tous les services
docker-compose logs

# Service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### **Arrêter l'application**
```bash
# Arrêt simple
docker-compose down

# Arrêt avec suppression des volumes (ATTENTION: supprime les données)
docker-compose down -v
```

### **Redémarrer un service**
```bash
docker-compose restart backend
```

### **Accéder au conteneur**
```bash
# Backend
docker-compose exec backend sh

# Base de données
docker-compose exec database psql -U postgres -d invoice_management
```

## 🗄️ Base de données

### **Connexion PostgreSQL**
```bash
# Depuis l'hôte
psql -h localhost -p 5432 -U postgres -d invoice_management

# Depuis le conteneur
docker-compose exec database psql -U postgres -d invoice_management
```

### **Gestion des données**
```bash
# Appliquer les migrations Prisma
docker-compose exec backend npx prisma db push

# Ouvrir Prisma Studio
docker-compose exec backend npx prisma studio

# Générer le client Prisma
docker-compose exec backend npx prisma generate
```

### **Sauvegarde/Restauration**
```bash
# Sauvegarde
docker-compose exec database pg_dump -U postgres invoice_management > backup.sql

# Restauration
docker-compose exec -T database psql -U postgres invoice_management < backup.sql
```

## 🔍 Dépannage

### **Problème de connexion à la base**
```bash
# Vérifier que PostgreSQL est démarré
docker-compose logs database

# Tester la connexion
docker-compose exec backend npx prisma db push
```

### **Problème de build**
```bash
# Nettoyer les images
docker-compose down
docker system prune -f

# Rebuild complet
docker-compose up --build --force-recreate
```

### **Problème de ports**
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173
netstat -tulpn | grep :5432
```

## 📊 Monitoring

### **Statut des conteneurs**
```bash
docker-compose ps
```

### **Utilisation des ressources**
```bash
docker stats
```

### **Logs en temps réel**
```bash
docker-compose logs -f
```

## 🔐 Sécurité

### **Variables d'environnement**
- Les mots de passe sont dans `docker-compose.yml`
- Pour la production, utilisez des secrets Docker
- Ne commitez jamais les fichiers `.env` avec des mots de passe

### **Réseau**
- Les services communiquent via le réseau Docker `app-network`
- PostgreSQL n'est accessible que depuis les conteneurs
- Port 5432 exposé pour le développement uniquement

## 🚀 Déploiement en production

### **Railway (Recommandé)**
1. Connectez votre repo GitHub à Railway
2. Railway détecte automatiquement Docker
3. Ajoutez une base PostgreSQL Railway
4. Déployez !

### **Autres plateformes**
- **Heroku** : Support Docker
- **DigitalOcean** : App Platform
- **AWS** : ECS ou EKS
- **Google Cloud** : Cloud Run

## 📝 Notes importantes

- ✅ **Données persistantes** : Volume `postgres_data`
- ✅ **Hot reload** : Code modifié en temps réel
- ✅ **Health checks** : PostgreSQL vérifié avant démarrage backend
- ✅ **Logs centralisés** : Tous les logs via Docker Compose

---

**🎉 Votre application est maintenant containerisée avec PostgreSQL !**
