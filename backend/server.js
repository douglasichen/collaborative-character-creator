const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

const clients = {};

wss.on('connection', (ws) => {
    // Generate a unique ID for the client
    const clientId = generateUniqueId();
    clients[clientId] = ws;
    console.log(`Client ${clientId} connected`);

    ws.on('message', (message) => {
        console.log(`Received message from client ${clientId}: ${message}`);
        // Broadcast the message to all connected clients
        broadcastMessage(clientId, message);
    });

    ws.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        delete clients[clientId];
    });

    ws.on('error', (error) => {
        console.error(`Client ${clientId} encountered error: ${error}`);
    });
});

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function broadcastMessage(senderId, message) {
    for (const clientId in clients) {
        if (clientId !== senderId) {
            clients[clientId].send(`Client ${senderId} says: ${message}`);
        }
    }
}

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
