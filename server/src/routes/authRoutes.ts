import express from "express";
import { postUserLogin } from "./authControllers/postUserLogin";
import { postUserRegister } from "./authControllers/postUserRegister";
import { authenticateJWT } from "../middlewares/authenticate";
import { getUserDetails } from "./authControllers/getUserDetails";

const router = express.Router();

router.route("/login").post(
    postUserLogin
);

router.route("/register").post(
    postUserRegister
);

router.route("/me").get(authenticateJWT, getUserDetails);

export default router;