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

  // este es para jalar todos los projectos.. usamos un '.find'
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } }, // con esta mamada nos traemos nada mas los projectos que corresponden al usuario
          { team: { $in: req.user.id } } // con esto verificamos que el colaborador este en el projecto y pueda ver los projectos en los que esta agregado
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
      if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
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
    try {
      req.project.clientName = req.body.clientName;
      req.project.projectName = req.body.projectName;
      req.project.description = req.body.description;

      await req.project.save();
      res.send("projecto Actualizado");
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };

  // actualizar un maldito registro'
  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.send("projecto eliminado");
    } catch (error) {
      console.log(error); // esto para que nos muestre el error si algo salio mal
    }
  };
}
