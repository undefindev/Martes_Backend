import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/Token'
import { AuthEmail } from '../emails/AuthEmail'

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

      // generar el token hijo de puta
      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      // enviar el email de confirmacion de cuenta
      AuthEmail.sendConfirmaionEmail({
        email: user.email,
        name: user.email,
        token: token.token
      })


      /* await user.save()
      await token.save() */

      await Promise.allSettled([user.save(), token.save()])

      res.send('Cuenta creada, revisa tu maldito email')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un Maldtio error' })
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({ token })
      if (!tokenExist) {
        const error = new Error('token no valido')
        return res.status(401).json({ error: error.message })
      }

      // confirmar al usuario
      const user = await User.findById(tokenExist.user)
      user.confirmed = true

      // guardamos el usuario confirmado y eliminamos el token
      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      res.send('Cuenta Confirmada')

    } catch (error) {
      res.status(500).json({ error: 'el token no es valido' })
    }

  }
}