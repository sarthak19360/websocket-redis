"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const redis_1 = require("redis");
const app = (0, express_1.default)();
const httpServer = app.listen(8080, () => console.log("Server is listening to port 8080..."));
// creating a websocket server
const wss = new ws_1.WebSocketServer({
    server: httpServer,
});
// redis pub/sub setup
const redisClient = (0, redis_1.createClient)();
const redisSubscriber = redisClient.duplicate();
redisClient.connect();
redisSubscriber.connect();
// a map to store websocket connections with user IDs
const userConnections = new Map();
const subscribe = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisSubscriber.subscribe("events", (message) => {
        const { userId } = JSON.parse(message);
        const userSocket = userConnections.get(userId);
        if (userSocket && userSocket.readyState === ws_1.WebSocket.OPEN) {
            userSocket.send(`Subscribed successfully to user: ${userId}`);
        }
    });
});
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const userId = message.toString();
        // @ts-ignore
        userConnections.set(userId, ws);
        console.log("User connected: ", userId);
    });
});
subscribe();
