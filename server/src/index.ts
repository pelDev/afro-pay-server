import 'reflect-metadata'
import express from "express";
import cors from "cors";
import path from "path";

import setupRoutes from "./setup/setupRoutes";
import setupServer from './setup/setupServer';
import setupMiddlewares from "./setup/setupMiddlewares";
import { tryInitializeDatabase } from './setup/setupServiceInitializers';
import { readEnv } from './setup/readEnv';
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })
} else {
    dotenv.config();
}

const HOSTNAME: string = readEnv('HOST', 'localhost') as string;
const PORT: number = readEnv('PORT', 5000, true) as number;

const app = express();
app.use(express.json());
app.use(cors());

setupMiddlewares(app);
setupRoutes(app);

setupServer(app, HOSTNAME, PORT, tryInitializeDatabase);