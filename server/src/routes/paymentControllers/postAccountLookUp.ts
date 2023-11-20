import { type Response } from "express";
import * as Mojaloop from "../../services/mojaloop"
import { AuthRequest } from "../../types/express";

export async function postAccountLookUp (req: AuthRequest, res: Response) {
    try {
        const id = req.user.mojaloopId

        const parties = await Mojaloop.getMojaloopParties( { id } )

        if ( parties ) {
            return res.status(200).json({ 
                message: 'Account Lookup Successful.',
                id, 
                idType: "MSISDN"
            });
        }
        
        return res.status(500).json({ error: 'Account Lookup failed.' });

    }catch(error){
        return res.status(500).json({ error: 'Unexpected response from the server.' });
    }
}