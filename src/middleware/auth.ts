import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

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
      const user = await User.findById(decoded.id) // y tambien revisamos en la DB que el usuario existe
      console.log(user)
    }

  } catch (error) {
    res.status(500).json({ error: 'el Maldito Token no es valido perro' })
  }

  next()

}