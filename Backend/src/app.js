import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config.js';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import messageRoutes from './routes/message.routes.js';
import webrtcRoutes from './routes/webrtc.routes.js';

const app = express();
app.use(helmet());

// const allowedOrigins = ['http://localhost:5173', 'https://codex-psi-murex.vercel.app/];
// ✅ Simple & working CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://codex-iota-mocha.vercel.app"
  ],
  credentials: true
}));

app.options("*", cors());

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.set('trust proxy', 1);

app.get('/', (req, res) => {
  res.json({
    message: 'CodeX API Server is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/webrtc', webrtcRoutes);

export default app;
