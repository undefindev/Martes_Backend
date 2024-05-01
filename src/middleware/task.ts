import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

// aqui tenemos que hacer una tranza.. rescribir el 'Request' de la 'interface' de typescript pasarla a estado globla
declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

// creamos la funcion para validar que el maldito projecto exista
export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // este codigo revisa si un projecto existe o no
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("No se Encontro la tarea");
      return res.status(404).json({ error: error.message });
    }
    req.task = task; // este se pasa al controlador
    next(); // si todo salio bien.. seguimos
    /* console.log(project) */
  } catch (error) {
    res.status(500).json({ error: "valio vrga..!!" });
  }
}

/* este codigo nada mas revisa si el projecto existe, toma el 'projectId' desde la 'url' revisa si existe, si no existe manda la respuesta de error pero si existe se va al siguiente 'middleware' y lo vamos a usar en el projectRoutes antes del controlador */
