import http from 'http';
import express from 'express';
import cors from 'cors';
import sensorRoutes from './routes/sensor.routes.js';
import { setupWebSocketServer } from './websocket/thermalSocket.js';
import { mockSensorService } from './services/mockSensor.service.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/sensor', sensorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AMG8833 Thermal Monitoring System',
    timestamp: new Date().toISOString(),
    sensorStatus: mockSensorService.getStatus()
  });
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🔥 AMG8833 Thermal Backend Server Running on Port ${PORT}`);
  console.log(`📡 REST API:   http://localhost:${PORT}/api/sensor`);
  console.log(`⚡ WebSocket:  ws://localhost:${PORT}/ws/thermal`);
  console.log(`===================================================`);
});
