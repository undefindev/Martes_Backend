import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

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

// oactualizar un registro.. lo ms dificil.. segun
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

export default router