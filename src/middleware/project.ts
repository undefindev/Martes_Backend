import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

// aqui tenemos que hacer una tranza.. rescribir el 'Request' de la 'interface' de typescript pasarla a estado globla
declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

// creamos la funcion para validar que el maldito projecto exista
export async function projectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // este codigo revisa si un projecto existe o no
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error("No se Encontro el Projecto");
      return res.status(404).json({ error: error.message });
    }
    req.project = project; // este se pasa al controlador
    next(); // si todo salio bien.. seguimos
    /* console.log(project) */
  } catch (error) {
    res.status(500).json({ error: "valio vrga..!!" });
  }
}

/* este codigo nada mas revisa si el projecto existe, toma el 'projectId' desde la 'url' revisa si existe, si no existe manda la respuesta de error pero si existe se va al siguiente 'middleware' y lo vamos a usar en el projectRoutes antes del controlador */
