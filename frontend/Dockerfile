# Utiliser Node.js 18 Alpine comme image de base
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Variables d'environnement
ENV VITE_API_URL=http://backend:3001/api
ENV VITE_NODE_ENV=development

# Exposer le port
EXPOSE 5173

# Commande de démarrage
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
