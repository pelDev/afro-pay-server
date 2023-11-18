import { type Request, type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"

export async function postAccountLookUp (req: Request, res: Response) {
    try {
        const { id } = req.body

        const parties = await Mojaloop.getMojaloopParties( { id } )

        if ( parties ) {
            res.status(200).json({ 
                message: 'Account Lookup Successful.',
                id, 
                idType: "MSISDN" });
        }
        
        res.status(500).json({ error: 'Account Lookup failed.' });

    }catch(error){
        res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}