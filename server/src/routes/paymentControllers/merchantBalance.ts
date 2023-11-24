import { getWss } from "../..";
import { Request } from "express";
import WebSocket from 'ws';
import { WebsocketRequestHandler } from "express-ws";
import logger from "../../services/logger";

export const socketConnection: WebsocketRequestHandler = (ws: WebSocket, req: Request) => {
    logger.info('Client connected');
  
    let merchantBalance = 0;

    ws.send(JSON.stringify({ merchantBalance: merchantBalance }));
  }

export function sendUpdates(updatedBalance: number) {
    const wss = getWss();

    const client = Array.from(wss.clients)[0] ?? null;
    
    if (!client) return false;

    client.send(JSON.stringify({ updatedBalance }));

    return true;
}