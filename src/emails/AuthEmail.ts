import { transporter } from "../config/nodemailer"

interface IEmail {
  email: string
  name: string
  token: string
}

export class AuthEmail {
  static sendConfirmaionEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: 'martes <admin@martes.net>',
      to: user.email,
      subject: 'martes - Confirma tu Cuenta',
      text: 'martes.net - Confirma tu Maldita Cuenta.. por favor..!!',
      html: ` <p>Hola: ${user.name}, has creado tu cuenta. 'ya casi estas dentro'..</p>
              <p>Visita el Siguiente enlace:</p>
              <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar</a>
              <p>Ingresa el codigo: <b>${user.token}</b>... y dejate de mamadas</p>
              <p>Token expira en 10 min</p>`
    })

    console.log('mensaje enviado', info.messageId)
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: 'martes <admin@martes.net>',
      to: user.email,
      subject: 'martes - Restablecer Password',
      text: 'martes.net - Restablece Tu Password..!!',
      html: ` <p>Hola: ${user.name}, olvidase tu contraseña.. 'no te preocupes.. ya sabes que aqui tienes a tu pendejo..!!'..</p>
              <p>Visita el Siguiente enlace:</p>
              <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer</a>
              <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
              <p>Token expira en 15 min</p>`
    })

    console.log('mensaje enviado', info.messageId)
  }
}