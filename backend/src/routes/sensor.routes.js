import { Router } from 'express';
import { mockSensorService } from '../services/mockSensor.service.js';
import { vegaWifiService } from '../services/vegaWifiService.js';

const router = Router();

// GET /api/sensor/status
router.get('/status', (req, res) => {
  res.json(mockSensorService.getStatus());
});

// GET /api/sensor/frame - Latest thermal frame
router.get('/frame', (req, res) => {
  res.json(mockSensorService.getLatestFrame());
});

// GET /api/sensor/history - History of frames
router.get('/history', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  res.json(mockSensorService.getHistory(limit));
});

// GET /api/environment/status - Environmental monitoring status
router.get('/environment/status', (req, res) => {
  res.json(mockSensorService.getEnvironmentStatus());
});

// GET /api/environment/config - Threshold configuration
router.get('/environment/config', (req, res) => {
  res.json(mockSensorService.getConfig());
});

// PUT /api/environment/config - Update threshold configuration
router.put('/environment/config', (req, res) => {
  const updated = mockSensorService.updateConfig(req.body);
  res.json({ success: true, config: updated });
});

// ====================================================
// VEGA ARIES v2.0 WiFi REST Endpoints
// ====================================================

// POST /api/sensor/vega-wifi — Ingest JSON Telemetry from VEGA ARIES v2.0 WiFi board
router.post('/vega-wifi', (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || '192.168.1.120';
    const merged = vegaWifiService.ingestTelemetry(req.body, clientIp);
    res.json({ success: true, message: 'Telemetry received over WiFi', status: vegaWifiService.getStatus(), telemetry: merged });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/sensor/vega-wifi/status — Query active WiFi connection status
router.get('/vega-wifi/status', (req, res) => {
  res.json(vegaWifiService.getStatus());
});

// GET /api/sensor/vega-wifi/latest — Query latest ingested WiFi telemetry
router.get('/vega-wifi/latest', (req, res) => {
  res.json(vegaWifiService.getLatestTelemetry());
});

// Simulation Control Endpoints
router.post('/simulation/start', (req, res) => {
  mockSensorService.start();
  res.json({ success: true, message: 'Simulation streaming started', status: mockSensorService.getStatus() });
});

router.post('/simulation/stop', (req, res) => {
  mockSensorService.stop();
  res.json({ success: true, message: 'Simulation streaming paused', status: mockSensorService.getStatus() });
});

router.post('/simulation/scenario', (req, res) => {
  const { scenario } = req.body;
  if (!scenario) {
    return res.status(400).json({ error: 'Missing scenario name in body' });
  }
  const success = mockSensorService.setScenario(scenario);
  if (success) {
    res.json({ success: true, scenario: mockSensorService.getScenario(), status: mockSensorService.getStatus() });
  } else {
    res.status(400).json({ error: `Invalid scenario '${scenario}'` });
  }
});

router.post('/simulation/fps', (req, res) => {
  const { fps } = req.body;
  if (fps === undefined) {
    return res.status(400).json({ error: 'Missing fps value in body' });
  }
  mockSensorService.setFps(fps);
  res.json({ success: true, fps: mockSensorService.getStatus().refreshRate });
});

export default router;
