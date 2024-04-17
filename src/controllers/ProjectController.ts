import type { Request, Response } from "express"

// el nombre de estos archivos de controladores empiezan con mayusculas porque practicamente son 'clases'. y se recomienda usar la sintasis de clases para nombrarlos
export class ProjectController {
  // estos metodos son staticos porque no requiren ser instanciados
  static getAllProjects = async (req: Request, res: Response) => {
    res.send('todos los projectos')
  }
}