import morgan from 'morgan';
import { Request, Response } from 'express';

// Configuration du format de log
const logFormat = (tokens: any, req: Request, res: Response) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens['response-time'](req, res);
  const contentLength = tokens.res(req, res, 'content-length');
  const userAgent = tokens['user-agent'](req, res);
  const remoteAddr = tokens['remote-addr'](req, res);

  // Couleurs pour les logs
  const getStatusColor = (status: string) => {
    const statusNum = parseInt(status);
    if (statusNum >= 500) return '\x1b[31m'; // Rouge pour les erreurs serveur
    if (statusNum >= 400) return '\x1b[33m'; // Jaune pour les erreurs client
    if (statusNum >= 300) return '\x1b[36m'; // Cyan pour les redirections
    return '\x1b[32m'; // Vert pour les succès
  };

  const resetColor = '\x1b[0m';
  const statusColor = getStatusColor(status);

  return [
    `\x1b[90m${new Date().toISOString()}\x1b[0m`, // Timestamp en gris
    `\x1b[35m${method}\x1b[0m`, // Méthode en magenta
    `\x1b[34m${url}\x1b[0m`, // URL en bleu
    `${statusColor}${status}\x1b[0m`, // Status avec couleur
    `\x1b[90m${responseTime}ms\x1b[0m`, // Temps de réponse en gris
    `\x1b[90m${contentLength || 0}b\x1b[0m`, // Taille en gris
    `\x1b[90m${remoteAddr}\x1b[0m`, // IP en gris
    `\x1b[90m${userAgent}\x1b[0m` // User-Agent en gris
  ].join(' ');
};

// Middleware de logging
export const logger = morgan(logFormat, {
  skip: (req: Request, res: Response) => {
    // Ignorer les requêtes de santé
    return req.url === '/health' || req.url === '/favicon.ico';
  }
});

// Logger personnalisé pour les erreurs
export const errorLogger = (error: Error, req: Request, res: Response, next: any) => {
  console.error('❌ Erreur:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  next(error);
};

// Logger pour les requêtes importantes
export const requestLogger = (req: Request, res: Response, next: any) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    console.log(`📝 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  }
  next();
};
