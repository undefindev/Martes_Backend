import type { Request, Response } from "express"
import Project from "../models/Project"

// el nombre de estos archivos de controladores empiezan con mayusculas porque practicamente son 'clases'. y se recomienda usar la sintasis de clases para nombrarlos
export class ProjectController {
  // estos metodos son staticos porque no requiren ser instanciados
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body) // creamos el projecto
    try {
      await project.save() // luego lo guardamos
      res.send('el projecto se creeo correctamente') // si todo bien nos muestra este mensaje
    } catch (error) { // y si no chinga tumadre
      console.log(error)
    }
  }

  // este es para jalar todos los projectos.. usamos un 'find'
  static getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({})
        res.json(projects)
    } catch (error) {
      console.log(error) // esto para que nos muestre el error si algo salio mal
    }
  }
}