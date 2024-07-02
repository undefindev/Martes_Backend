import type { Request, Response } from "express";
import Project from "../models/Project";

// el nombre de estos archivos de controladores empiezan con mayusculas porque practicamente son 'clases'. y se recomienda usar la sintasis de clases para nombrarlos
export class ProjectController {
  // estos metodos son staticos porque no requiren ser instanciados
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body); // creamos el projecto

    // y le asignamos la persona que lo creo para que nadie lo borre
    project.manager = req.user.id

    try {
      await project.save(); // luego lo guardamos
      res.send('Projecto Creado'); // si todo bien nos muestra este mensaje
    } catch (error) {
      // y si no chinga tumadre
      console.log(error);
    }
  };

  // este es para jalar todos los projectos.. usamos un 'find'
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } } // con esta mamada nos traemos nada mas los projectos que corresponden al usuario
        ]
      }); // metodo 'find'
      res.json(projects);
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };

  // este es para jalar traernos un projecto po su 'id;'
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks"); // medoto "findById"

      // este codigo revisa si un projecto existe o no
      if (!project) {
        const error = new Error("No se Encontro el Projecto");
        return res.status(404).json({ error: error.message });
      }

      // este codigo nos sirve para los otros.. deberiamos de hacer un middleware para no estar repitiendo codigo
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("accion no valida");
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };

  // actualizar un maldito registro'
  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id); // esta vez toma dos parametros"

      if (!project) {
        // este no se porque no esa jalando.. entra primero el otro console
        const error = new Error("No se Encontro el Projecto");
        return res.status(404).json({ error: error.message });
      }

      // revisamos q si sea el manager o creador o que tenga las credenciales
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("no tienes credenciales correctas");
        return res.status(404).json({ error: error.message });
      }

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.send("projecto Actualizado");
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };

  // actualizar un maldito registro'
  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      /* const project = await Project.findByIdAndDelete(id)
        res.send('projecto Eliminado') .. este se utiliza en caso de eliminacion normal.. pero nosotros ocupamos privilegios para eliminar una tarea */
      const project = await Project.findById(id);

      if (!project) {
        // este no se porque no esa jalando.. entra primero el otro console
        const error = new Error("No se Encontro el Projecto");
        return res.status(404).json({ error: error.message });
      }

      // revisamos q si sea el manager o creador o que tenga las credenciales
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("no tienes credenciales correctas");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.send("projecto eliminado");
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };
}
