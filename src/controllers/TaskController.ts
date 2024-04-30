import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  // crear una tarea
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body); // creamos la instancia y despues
      task.project = req.project.id; // validamos si el projecto existe y le asignamos la tarea
      req.project.tasks.push(task.id); // con esto le agregamos la tarea al projecto pero nada mas enla memoria
      /* await task.save() */ // aqui guardamos la tarea en la DB
      /* await req.project.save() */ // aqui ya lo estamos almacenando en la DB
      await Promise.allSettled([task.save(), req.project.save()]); // aqui estamos optimisando el codigo con 'Promise.allSettled'
      res.send("tarea creada");
    } catch (error) {
      res.status(500).json({ error: "valio vrga..!!" });
    }
  };

  // traernos todas las tareas
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "valio vrga..!!" });
    }
  };

  // traernos una tarea por su ID
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ error: error.message });
      }

      // veamos que nos muestra la consolita magica
      /* console.log(task.project.toString())
      console.log(req.project.id) */

      // si la tarea no corresponde al projecto
      if (task.project.toString() !== req.project.id) {
        const error = new Error("Accion no valida");
        return res.status(400).json({ error: error.message });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "valio mandarina..!!" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findByIdAndUpdate(taskId, req.body);
      // ahora validamos
      if (!task) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ error: error.message });
      }

      // ahora, si le pasamos datos no validos retorname lo siguiente
      if (task.project.toString() !== req.project.id) {
        const error = new Error("no me rrecontra jodas..!!");
        return res.status(400).json({ error: error.message });
      }

      // pero si todo salio bien.. entonces ya chingamos
      res.send("Tarea Actualizada"); // aqui ya no es .json a la variable 'task'
    } catch (error) {
      res.status(500).json({ error: "valio mandarina..!!" });
    }
  };
}

/* este fue para crear la tarea, asignarla al projecto este codigo quedo un poco mas limpio que el de projectController.. segun, aqui no hay validacion el middleware se encarga de hacer todo el desmadre */

/* siempre que trabajemos en una DB de mongo.. con los ID hay que asegurarnos de convertirlos a '.toString()' porque el 'new object id' siempre da un valor diferente como si fuera un objeto  */
