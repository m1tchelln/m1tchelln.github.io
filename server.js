const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let clients = 0;

// Serve static files from the "public" directory
app.use(express.static('public'));

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('New client connected');
  if (ws.readyState === WebSocket.OPEN) {
    clients++;
    ws.send(`User ${clients}`); // Ensure the message is sent as text
  }


  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString()); // Ensure the message is sent as text
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
