import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { createClient } from "redis";

const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Server is listening to port 8080...")
);

// creating a websocket server
const wss = new WebSocketServer({
  server: httpServer,
});

// redis pub/sub setup
const redisClient = createClient();
const redisSubscriber = redisClient.duplicate();

redisClient.connect();
redisSubscriber.connect();

// a map to store websocket connections with user IDs
const userConnections = new Map<string, WebSocket>();

const subscribe = async () => {
  await redisSubscriber.subscribe("events", (message) => {
    const { userId } = JSON.parse(message);
    const userSocket = userConnections.get(userId);

    if (userSocket && userSocket.readyState === WebSocket.OPEN) {
      userSocket.send(`Subscribed successfully to user: ${userId}`);
    }
  });
};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const userId = message.toString();
    // @ts-ignore
    userConnections.set(userId, ws);
    console.log("User connected: ", userId);
  });
});
subscribe();
