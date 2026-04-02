import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

// Request Tracer
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com", "https://cdn.quilljs.com", "https://cdn.jsdelivr.net"],
            "script-src-attr": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "http://localhost:5000"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.quilljs.com", "https://cdn.jsdelivr.net"],
            "font-src": ["'self'", "https://fonts.gstatic.com"]
        },
    },
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Increased limit for development
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/messages', messageRoutes);

// Static for Frontend, Uploads & Admin Panel
const __dirname = path.resolve();
const rootDir = path.join(__dirname, '..'); // Root of My-Portfolio

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/admin', express.static(path.join(rootDir, 'admin')));
app.use('/images', express.static(path.join(rootDir, 'images')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

// Frontend (Must be after API routes)
app.use(express.static(rootDir));

// Root Route - Serve index.html or fallback to API message if API request
app.get('/', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(rootDir, 'index.html'));
    } else {
        res.send('🚀 Portfolio API is running...');
    }
});

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
