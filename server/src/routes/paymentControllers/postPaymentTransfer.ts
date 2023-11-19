import { type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"
import { AuthRequest } from "../../types/express";

export async function postPaymentTransfer (req: AuthRequest, res: Response) {
    try {
        //Send back the amount to pay
        const { amountToPay } = req.body

        const currency = req.user.currency ?? "USD"

        const payment = await Mojaloop.transferMojaloop( { amountToPay, currency } )

        if ( payment ) {
            return res.status(200).json({ message: `${String(amountToPay) +' '+ currency} payment successful.` });
        }
        
        return res.status(404).json({ error: 'Payment failed.' });

    }catch(error){
        res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}