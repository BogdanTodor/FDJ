import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { taskRoutes } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { swaggerDocs } from './config/swagger';
import { NotFoundError } from './errors/AppError';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter
app.use(rateLimiter);

// Routes
app.use('/api', taskRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route 404 handler
app.use((req, res, next) => {
  next(new NotFoundError('resource not found'));
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Task Manager API ready!`);
    console.log(`📗 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
}

export { app }; 