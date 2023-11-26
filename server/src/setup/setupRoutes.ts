import path from "path";
import express, { Application } from "express";
import health_check_route from "../routes/healthCheckRoutes";
import auth_route from "../routes/authRoutes";
import payment_route from "../routes/paymentRoutes";
import { authenticateJWT } from "../middlewares/authenticate";

export default function setupRoutes (app: Application): void {
    app.use(express.static(path.join(__dirname, "../..", "public"))); // Server React App
    
    app.use("/api/v1/health-check", health_check_route);
    app.use("/api/v1/auth", auth_route);
    app.use("/api/v1/mojaloop", authenticateJWT, payment_route);

    // Catch-all route to handle 404s
    app.get("/*", (_, res) => {
        res.sendFile(path.join(__dirname, "../..", "public", "index.html"));
    });
}