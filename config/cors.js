import env from './env.js';

const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const parseClientUrls = () => {
  const raw = env.clientUrl || '';
  return raw
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
};

const getAllowedOrigins = () => {
  const origins = new Set([...DEV_ORIGINS, ...parseClientUrls()]);
  return [...origins];
};

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (env.nodeEnv === 'development') {
      callback(null, true);
      return;
    }

    console.warn(`CORS blocked request from origin: ${origin}`);
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
export { getAllowedOrigins };
