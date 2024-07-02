import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// con esto no se vrga hicimos.. pero sirve para que no truene
declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    const error = new Error('no estas autorizado')
    return res.status(401).json({ error: error.message })
  }

  // para traernos el token del bearer
  const [, token] = bearer.split(' ')

  // el decode del jwt
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // revisa que el token sea valido.. que no expiro

    if (typeof decoded === 'object' && decoded.id) {
      const user = await User.findById(decoded.id).select('_id name email') // y tambien revisamos en la DB que el usuario existe

      // con esto revisamos si el usuario todavia existe
      if (user) {
        req.user = user // para que no truene esto
      } else {
        res.status(500).json({ error: 'el Maldito Token no es valido perro' }) // esto es para confundir al enemigo
      }
    }

  } catch (error) {
    res.status(500).json({ error: 'el Maldito Token no es valido perro' })
  }

  next()

}