import type { Request, Response } from "express";
import User from "../models/User";

export class TeamMeamberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body

    /* find user */
    const user = await User.findOne({ email }).select(' id email name')
    if (!user) {
      const error = new Error('usuario no encontrado')
      return res.status(404).json({ error: error.message })
    }

    res.json(user)
  }

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body

    /* find user */
    const user = await User.findById(id).select(' id ')
    if (!user) {
      const error = new Error('usuario no encontrado')
      return res.status(404).json({ error: error.message })
    }

    // revisamos si ya esta agregado en el equipo
    if (req.project.team.some(team => team.toString() === user.id.toString())) {
      const error = new Error('el usuario ya esta en el equipo')
      return res.status(409).json({ error: error.message })
    }

    // agregando al usuario
    req.project.team.push(user.id)
    await req.project.save()

    res.json('Colaborador agregado Correctamente')


  }
}