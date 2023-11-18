import { type Request, type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"

export async function postPaymentQuote (req: Request, res: Response) {
    try {
        const { id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth } = req.body

        const parties = await Mojaloop.getMojaloopParties( { id } )

        if ( parties ) {
            res.status(200).json({ message: 'Payment quote created successfully.', id, amountToPay: amount + 0.5, currency });
        }
        
        res.status(404).json({ error: 'Error creating payment quote.' });

    }catch(error){
        res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}