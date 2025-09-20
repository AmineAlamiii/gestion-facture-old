# 🚀 Déploiement avec PostgreSQL + Prisma

## 📋 Prérequis

1. **Node.js 18+** installé
2. **Compte Railway** (gratuit) : [railway.app](https://railway.app)
3. **Git** pour versionner le code

## 🛠️ Installation locale

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configurer la base de données
```bash
# Copier le fichier d'environnement
cp env.example .env

# Éditer .env avec vos paramètres PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/invoice_management"
```

### 3. Générer le client Prisma
```bash
npm run db:generate
```

### 4. Appliquer les migrations
```bash
npm run db:push
```

### 5. Démarrer le serveur
```bash
# Version Prisma (recommandée)
npm run start

# Version SQLite (ancienne)
npm run dev
```

## 🌐 Déploiement sur Railway

### Option 1: Interface Web (Recommandée)

1. **Connectez-vous** à [railway.app](https://railway.app)
2. **Créez un nouveau projet** → "Deploy from GitHub repo"
3. **Sélectionnez votre repository** GitHub
4. **Railway détecte automatiquement** votre backend Node.js
5. **Ajoutez une base PostgreSQL** :
   - Cliquez sur "+ New" → "Database" → "PostgreSQL"
   - Railway crée automatiquement la variable `DATABASE_URL`
6. **Déployez** → Votre app est en ligne !

### Option 2: CLI Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

## 🔧 Configuration Railway

### Variables d'environnement automatiques
- `DATABASE_URL` : URL PostgreSQL (créée automatiquement)
- `PORT` : Port du serveur (géré par Railway)
- `NODE_ENV` : production

### Variables à ajouter manuellement
- `FRONTEND_URL` : URL de votre frontend déployé

## 📊 Base de données

### Structure des tables
- **suppliers** : Fournisseurs
- **clients** : Clients  
- **purchase_invoices** : Factures d'achat
- **sale_invoices** : Factures de vente
- **invoice_items** : Articles des factures
- **products** : Produits/Stock

### Données de test
Les données de test sont automatiquement insérées au premier démarrage.

## 🚀 Avantages de PostgreSQL + Prisma

### ✅ Avantages
- **Persistance garantie** : Données jamais perdues
- **Performance** : Requêtes optimisées
- **Relations** : Intégrité référentielle
- **Scalabilité** : Supporte des millions d'enregistrements
- **Sécurité** : Connexions chiffrées
- **Backup automatique** : Sauvegardes régulières

### 🔄 Migration depuis SQLite
- **Code adapté** : Utilise Prisma ORM
- **Même API** : Endpoints identiques
- **Données préservées** : Structure identique
- **Performance améliorée** : Requêtes plus rapides

## 🛠️ Commandes utiles

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Créer une nouvelle migration
npm run db:migrate

# Ouvrir Prisma Studio (interface graphique)
npm run db:studio

# Voir les logs Railway
railway logs

# Redémarrer l'application
railway redeploy
```

## 🔍 Dépannage

### Erreur de connexion à la base
```bash
# Vérifier la variable DATABASE_URL
railway variables

# Tester la connexion
railway run npx prisma db push
```

### Problème de migration
```bash
# Réinitialiser la base
railway run npx prisma db push --force-reset

# Regénérer le client
railway run npx prisma generate
```

## 📱 Frontend

Pour connecter votre frontend, mettez à jour l'URL de l'API :

```typescript
// Dans frontend/src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://votre-app.railway.app/api',
  // ...
};
```

## 🎯 Prochaines étapes

1. **Déployer le frontend** sur Vercel/Netlify
2. **Configurer le CORS** pour l'URL de production
3. **Ajouter l'authentification** si nécessaire
4. **Configurer les backups** automatiques
5. **Monitorer les performances** avec Railway Analytics

---

**🎉 Félicitations !** Votre application de gestion de factures est maintenant déployée avec une base de données PostgreSQL professionnelle !
