import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction } from 'express'
import { AppDataSource } from '../database/dataSource'
import { UserEntity } from '../entity/UserEntity'
import { type IJWTUser } from '../types/jwtUser'
import { AuthRequest } from '../types/express'

export const JWT_SECRET = process.env.JWT_SECRET ?? ''

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
export async function authenticateJWT (req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.header('Authorization')

  if (authorization === undefined) {
    return res.status(401).send({ message: 'Authorization Failed' })
  }

  if (authorization === null) {
    return res.status(401).send({ message: 'Authorization Failed' })
  }

  const token = authorization.replace('Bearer', '').trim()

  try {
    const jwtUser = jwt.verify(token, JWT_SECRET) as IJWTUser
    const user = await AppDataSource.manager.findOne(
      UserEntity,
      {
        where: { email: jwtUser.email },
      }
    )

    if (user == null) {
      throw new Error('JWT User\'s Email not found')
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).send({ message: 'Authorization Failed', error: err })
  }
}
