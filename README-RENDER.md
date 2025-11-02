# Guide de Déploiement sur Render

Ce guide vous explique comment déployer l'application de gestion de factures sur Render.

## 🎯 Guide Étape par Étape - Configuration Complète

### ✅ Étape 1 : Préparer votre code

1. **Vérifiez que votre code est sur GitHub/GitLab/Bitbucket**
   ```bash
   # Si ce n'est pas encore fait, créez un dépôt et poussez votre code
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <URL_DE_VOTRE_REPO>
   git push -u origin main
   ```

2. **Vérifiez que le fichier `render.yaml` est à la racine du dépôt**
   - Le fichier doit être présent dans le répertoire racine de votre dépôt

### ✅ Étape 2 : Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started for Free"**
3. Créez votre compte (gratuit) avec :
   - GitHub/GitLab/Bitbucket (recommandé pour connexion automatique)
   - Ou email/password

### ✅ Étape 3 : Déployer avec Blueprint (Méthode Automatique)

#### 3.1. Créer le Blueprint

1. Une fois connecté, cliquez sur **"New +"** en haut à droite
2. Sélectionnez **"Blueprint"**
3. Connectez votre dépôt Git si ce n'est pas déjà fait
4. Sélectionnez votre dépôt contenant le code de l'application
5. Cliquez sur **"Connect"**

#### 3.2. Appliquer la configuration

1. Render détectera automatiquement le fichier `render.yaml`
2. Vous verrez un aperçu des 3 services qui seront créés :
   - Base de données PostgreSQL
   - Service Web Backend
   - Site Statique Frontend
3. Vérifiez la configuration et cliquez sur **"Apply"**
4. Attendez que tous les services soient créés (2-5 minutes)

### ✅ Étape 4 : Exécuter les migrations (OBLIGATOIRE)

**⚠️ IMPORTANT** : Sans cette étape, votre base de données sera vide !

1. Dans votre tableau de bord Render, cliquez sur le service **"invoice-management-backend"**
2. Allez dans l'onglet **"Shell"** (en haut du service)
3. Cliquez sur **"Connect"** pour ouvrir un terminal
4. Exécutez les commandes suivantes :

```bash
cd backend
npx prisma migrate deploy
```

5. Vous devriez voir :
   ```
   ✅ Applied migration: 20241220000000_init
   ✅ Applied migration: 20251101000000_add_payment_method
   ```

### ✅ Étape 5 : Configurer les variables d'environnement

#### 5.1. Backend - Ajouter FRONTEND_URL

1. Dans le service **"invoice-management-backend"**, allez dans **"Environment"**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez :
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://invoice-management-frontend.onrender.com`
     (Remplacez par l'URL réelle de votre frontend, visible dans le service frontend)
4. Cliquez sur **"Save Changes"**
5. Le service redémarrera automatiquement

#### 5.2. Frontend - Ajouter VITE_API_URL

1. Dans le service **"invoice-management-frontend"**, allez dans **"Environment"**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez :
   - **Key**: `VITE_API_URL`
   - **Value**: `https://invoice-management-backend.onrender.com/api`
     (Remplacez par l'URL réelle de votre backend)
4. Cliquez sur **"Save Changes"**
5. Le service redéploiera automatiquement (nouveau build)

### ✅ Étape 6 : Vérifier le déploiement

#### 6.1. Vérifier le Backend

1. Allez sur votre service backend
2. Copiez l'URL du service (ex: `https://invoice-management-backend.onrender.com`)
3. Ouvrez dans votre navigateur : `https://invoice-management-backend.onrender.com/api/health`
4. Vous devriez voir :
   ```json
   {"success": true, "message": "API fonctionnelle avec Prisma"}
   ```

#### 6.2. Vérifier le Frontend

1. Allez sur votre service frontend
2. Copiez l'URL du service (visible en haut)
3. Ouvrez cette URL dans votre navigateur
4. L'application devrait se charger et se connecter au backend

### ✅ Étape 7 : Tester l'application

1. Ouvrez votre frontend dans le navigateur
2. Testez les fonctionnalités :
   - Créer un fournisseur
   - Créer un client
   - Créer une facture d'achat
   - Vérifier le stock des produits
   - Créer une facture de vente

Si tout fonctionne, votre déploiement est réussi ! 🎉

---

## ⚡ Démarrage Rapide (Résumé)

1. ✅ **Préparer** : Code sur GitHub/GitLab/Bitbucket avec `render.yaml` à la racine
2. ✅ **Déployer** : Créer un Blueprint sur Render
3. ✅ **Migrer** : Exécuter `npx prisma migrate deploy` dans le Shell du backend
4. ✅ **Configurer** : Ajouter `FRONTEND_URL` dans le backend et `VITE_API_URL` dans le frontend
5. ✅ **Tester** : Vérifier que l'application fonctionne

👉 **Pour plus de détails**, suivez les étapes complètes ci-dessus.

## 📋 Prérequis

1. Un compte Render (gratuit disponible sur [render.com](https://render.com))
2. Le code source de l'application dans un dépôt Git (GitHub, GitLab, ou Bitbucket)

## 🚀 Méthode 1 : Déploiement Automatique avec render.yaml

### Étape 1 : Préparer le dépôt

1. Assurez-vous que votre code est poussé sur GitHub/GitLab/Bitbucket
2. Le fichier `render.yaml` doit être à la racine du dépôt

### Étape 2 : Déployer sur Render

1. Connectez-vous à votre compte Render
2. Dans le tableau de bord, cliquez sur **"New +"** → **"Blueprint"**
3. Sélectionnez votre dépôt Git
4. Render détectera automatiquement le fichier `render.yaml`

**⚠️ Attention : Carte bancaire demandée**

Render peut demander une carte bancaire pour vérification, même pour le plan gratuit. Voici ce que vous devez savoir :

- ✅ **Vous NE serez PAS facturé** si vous utilisez uniquement le plan gratuit
- ✅ La carte peut être utilisée uniquement pour prévenir les abus
- ⚠️ **IMPORTANT** : Assurez-vous que chaque service est configuré en **plan "Free"** avant d'appliquer
- ⚠️ Vérifiez les 3 services et sélectionnez **"Free"** pour chacun :
  - Base de données : Plan **Free**
  - Backend : Plan **Free**
  - Frontend : Plan **Free**

5. Cliquez sur **"Apply"** pour créer tous les services

**💡 Alternative** : Si vous ne souhaitez pas fournir de carte bancaire, utilisez la **Méthode 2 : Déploiement Manuel** ci-dessous.

### Étape 3 : Configuration automatique

Render créera automatiquement :
- ✅ Une base de données PostgreSQL
- ✅ Un service Web pour le backend
- ✅ Un service Web statique pour le frontend
- ✅ Les variables d'environnement nécessaires

### Étape 4 : Migration de la base de données

Une fois les services déployés, vous devez exécuter les migrations Prisma :

1. Allez dans votre service backend sur Render
2. Ouvrez l'onglet **"Shell"**
3. Exécutez les commandes suivantes :

```bash
cd backend
npx prisma migrate deploy
```

**Important** : Cette étape est obligatoire avant d'utiliser l'application. Sans les migrations, la base de données sera vide.

## 🛠️ Méthode 2 : Déploiement Manuel

### Étape 1 : Créer la base de données PostgreSQL

1. Dans le tableau de bord Render, cliquez sur **"New +"** → **"PostgreSQL"**
2. Configurez :
   - **Name**: `invoice-management-db`
   - **Database**: `invoice_management`
   - **User**: `invoice_user`
   - **Region**: Choisissez la région la plus proche (ex: Frankfurt)
   - **Plan**: Free (pour commencer)
3. Cliquez sur **"Create Database"**
4. Une fois créée, notez l'**Internal Database URL** (pour le backend) et l'**External Database URL** (pour les connexions externes)

### Étape 2 : Déployer le Backend

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt Git
3. Configurez le service :
   - **Name**: `invoice-management-backend`
   - **Environment**: `Node`
   - **Region**: Même région que la base de données
   - **Branch**: `main` (ou votre branche principale)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

4. **Variables d'environnement** à ajouter :
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<copiez la Internal Database URL de votre base de données>
   FRONTEND_URL=<vous ajouterez cette URL après avoir déployé le frontend>
   JWT_SECRET=<générez une clé secrète aléatoire>
   JWT_EXPIRES_IN=7d
   LOG_LEVEL=info
   ```

5. Cliquez sur **"Create Web Service"**

### Étape 3 : Exécuter les migrations

Une fois le backend déployé :

1. Allez dans votre service backend
2. Ouvrez l'onglet **"Shell"**
3. Exécutez :
   ```bash
   npx prisma migrate deploy
   ```

### Étape 4 : Déployer le Frontend

1. Cliquez sur **"New +"** → **"Static Site"**
2. Connectez votre dépôt Git
3. Configurez :
   - **Name**: `invoice-management-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Variables d'environnement** à ajouter :
   ```
   VITE_API_URL=<URL de votre service backend>/api
   ```
   Exemple : `VITE_API_URL=https://invoice-management-backend.onrender.com/api`

5. Cliquez sur **"Create Static Site"**

### Étape 5 : Mettre à jour le FRONTEND_URL du backend

1. Retournez dans votre service backend
2. Allez dans **"Environment"**
3. Mettez à jour `FRONTEND_URL` avec l'URL de votre frontend statique
4. Redéployez le service

## 🔧 Configuration Post-Déploiement

### Variables d'environnement importantes

#### Backend
- `DATABASE_URL` : Automatiquement configurée si vous utilisez la méthode automatique
- `FRONTEND_URL` : URL de votre site statique (ex: `https://invoice-management-frontend.onrender.com`)
- `JWT_SECRET` : Générée automatiquement avec la méthode automatique

#### Frontend
- `VITE_API_URL` : URL complète de votre API backend (ex: `https://invoice-management-backend.onrender.com/api`)

### Scripts de migration

Si vous devez exécuter des migrations après le déploiement :

1. Ouvrez le Shell du service backend
2. Exécutez :
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### Générer Prisma Client

Si nécessaire, dans le Shell du backend :
```bash
cd backend
npx prisma generate
```

## 💰 Plans et Pricing

### Plan Gratuit (Free Tier) ✅

Render propose un **plan gratuit** qui permet de déployer votre application gratuitement, avec quelques limitations :

#### ✅ Inclus dans le plan gratuit :
- **Services Web** : Illimités
- **Sites Statiques** : Illimités (parfait pour le frontend)
- **Base de données PostgreSQL** : 1 base de données gratuite
- **HTTPS** : Automatique pour tous les services
- **Builds** : 500 heures par mois (gratuit)
- **GitHub/GitLab/Bitbucket** : Intégration automatique

#### ⚠️ Limitations du plan gratuit :
- **Services Web** : Mis en veille après 15 minutes d'inactivité
  - Le premier appel après mise en veille peut prendre 30-60 secondes (temps de démarrage)
  - Parfait pour les projets personnels et les démos
  
- **Base de données** : 
  - Limite de taille : ~1 GB
  - Supprimée après 90 jours d'inactivité complète
  - Pour éviter la suppression, utilisez-la régulièrement

- **Sites Statiques** : Aucune limitation particulière (très généreux)

### Plans Payants (optionnel)

Si vous avez besoin de plus de ressources :

- **Starter** : ~7$/mois par service
  - Pas de mise en veille
  - Plus de RAM
  - Meilleures performances
  
- **Standard** : ~25$/mois par service
  - Encore plus de ressources
  - Support prioritaire

- **Base de données** : Plans payants disponibles pour des bases plus grandes

## 📝 Notes Importantes

1. **Plan Gratuit disponible** : Vous pouvez déployer cette application entièrement gratuitement sur Render !

2. **Mise en veille** : Le plan gratuit met les services en veille après 15 minutes d'inactivité. Le premier appel après la mise en veille peut prendre 30-60 secondes (temps de démarrage). C'est parfait pour les projets personnels et les démos.

3. **Base de données gratuite** : La base de données PostgreSQL gratuite est supprimée après 90 jours d'inactivité complète. Pensez à l'utiliser régulièrement ou passez à un plan payant si nécessaire.

4. **Limite de build** : Le plan gratuit a une limite de 500 heures de build par mois (largement suffisant pour la plupart des projets).

5. **HTTPS** : Render fournit automatiquement HTTPS pour tous les services, même en gratuit.

6. **CORS** : Assurez-vous que `FRONTEND_URL` dans le backend correspond exactement à l'URL de votre frontend (avec https://).

## 💡 Recommandation

Pour cette application, le **plan gratuit de Render est parfaitement adapté** pour :
- ✅ Projets personnels
- ✅ Démonstrations
- ✅ Petits projets
- ✅ Apprentissage et développement

Vous pouvez toujours passer à un plan payant plus tard si vous avez besoin de :
- Pas de mise en veille
- Plus de performances
- Support prioritaire
- Base de données plus grande

## 🔍 Vérification du Déploiement

1. **Backend** : Visitez `https://<votre-backend>.onrender.com/api/health`
   - Vous devriez voir : `{"success": true, "message": "API fonctionnelle avec Prisma"}`

2. **Frontend** : Visitez l'URL de votre site statique
   - L'application devrait se charger et se connecter au backend

3. **Base de données** : Dans le Shell du backend :
   ```bash
   cd backend
   npx prisma studio
   ```
   Note: Prisma Studio ne fonctionne pas directement sur Render. Utilisez plutôt les routes API pour vérifier les données.

## 🐛 Résolution de Problèmes

### Le backend ne démarre pas
- Vérifiez les logs dans l'onglet "Logs" du service
- Assurez-vous que `DATABASE_URL` est correcte
- Vérifiez que les migrations ont été exécutées

### Erreurs CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond exactement à l'URL du frontend
- Assurez-vous d'inclure `https://` dans l'URL

### Erreurs de connexion à la base de données
- Vérifiez que vous utilisez la **Internal Database URL** (pas External)
- Vérifiez que la base de données est active
- Assurez-vous que les migrations ont été exécutées

### Le frontend ne peut pas se connecter au backend
- Vérifiez que `VITE_API_URL` est correctement configurée
- Assurez-vous que l'URL inclut `/api` à la fin
- Vérifiez les logs du backend pour voir si les requêtes arrivent

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Render PostgreSQL](https://render.com/docs/databases)

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le tableau de bord Render
2. Consultez la documentation Render
3. Vérifiez les issues GitHub du projet

