import express, { type Request, type Response } from "express";

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
    return res.status(200).send({ message: 'OK' })
})

export default router;