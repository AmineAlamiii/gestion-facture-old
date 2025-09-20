# Utiliser Node.js 18 Alpine comme image de base
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache netcat-openbsd openssl libc6-compat

# Installer Prisma CLI globalement
RUN npm install -g prisma

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Variables d'environnement
ENV NODE_ENV=development
ENV PORT=3001

# Exposer le port
EXPOSE 3001

# Script de démarrage avec initialisation de la base
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
