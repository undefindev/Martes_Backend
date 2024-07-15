import type { Request, Response } from "express";
import User from "../models/User";
import { body } from 'express-validator';

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
      const error = new Error('el miembro ya lo tienes adentro')
      return res.status(409).json({ error: error.message })
    }

    // agregando al usuario
    req.project.team.push(user.id)
    await req.project.save()

    res.json('Colaborador agregado Correctamente')
  }


  // sacar al usuario del grupo
  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body

    // revisamos que ya no este  en el equipo primero que nada
    if (!req.project.team.some(team => team.toString() === id)) {
      const error = new Error('el miembro ya te lo sacaron')
      return res.status(409).json({ error: error.message })
    }
    req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id)
    await req.project.save()

    res.json('Chingo a su Madre')
  }

}