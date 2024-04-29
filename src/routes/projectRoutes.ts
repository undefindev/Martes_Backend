import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

const router = Router()

// para crear un projecto nuevo
router.post('/',
body('projectName')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
body('clientName')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
body('description')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
  handleInputErrors,
ProjectController.createProject
)

// para jalar todos los projectos
router.get('/', ProjectController.getAllProjects)

// obtener un projecto por su id unico de MongoDB
router.get('/:id',
  param('id').isMongoId().withMessage('este ID no es valido'),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.getProjectById
)

// oactualizar un registro.. lo mas dificil
router.put('/:id',
  param('id').isMongoId().withMessage('este ID no es valido'), // validamos el 'id' y despues validamos los datos
  body('projectName')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
body('clientName')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
body('description')
  .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.updateProject
)

// la mas facil 'delete'
router.delete('/:id',
  param('id').isMongoId().withMessage('este ID no es valido'),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.deleteProject
)

/* podriamos crear un nuevo archivo de rutas para las tareas.. pero como las tareas dependen de los proyectos lo vamos a crear aqui mismo */

/** Route para las tareas */
router.post('/:projectId/tasks',
  validateProjectExists, // si existe el projecto se pasa al controlador
  body('name')
    .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
body('description')
    .notEmpty().withMessage('todos los malditos campos son obligatorios vrga..!'),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.createTask
)

router.get('/:projectId/tasks',
  validateProjectExists, // el middleware que tenemos para validar si existe
  TaskController.getProjectTasks
)

router.get('/:projectId/:tasks/:taskId',
  validateProjectExists,
  TaskController.getTaskById
)

export default router