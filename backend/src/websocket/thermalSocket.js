import { WebSocketServer, WebSocket } from 'ws';
import { mockSensorService } from '../services/mockSensor.service.js';

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws/thermal' });

  wss.on('connection', (ws, req) => {
    console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);

    // Initial state push
    ws.send(JSON.stringify({
      type: 'sensor_status',
      data: mockSensorService.getStatus()
    }));

    ws.send(JSON.stringify({
      type: 'environment_status',
      data: mockSensorService.getEnvironmentStatus()
    }));

    ws.send(JSON.stringify({
      type: 'thermal_frame',
      data: mockSensorService.getLatestFrame()
    }));

    // Subscribe to backend simulation updates
    const unsubscribe = mockSensorService.subscribe((event) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    });

    // Listen for incoming commands
    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message.toString());

        switch (payload.action) {
          case 'set_scenario':
            if (payload.scenario) mockSensorService.setScenario(payload.scenario);
            break;

          case 'set_fps':
            if (payload.fps) mockSensorService.setFps(payload.fps);
            break;

          case 'update_config':
            if (payload.config) mockSensorService.updateConfig(payload.config);
            break;

          case 'start':
            mockSensorService.start();
            break;

          case 'stop':
            mockSensorService.stop();
            break;

          default:
            console.warn('[WS] Unknown action:', payload.action);
        }

        // Send updated status
        ws.send(JSON.stringify({
          type: 'sensor_status',
          data: mockSensorService.getStatus()
        }));
      } catch (err) {
        console.error('[WS] Error handling message:', err);
      }
    });

    ws.on('close', () => {
      unsubscribe();
    });

    ws.on('error', (err) => {
      unsubscribe();
    });
  });

  return wss;
}
