import { WebSocketServer, WebSocket } from 'ws';
import { vegaWifiService } from '../services/vegaWifiService.js';

export function setupVegaWifiSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws/vega-wifi' });

  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress || '192.168.1.120';
    console.log(`[VEGA WiFi WS] Client connected from ${clientIp}`);

    // Send initial connection packet
    ws.send(JSON.stringify({
      type: 'vega_wifi_status',
      data: vegaWifiService.getStatus()
    }));

    ws.send(JSON.stringify({
      type: 'vega_wifi_telemetry',
      data: vegaWifiService.getLatestTelemetry()
    }));

    // Subscribe to incoming WiFi telemetry events
    const unsubscribe = vegaWifiService.subscribe((event) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
    });

    // Listen for incoming telemetry from VEGA ARIES v2.0 WiFi board or commands from Frontend
    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message.toString());

        // 1. If payload contains telemetry data from VEGA ARIES v2.0
        if (payload.amg8833 || payload.mq135 || payload.mq2 || payload.mr24d11c10 || payload.deviceId) {
          vegaWifiService.ingestTelemetry(payload, clientIp);
          return;
        }

        // 2. Process actions/commands
        switch (payload.action) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;

          case 'get_status':
            ws.send(JSON.stringify({
              type: 'vega_wifi_status',
              data: vegaWifiService.getStatus()
            }));
            break;

          default:
            console.warn('[VEGA WiFi WS] Unknown action:', payload.action);
        }
      } catch (err) {
        console.error('[VEGA WiFi WS] Error parsing payload:', err);
      }
    });

    ws.on('close', () => {
      unsubscribe();
    });

    ws.on('error', (err) => {
      console.error('[VEGA WiFi WS] Error:', err);
      unsubscribe();
    });
  });

  return wss;
}
