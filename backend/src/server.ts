import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { config, validateConfig, dbConfig } from './config';
import { getDatabase } from './config/database';
import { corsMiddleware } from './middleware/cors';
import { logger, requestLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

// Validation de la configuration
validateConfig();

// Création de l'application Express
const app = express();

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Middleware de compression
app.use(compression());

// Middleware CORS
app.use(corsMiddleware);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use(logger);
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Route de fallback pour les routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    console.log('🔄 Initialisation de la base de données...');
    const db = getDatabase(dbConfig.path);
    await db.initialize();

    // Démarrer le serveur
    const server = app.listen(config.port, () => {
      console.log('🚀 Serveur démarré avec succès!');
      console.log(`📡 API disponible sur: http://localhost:${config.port}/api`);
      console.log(`🌍 Environnement: ${config.nodeEnv}`);
      console.log(`📊 Base de données: ${dbConfig.path}`);
      console.log(`🔗 CORS autorisé pour: ${config.corsOrigin}`);
      console.log('📝 Logs activés');
    });

    // Gestion gracieuse de l'arrêt
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Signal ${signal} reçu. Arrêt gracieux du serveur...`);
      
      server.close(async () => {
        console.log('🔌 Serveur HTTP fermé');
        
        try {
          await db.close();
          console.log('🗄️  Base de données fermée');
          console.log('✅ Arrêt gracieux terminé');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erreur lors de la fermeture de la base de données:', error);
          process.exit(1);
        }
      });

      // Forcer l'arrêt après 10 secondes
      setTimeout(() => {
        console.error('⏰ Arrêt forcé après timeout');
        process.exit(1);
      }, 10000);
    };

    // Écouter les signaux d'arrêt
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Gestion des erreurs non capturées
    process.on('uncaughtException', (error) => {
      console.error('❌ Exception non capturée:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesse rejetée non gérée:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

export default app;
