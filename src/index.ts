import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes'; // Added Service Routes Import

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: string;
      MONGODB_USERNAME?: string;
      MONGODB_PASSWORD?: string;
      MONGODB_CLUSTER?: string;
      MONGODB_DB_NAME?: string;
      NEXT_PUBLIC_API_URL?: string;
    }
  }
}

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Global Middlewares
// ==========================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(`${_req.method} ${_req.path}`);
  next();
});

// ==========================================
// 2. Base & Utility Routes
// ==========================================
// Test route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'LuminaDraft API is running smoothly'
  });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'LuminaDraft API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      api: '/api'
    }
  });
});

// ==========================================
// 3. Application Domain Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes); // Added Service Routes here before 404 handler

// ==========================================
// 4. Error & Fallback Handlers
// ==========================================
// 404 handler for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: _req.originalUrl
  });
});

// Global error handler
app.use((err: Error, _req: Request, _res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  _res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================================
// 5. Server Initialization
// ==========================================
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('⚠️  Starting server without database connection. API calls requiring DB will fail.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();