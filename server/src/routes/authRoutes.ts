import express from "express";
import { postUserLogin } from "./authControllers/postUserLogin";

const router = express.Router();

router.route("/login").post(
    postUserLogin
);

export default router;