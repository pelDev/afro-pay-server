// express.d.ts
import { type UserEntity } from 'src/entity/UserEntity'

import { type Request } from 'express'

declare module 'express' {
  export interface Request {
    user?: UserEntity
  }
}

export interface AuthRequest extends Request {
  user?: UserEntity
}
