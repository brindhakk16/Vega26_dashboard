import http from 'http';
import express from 'express';
import cors from 'cors';
import sensorRoutes from './routes/sensor.routes.js';
import { setupWebSocketServer } from './websocket/thermalSocket.js';
import { setupVegaWifiSocketServer } from './websocket/vegaWifiSocket.js';
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
    app: 'VEGA ARIES v2.0 Smart Sensor Workstation Backend',
    timestamp: new Date().toISOString(),
    sensorStatus: mockSensorService.getStatus()
  });
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket servers
setupWebSocketServer(server);
setupVegaWifiSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🔥 VEGA ARIES v2.0 Backend & WiFi Server Running on Port ${PORT}`);
  console.log(`📡 WiFi REST Ingestion: POST http://localhost:${PORT}/api/sensor/vega-wifi`);
  console.log(`⚡ WiFi WebSocket:       ws://localhost:${PORT}/ws/vega-wifi`);
  console.log(`===================================================`);
});
