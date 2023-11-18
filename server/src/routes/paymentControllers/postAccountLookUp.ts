import { type Request, type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"

export async function postAccountLookUp (req: Request, res: Response) {
    try {
        const { mojaloop_id } = req.body

        const id = mojaloop_id

        const parties = await Mojaloop.getMojaloopParties( { id } )

        if ( parties ) {
            return res.status(200).json({ 
                message: 'Account Lookup Successful.',
                id, 
                idType: "MSISDN" });
        }
        
        return res.status(500).json({ error: 'Account Lookup failed.' });

    }catch(error){
        return res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}