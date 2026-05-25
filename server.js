import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team Task Manager API',
    health: '/api/health',
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  if (!env.mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  if (!env.jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
  }

  try {
    await connectDB();

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err?.message || err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.message || err);
  process.exit(1);
});

startServer();
