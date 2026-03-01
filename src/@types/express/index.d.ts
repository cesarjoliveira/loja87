import 'express'

declare global {
  namespace Express {
    interface User {
      id: string
      email?: string
      role: 'ADMIN' | 'USER' | string
    }

    interface Request {
      user?: User
    }
  }
}