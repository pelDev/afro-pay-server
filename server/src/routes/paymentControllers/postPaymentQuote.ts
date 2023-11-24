import { type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"
import { AuthRequest } from "../../types/express";

export async function postPaymentQuote (req: AuthRequest, res: Response) {
    try {
        //Amount to send is used to create a quote
        const { amount } = req.body

        const id = req.user.mojaloopId
        const currency = req.user.currency ?? "USD"
        const note = req.body.note ?? "test"
        const senderFirstName = req.user.firstName ?? ""
        const senderLastName = req.user.lastName ?? ""
        const dateOfBirth = req.body.dateOfBirth ?? "2000-01-01"

        const quote = await Mojaloop.createMojaloopQuote( { id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth } )

        if ( quote ) {
            return res.status(200).json({ message: 'Payment quote created successfully.', id: req.user.mojaloopId, amountToPay: quote, currency });
        }
        
        return res.status(404).json({ error: 'Error creating payment quote.' });

    }catch(error){
        return res.status(500).json({ error: 'Unexpected response from the server' });
    }
}