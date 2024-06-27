import type { Request, Response } from 'express'
import User from '../models/User'
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/Token'
import { AuthEmail } from '../emails/AuthEmail'

export class AuthController {

  // create account
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
        name: user.name,
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

  // confirm account
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({ token })
      if (!tokenExist) {
        const error = new Error('token no valido')
        return res.status(404).json({ error: error.message })
      }

      // confirmar al usuario
      const user = await User.findById(tokenExist.user)
      user.confirmed = true

      // guardamos el usuario confirmado y eliminamos el token
      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      res.send('Cuenta Confirmada')

    } catch (error) {
      res.status(500).json({ error: 'valio vrga..!!' })
    }

  }


  // login
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('usuario no existe')
        return res.status(404).json({ error: error.message })
      }

      if (!user.confirmed) {
        const token = new Token()
        token.user = user.id
        token.token = generateToken()
        await token.save()

        // enviar el email de confirmacion de cuenta.. otravez
        AuthEmail.sendConfirmaionEmail({
          email: user.email,
          name: user.name,
          token: token.token
        })


        const error = new Error('cuenta no confirmada, te mandamos otro maldito email con el codgio. revisalo HDTPM')
        return res.status(401).json({ error: error.message })
      }

      /// revisar password
      const isPasswordCorrect = await checkPassword(password, user.password)
      if (!isPasswordCorrect) {
        const error = new Error('password incorrecto')
        return res.status(401).json({ error: error.message })
      }

      res.send('Autenticado..')

    } catch (error) {
      res.status(500).json({ error: 'valio verdolaga..!!' })
    }
  }

  // resend Code .. vuelve a enviar el token manualmente
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      // revisamos si el usuario existe
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('Usuario no Registrado')
        return res.status(404).json({ error: error.message })
      }

      // si el usuario ya confirmo su cuenta.. entonce lo mandamos a vrga
      if (user.confirmed) {
        const error = new Error('Tu Ya Confirmaste Tu cuenta Pendejo..!!')
        return res.status(404).json({ error: error.message })
      }

      // generar el token hijo de puta
      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      // enviar el email de confirmacion de cuenta
      AuthEmail.sendConfirmaionEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })


      /* await user.save()
      await token.save() */

      await Promise.allSettled([user.save(), token.save()])

      res.send('ahi te mandams otro token.. hdtpm')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un Maldtio error' })
    }
  }

  // forgot password
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      // revisamos si el usuario existe
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('Usuario no Registrado')
        return res.status(404).json({ error: error.message })
      }

      // generar el token hijo de puta
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      await token.save()

      // enviar el email de confirmacion de cuenta
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token
      })

      res.send('Revisa tu email.. ')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un Maldtio error' })
    }
  }

  // validando el token otra vex
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({ token })
      if (!tokenExist) {
        const error = new Error('token no valido')
        return res.status(404).json({ error: error.message })
      }

      /* esta es la respuesta que manada el backen y se muestra atravez del toast */
      res.send('Ingresa un Nuevo Password')

    } catch (error) {
      res.status(500).json({ error: 'valio vrga..!!' })
    }

  }
}