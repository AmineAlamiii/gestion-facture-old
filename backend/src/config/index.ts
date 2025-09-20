import dotenv from 'dotenv';
import { ServerConfig } from '../types';

// Charger les variables d'environnement
dotenv.config();

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const dbConfig = {
  path: process.env.DATABASE_URL || process.env.DB_PATH || './database.sqlite',
};

// Validation de la configuration
export const validateConfig = (): void => {
  const requiredEnvVars = ['JWT_SECRET'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`⚠️  Variable d'environnement ${envVar} non définie, utilisation de la valeur par défaut`);
    }
  }

  if (config.nodeEnv === 'production' && config.jwtSecret === 'your-super-secret-jwt-key-here') {
    throw new Error('❌ JWT_SECRET doit être défini en production');
  }
};
