import { type Response } from "express";
import { AuthRequest } from "../../types/express";

export async function getUserDetails (req: AuthRequest, res: Response) {
    return res.status(200).json({success: true, user: req.user });
}