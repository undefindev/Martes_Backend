import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    const error = new Error('no estas autorizado')
    return res.status(401).json({ error: error.message })
  }

  // para traernos el token del bearer
  const [, token] = bearer.split(' ')

  next()

}