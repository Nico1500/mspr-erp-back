# Utiliser une image Node.js Alpine comme image de base
FROM node:16

# Définir le répertoire de travail pour l'application
WORKDIR /app

# Copier les fichiers de l'application vers le conteneur
COPY package.json .

# Installer les dépendances de l'application
RUN npm install

COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "dev"]