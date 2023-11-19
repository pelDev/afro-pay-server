import { type Request, type Response } from "express";
import * as z from 'zod';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import logger from "../../services/logger";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";

export const LoginFormSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string()
})

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';

export async function postUserLogin (req:Request, res: Response) {
    try {
        LoginFormSchema.parse(req.body)
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
        logger.info('User %s login attempt.', req.body.email)
    
        if (user == null) {
          throw new Error('Invalid credentials')
        }
    
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatch) {
          throw new Error('Invalid credentials')
        }
    
        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        )
        logger.info('User %s logged in successfully.', user.email)
    
        return res.json({ success: true, message: 'Login successful', token, user: {email: user.email} })
      } catch (error: any) {    
        logger.error('User %s login failed: %o', req.body.email, error)
        res
          .status(400)
          .send({ success: false, message: error.message })
      }
}