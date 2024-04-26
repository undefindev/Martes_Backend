import type { Request, Response } from 'express'
import { param } from 'express-validator';
import Project from '../models/Project';
import Task from '../models/Task';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {

    const { projectId } = req.params
      const project = await Project.findById(projectId)

      // este codigo revisa si un projecto existe o no
      if(!project) {
        const error = new Error('No se Encontro el Projecto')
        return res.status(404).json({error: error.message})
      }
      /* console.log(project) */
    try {
      const task = new Task(req.body) // creamos la instancia y despues
      task.project = project.id // validamos si el projecto existe y le asignamos la tarea
      project.tasks.push(task.id) // con esto le agregamos la tarea al projecto pero nada mas enla memoria
      await task.save() // aqui guardamos la tarea en la DB
      await project.save() // aqui ya lo estamos almacenando en la DB
      res.send('tarea creada')
    } catch (error) {
      console.log(error)
    }
  }
}