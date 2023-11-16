import path from "path";
import express, { Application } from "express";
import health_check_route from "../routes/healthCheckRoutes";
import auth_route from "../routes/authRoutes";

export default function setupRoutes (app: Application): void {
    app.use(express.static(path.join(__dirname, "../..", "public"))); // Server React App
    
    app.use("/api/v1/health-check", health_check_route);
    app.use("/api/v1/auth", auth_route);

    // Catch-all route to handle 404s
    app.use('*', (_, res) => {
        return res.status(404).json({ message: 'Route not found' });
    });
}