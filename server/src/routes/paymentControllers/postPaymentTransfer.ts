import { type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"
import { AuthRequest } from "../../types/express";
import { sendUpdates } from "./merchantBalance";

export async function postPaymentTransfer (req: AuthRequest, res: Response) {
    try {
        const { amountToPay } = req.body

        const currency = req.user.currency ?? "USD"

        const payment = await Mojaloop.transferMojaloop( { amountToPay, currency } )

        if ( payment ) {
            const hasSentClientUpdate = sendUpdates( amountToPay - 0.5 );
            return res.status(200).json({ message: `${String(amountToPay) +' '+ currency} payment successful.`, hasSentClientUpdate });
        }

        return res.status(404).json({ error: 'Payment failed.' });

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}