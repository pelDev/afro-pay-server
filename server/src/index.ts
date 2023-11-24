import 'reflect-metadata'
import express from "express";
import cors from "cors";
import path from "path";
import expressWs from 'express-ws';

import setupRoutes from "./setup/setupRoutes";
import setupServer from './setup/setupServer';
import setupMiddlewares from "./setup/setupMiddlewares";
import { tryInitializeDatabase } from './setup/setupServiceInitializers';
import { readEnv } from './setup/readEnv';
import dotenv from 'dotenv'
import { socketConnection } from './routes/paymentControllers/merchantBalance';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })
} else {
    dotenv.config();
}

const HOSTNAME: string = readEnv('HOST', 'localhost') as string;
const PORT: number = readEnv('PORT', 5000, true) as number;

const defaultApp = express();
export const { app, getWss } = expressWs(defaultApp);
app.use(express.json());
app.use(cors());
app.ws('/bal', socketConnection)

setupMiddlewares(app);
setupRoutes(app);

setupServer(app, HOSTNAME, PORT, tryInitializeDatabase);