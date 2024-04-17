import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router()

// para crear un projecto nuevo
router.post('/', ProjectController.createProject )

// para jalar todos los projectos
router.get('/', ProjectController.getAllProjects)

export default router