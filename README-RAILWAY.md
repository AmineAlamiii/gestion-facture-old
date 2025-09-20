# 🚀 Déploiement Railway - Application de Gestion de Factures

## 📋 Prérequis

1. **Compte GitHub** : [github.com](https://github.com)
2. **Compte Railway** : [railway.app](https://railway.app)
3. **Git** installé localement

## 🔧 Configuration du projet

### **Structure du projet**
```
gestion-facture/
├── backend/                 # API Node.js + Prisma
│   ├── src/
│   │   └── app-prisma.js   # Serveur principal
│   ├── prisma/
│   │   └── schema.prisma   # Schéma de base de données
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React + Vite
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Configuration Docker local
├── railway.toml           # Configuration Railway
└── README-RAILWAY.md      # Ce fichier
```

## 🚀 Déploiement étape par étape

### **1. Créer un repository GitHub**

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Application de gestion de factures"

# Créer un repository sur GitHub (via l'interface web)
# Puis connecter le repository local
git remote add origin https://github.com/VOTRE-USERNAME/gestion-facture.git
git branch -M main
git push -u origin main
```

### **2. Déployer sur Railway**

#### **Option A : Interface Web (Recommandée)**

1. **Connectez-vous** à [railway.app](https://railway.app)
2. **Cliquez** sur "New Project"
3. **Sélectionnez** "Deploy from GitHub repo"
4. **Choisissez** votre repository `gestion-facture`
5. **Railway détecte automatiquement** votre backend Node.js

#### **Option B : CLI Railway**

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

### **3. Configurer la base de données PostgreSQL**

1. **Dans Railway**, cliquez sur "+ New"
2. **Sélectionnez** "Database" → "PostgreSQL"
3. **Railway crée automatiquement** :
   - Base de données PostgreSQL
   - Variable d'environnement `DATABASE_URL`

### **4. Variables d'environnement**

Railway configure automatiquement :
- ✅ `DATABASE_URL` : URL PostgreSQL
- ✅ `PORT` : Port du serveur
- ✅ `NODE_ENV` : production

**Variables à ajouter manuellement :**
- `FRONTEND_URL` : URL de votre frontend (après déploiement)

### **5. Déploiement du Frontend**

#### **Option A : Vercel (Recommandée)**
1. Allez sur [vercel.com](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez le dossier racine : `frontend`
4. Ajoutez la variable d'environnement :
   - `VITE_API_URL` : URL de votre backend Railway

#### **Option B : Netlify**
1. Allez sur [netlify.com](https://netlify.com)
2. Importez votre repository GitHub
3. Configurez :
   - Build command : `cd frontend && npm run build`
   - Publish directory : `frontend/dist`
   - Variable d'environnement : `VITE_API_URL`

## 🔧 Configuration finale

### **Backend Railway**
- **URL** : `https://votre-app.railway.app`
- **API** : `https://votre-app.railway.app/api`
- **Health check** : `https://votre-app.railway.app/api/health`

### **Frontend (Vercel/Netlify)**
- **URL** : `https://votre-app.vercel.app`
- **API configurée** vers Railway

### **Base de données**
- **PostgreSQL** hébergée par Railway
- **Données persistantes** garanties
- **Sauvegardes automatiques**

## 🛠️ Commandes utiles

### **Railway CLI**
```bash
# Voir les logs
railway logs

# Voir les variables d'environnement
railway variables

# Redémarrer l'application
railway redeploy

# Ouvrir l'application
railway open
```

### **Gestion de la base de données**
```bash
# Se connecter à Railway
railway login

# Ouvrir Prisma Studio
railway run npx prisma studio

# Appliquer les migrations
railway run npx prisma db push

# Générer le client Prisma
railway run npx prisma generate
```

## 🔍 Dépannage

### **Problème de connexion à la base**
```bash
# Vérifier les variables d'environnement
railway variables

# Tester la connexion
railway run npx prisma db push
```

### **Problème de build**
```bash
# Voir les logs de build
railway logs

# Redémarrer le déploiement
railway redeploy
```

### **Problème CORS**
- Vérifiez que `FRONTEND_URL` est configurée dans Railway
- Assurez-vous que l'URL du frontend correspond exactement

## 📊 Monitoring

### **Railway Dashboard**
- **Métriques** : CPU, RAM, requêtes
- **Logs** : En temps réel
- **Variables** : Gestion des secrets
- **Base de données** : Statistiques PostgreSQL

### **Analytics**
- **Uptime** : 99.9% garanti
- **Performance** : Monitoring automatique
- **Alertes** : Notifications en cas de problème

## 💰 Coûts

### **Railway Free Tier**
- ✅ **500h/mois** d'exécution
- ✅ **1GB RAM**
- ✅ **1GB stockage**
- ✅ **Base PostgreSQL** incluse
- ✅ **Déploiements illimités**

### **Vercel Free Tier**
- ✅ **100GB bandwidth/mois**
- ✅ **Déploiements illimités**
- ✅ **HTTPS automatique**

## 🎯 Prochaines étapes

1. **Déployer le backend** sur Railway
2. **Déployer le frontend** sur Vercel
3. **Configurer le domaine personnalisé** (optionnel)
4. **Ajouter l'authentification** (optionnel)
5. **Configurer les backups** automatiques

---

**🎉 Félicitations !** Votre application de gestion de factures sera bientôt en ligne avec une base de données PostgreSQL professionnelle !
