/**
 * Server-Sent Events (SSE) utilities for streaming logs
 */

export interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

// Store active SSE connections
const sseClients = new Map<string, SSEClient[]>();

/**
 * Create an SSE response stream
 */
export function createSSEStream(commandId: string): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      // Register this client
      const client: SSEClient = {
        id: crypto.randomUUID(),
        controller,
      };

      if (!sseClients.has(commandId)) {
        sseClients.set(commandId, []);
      }
      sseClients.get(commandId)!.push(client);

      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // Keep-alive ping every 30 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      // Cleanup on close
      const cleanup = () => {
        clearInterval(keepAlive);
        const clients = sseClients.get(commandId);
        if (clients) {
          const index = clients.findIndex((c) => c.id === client.id);
          if (index !== -1) {
            clients.splice(index, 1);
          }
          if (clients.length === 0) {
            sseClients.delete(commandId);
          }
        }
      };

      // Handle stream cancellation
      return () => {
        cleanup();
      };
    },
  });
}

/**
 * Send a log message to all connected SSE clients for a command
 */
export function broadcastLog(commandId: string, log: {
  type: 'log' | 'phase' | 'complete' | 'error';
  message?: string;
  phase?: string;
  status?: string;
  timestamp?: number;
}) {
  const clients = sseClients.get(commandId);
  if (!clients || clients.length === 0) return;

  const encoder = new TextEncoder();
  const data = JSON.stringify({ ...log, timestamp: log.timestamp || Date.now() });
  const message = `data: ${data}\n\n`;
  const encoded = encoder.encode(message);

  // Send to all connected clients
  for (const client of [...clients]) {
    try {
      client.controller.enqueue(encoded);
    } catch (error) {
      // Client disconnected, remove it
      const index = clients.indexOf(client);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    }
  }
}

/**
 * Close all SSE connections for a command
 */
export function closeSSEConnections(commandId: string) {
  const clients = sseClients.get(commandId);
  if (!clients) return;

  const encoder = new TextEncoder();
  const message = encoder.encode('data: {"type":"complete"}\n\n');

  for (const client of clients) {
    try {
      client.controller.enqueue(message);
      client.controller.close();
    } catch {
      // Ignore errors on close
    }
  }

  sseClients.delete(commandId);
}

/**
 * Get count of active SSE connections
 */
export function getActiveConnectionCount(commandId?: string): number {
  if (commandId) {
    return sseClients.get(commandId)?.length || 0;
  }
  let total = 0;
  Array.from(sseClients.values()).forEach((clients) => {
    total += clients.length;
  });
  return total;
}
