import express from "express";
import { postAccountLookUp } from "./paymentControllers/postAccountLookUp";
import { postPaymentQuote } from "./paymentControllers/postPaymentQuote";
import { postPaymentTransfer } from "./paymentControllers/postPaymentTransfer";

const router = express.Router();

router.route("/accountlookup").post(
    postAccountLookUp
);

router.route("/quote").post(
    postPaymentQuote
);

router.route("/transfer").post(
    postPaymentTransfer
);

export default router;