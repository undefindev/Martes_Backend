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
      const task = await Task.findById(req.task.id).populate({ path: 'completedBy', select: 'id name email' }) // aqui quien sabe que vrga hicimos
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "valio mandarina..!!" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();

      // pero si todo salio bien.. entonces ya chingamos
      res.send("Tarea Actualizada"); // aqui ya no es .json a la variable 'task'
    } catch (error) {
      res.status(500).json({ error: "valio mandarina..!!" });
    }
  };

  // deleteTask
  static deleteTask = async (req: Request, res: Response) => {
    try {
      // traete todas las tareas que sean diferentes a
      // ojo aqui.. el segundo task del filter. nada mas es 'tasks' array en el projecto no la tarea en si
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );

      /* await task.deleteOne() // elimina la tarea y.. */
      /* await req.project.save() // luego guarda los cambios */

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send("tarea eliminada");
    } catch (error) {
      res.status(500).json({ error: "algo salio mal" });
    }
  };

  // updateStatus de las tareas
  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body; // revisas el estado
      req.task.status = status;
      if (status === 'pending') {
        req.task.completedBy = null
      } else {
        req.task.completedBy = req.user.id // con este se cual quien la modifico
      }
      await req.task.save();
      res.send("estado actualizado");
    } catch (error) {
      res.status(500).json({ error: "valio vrga..!!" });
    }
  };
}

/* notas */

/* este fue para crear la tarea, asignarla al projecto este codigo quedo un poco mas limpio que el de projectController.. segun, aqui no hay validacion el middleware se encarga de hacer todo el desmadre */

/* siempre que trabajemos en una DB de mongo.. con los ID hay que asegurarnos de convertirlos a '.toString()' porque el 'new object id' siempre da un valor diferente como si fuera un objeto  */

/* await task.deleteOne()
      await req.project.save() */

/* aqui hay dos cosas muy curiosas.. el .findById en lugar del findandupdate o findAndDelete, no estamos usando estos metodos porque tenemos que psara las validaciones primero que todo */

/* hay que tener cuidado con los 'object-Id' cuando lo comparemos con algun operador porquwe los toma como valores diferentes */

/* cuando tengamos dos consultas que no sean dependiente.. optimizemos con 'Promise.allSettled */

/*  esto se fue a la vrga porque creamos los  middleware

const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ error: error.message });
      } */

/* // ahora, si le pasamos datos no validos retorname lo siguiente
      if (req.task.project.toString() !== req.project.id) {
        const error = new Error("no me rrecontra jodas..!!");
        return res.status(400).json({ error: error.message });
      } */
