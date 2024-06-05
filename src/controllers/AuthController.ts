import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body

      // prevenir usuarios duplicados
      const userExist = await User.findOne({ email })
      if (userExist) {
        const error = new Error('este maldito usuario ya existe')
        return res.status(409).json({ error: error.message })
      }

      // si no existe... crea al maldito
      const user = new User(req.body)

      // has password
      user.password = await hashPassword(password)
      await user.save()

      res.send('Cuenta creada, revisa tu maldito email')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un Maldtio error' })
    }
  }
}