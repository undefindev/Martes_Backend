import type { Request, Response } from "express";
import User from "../models/User";
import { body, param } from 'express-validator';
import Project from "../models/Project";

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

  // listando los miembros del equipo
  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: 'team',
      select: 'id email name'
    })
    res.json(project.team)
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
    const { userId } = req.params

    // revisamos que ya no este  en el equipo primero que nada
    if (!req.project.team.some(team => team.toString() === userId)) {
      const error = new Error('el miembro ya te lo sacaron') // cuando ya esta eliminado
      return res.status(409).json({ error: error.message })
    }
    req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
    await req.project.save()

    res.json('Chingo a su Madre') // cuando lo eliminamos
  }

}