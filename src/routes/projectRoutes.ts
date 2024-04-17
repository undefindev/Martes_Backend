import { Router } from "express";
import { body } from "express-validator";
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

export default router