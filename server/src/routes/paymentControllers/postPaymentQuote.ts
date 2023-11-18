import { type Request, type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"
import { AuthRequest } from "../../types/express";

export async function postPaymentQuote (req: AuthRequest, res: Response) {
    try {
        console.log(req.user)

        const { mojaloop_id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth, amountToPay } = req.body

        const id = mojaloop_id

        const parties = await Mojaloop.createMojaloopQuote( { id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth, name: req.user.firstName + req.user.lastName, amountToPay } )

        if ( parties ) {
            return res.status(200).json({ message: 'Payment quote created successfully.', id: mojaloop_id, amountToPay: amount + 0.5, currency });
        }
        
        return res.status(404).json({ error: 'Error creating payment quote.' });

    }catch(error){
        return res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}