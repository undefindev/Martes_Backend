import type { Request, Response } from 'express'
import Task from '../models/Task';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body) // creamos la instancia y despues
      task.project = req.project.id // validamos si el projecto existe y le asignamos la tarea
      req.project.tasks.push(task.id) // con esto le agregamos la tarea al projecto pero nada mas enla memoria
      /* await task.save() */ // aqui guardamos la tarea en la DB
      /* await req.project.save() */ // aqui ya lo estamos almacenando en la DB
      await Promise.allSettled([task.save(), req.project.save()]) // aqui estamos optimisando el codigo con 'Promise.allSettled'
      res.send('tarea creada')
    } catch (error) {
      res.status(500).json({error: 'valio vrga..!!'})
    }
  }

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({project: req.project.id}).populate('project')
      res.json(tasks)
    } catch (error) {
      res.status(500).json({error: 'valio vrga..!!'})
    }
  }
}

/* este fue para crear la tarea, asignarla al projecto este codigo quedo un poco mas limpio que el de projectController.. segun, aqui no hay validacion el middleware se encarga de hacer todo el desmadre */