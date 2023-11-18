import express from "express";
import { postUserLogin } from "./authControllers/postUserLogin";
import { postUserRegister } from "./authControllers/postUserRegister";

const router = express.Router();

router.route("/login").post(
    postUserLogin
);

router.route("/register").post(
    postUserRegister
);

export default router;