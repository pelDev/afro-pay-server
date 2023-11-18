import { type Request, type Response } from "express";
import * as z from 'zod';
import jwt from 'jsonwebtoken'

import logger from "../../services/logger";
import * as Mojaloop from "../../services/mojaloop"
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";

import { hashPassword } from "../../utils/utils";

export const RegisterFormSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';

export async function postUserRegister (req:Request, res: Response) {
    try {
        RegisterFormSchema.parse(req.body)
    } catch (err) {
        if (err instanceof z.ZodError) {
            logger.debug('Validation error: %o', err);
            return res.status(422).send({ message: 'Validation error' });
        }
    }

    try {
        const user = await AppDataSource.manager.findOne(
            UserEntity,
            {
                where: { email: req.body.email }
            }
        )
        logger.info('Attempting to register user %s', req.body.email)
    
        if (user) {
          throw new Error('User already exists')
        }

        const password = await hashPassword(req.body.password)
        let new_user = new UserEntity()

        new_user.email = req.body.email
        new_user.firstName = req.body.firstName
        new_user.lastName = req.body.lastName
        new_user.password = password

        new_user = await AppDataSource.manager.save(new_user)
    
        const token = jwt.sign(
          { id: new_user.id, email: new_user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        )
        const isMojaloopRegistered = await Mojaloop.registerMojaloopParticipant( { name: new_user.firstName, currency: "USD" } )

        if (!isMojaloopRegistered) throw new Error("Failed to register user with mojaloop")

        logger.info('User %s registered successfully.', new_user.email)
    
        return res.json({ success: true, message: 'Registration successful', token })
      } catch (error: any) {    
        logger.error('User %s registration failed: %o', req.body.email, error)
        res
          .status(400)
          .send({ success: false, message: error.message })
      }
}