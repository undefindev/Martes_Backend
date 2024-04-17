import type { Request, Response } from "express"
import Project from "../models/Project"

// el nombre de estos archivos de controladores empiezan con mayusculas porque practicamente son 'clases'. y se recomienda usar la sintasis de clases para nombrarlos
export class ProjectController {
  // estos metodos son staticos porque no requiren ser instanciados
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body)
    try {
      await project.save()
      res.send('el projecto se creeo correctamente')
    } catch (error) {
      console.log(error)
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {
    res.send('todos los projectos')
  }
}