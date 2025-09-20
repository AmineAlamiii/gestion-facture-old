# Backend - API de Gestion des Factures

API REST complète pour la gestion des factures, fournisseurs, clients et produits.

## 🚀 Fonctionnalités

- **Gestion des Fournisseurs** : CRUD complet avec validation
- **Gestion des Clients** : CRUD complet avec validation  
- **Factures d'Achat** : Création, modification, suppression avec calculs automatiques
- **Factures de Vente** : Création, modification, suppression avec calculs automatiques
- **Gestion des Produits** : Génération automatique depuis les factures d'achat
- **Tableau de Bord** : Statistiques et graphiques
- **Base de Données SQLite** : Stockage local avec relations
- **Validation des Données** : Validation complète avec Joi
- **Gestion d'Erreurs** : Middleware de gestion d'erreurs robuste
- **Logging** : Logs détaillés avec couleurs
- **CORS** : Configuration CORS pour le frontend
- **TypeScript** : Code entièrement typé

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
```bash
cp env.example .env
```

4. **Modifier le fichier .env**
```env
PORT=3001
NODE_ENV=development
DB_PATH=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Démarrage

### Mode Développement
```bash
npm run dev
```

### Mode Production
```bash
npm run build
npm start
```

Le serveur sera disponible sur `http://localhost:3001`

## 📚 API Endpoints

### 🏠 Accueil
- `GET /api/` - Informations sur l'API
- `GET /api/health` - État de santé du serveur

### 👥 Fournisseurs
- `GET /api/suppliers` - Liste des fournisseurs
- `GET /api/suppliers/:id` - Détails d'un fournisseur
- `POST /api/suppliers` - Créer un fournisseur
- `PUT /api/suppliers/:id` - Modifier un fournisseur
- `DELETE /api/suppliers/:id` - Supprimer un fournisseur
- `GET /api/suppliers/stats` - Statistiques des fournisseurs

### 👤 Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client
- `GET /api/clients/stats` - Statistiques des clients

### 📄 Factures d'Achat
- `GET /api/invoices/purchases` - Liste des factures d'achat
- `GET /api/invoices/purchases/:id` - Détails d'une facture d'achat
- `POST /api/invoices/purchases` - Créer une facture d'achat
- `PUT /api/invoices/purchases/:id` - Modifier une facture d'achat
- `DELETE /api/invoices/purchases/:id` - Supprimer une facture d'achat

### 💰 Factures de Vente
- `GET /api/invoices/sales` - Liste des factures de vente
- `GET /api/invoices/sales/:id` - Détails d'une facture de vente
- `POST /api/invoices/sales` - Créer une facture de vente
- `PUT /api/invoices/sales/:id` - Modifier une facture de vente
- `DELETE /api/invoices/sales/:id` - Supprimer une facture de vente

### 📦 Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/search/:description` - Rechercher un produit
- `GET /api/products/stats` - Statistiques des produits
- `GET /api/products/report/stock` - Rapport de stock
- `GET /api/products/low-stock` - Produits en rupture

### 📊 Tableau de Bord
- `GET /api/dashboard/stats` - Statistiques générales
- `GET /api/dashboard/charts` - Données pour graphiques
- `GET /api/dashboard/health` - État de santé du système

## 📝 Exemples d'Utilisation

### Créer un Fournisseur
```bash
curl -X POST http://localhost:3001/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fournisseur Tech SARL",
    "email": "contact@fournisseurtech.fr",
    "phone": "01 23 45 67 89",
    "address": "123 Rue de la Tech, 75001 Paris",
    "taxId": "FR12345678901"
  }'
```

### Créer une Facture d'Achat
```bash
curl -X POST http://localhost:3001/api/invoices/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "ACH-20241201-001",
    "supplierId": "supplier-uuid",
    "date": "2024-12-01",
    "dueDate": "2024-12-31",
    "items": [
      {
        "description": "Ordinateur portable",
        "quantity": 2,
        "unitPrice": 800.00,
        "taxRate": 20
      }
    ],
    "status": "pending"
  }'
```

### Créer une Facture de Vente
```bash
curl -X POST http://localhost:3001/api/invoices/sales \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "VTE-20241201-001",
    "clientId": "client-uuid",
    "date": "2024-12-01",
    "dueDate": "2024-12-31",
    "items": [
      {
        "description": "Ordinateur portable",
        "quantity": 1,
        "unitPrice": 1200.00,
        "taxRate": 20
      }
    ],
    "status": "draft"
  }'
```

## 🗄️ Base de Données

### Structure
- **SQLite** : Base de données locale
- **Tables** : suppliers, clients, purchase_invoices, sale_invoices, invoice_items, products, product_purchases
- **Relations** : Clés étrangères et index pour les performances
- **Données de test** : Fournisseurs et clients d'exemple

### Migration
La base de données est créée automatiquement au premier démarrage avec :
- Création des tables
- Création des index
- Insertion des données de test

## 🔧 Configuration

### Variables d'Environnement
```env
PORT=3001                    # Port du serveur
NODE_ENV=development         # Environnement
DB_PATH=./database.sqlite    # Chemin de la base de données
JWT_SECRET=secret-key        # Clé secrète JWT
CORS_ORIGIN=http://localhost:5173  # Origine CORS autorisée
LOG_LEVEL=info              # Niveau de log
```

### Validation
- **Joi** : Validation des données d'entrée
- **Schémas** : Validation complète pour chaque endpoint
- **Messages d'erreur** : Messages en français

## 🛡️ Sécurité

- **Helmet** : Headers de sécurité
- **CORS** : Configuration CORS stricte
- **Validation** : Validation stricte des données
- **Sanitisation** : Nettoyage des données d'entrée

## 📊 Monitoring

- **Logs** : Logs détaillés avec couleurs
- **Health Check** : Endpoint de santé
- **Métriques** : Statistiques de performance
- **Gestion d'erreurs** : Gestion centralisée des erreurs

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm start           # Démarrage en mode production
npm test            # Lancer les tests
npm run lint        # Linter le code
npm run lint:fix    # Corriger automatiquement le code
```

## 🚀 Déploiement

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Variables d'Environnement Production
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation API
- Vérifier les logs du serveur

## 🔄 Changelog

### v1.0.0
- Version initiale
- CRUD complet pour toutes les entités
- Base de données SQLite
- Validation des données
- Gestion d'erreurs
- Logging
- Documentation complète
