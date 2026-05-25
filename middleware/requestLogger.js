import env from '../config/env.js';

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      console.error(log);
    } else if (env.nodeEnv === 'production') {
      console.log(log);
    }
  });

  next();
};

export default requestLogger;
