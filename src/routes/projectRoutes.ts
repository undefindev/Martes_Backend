import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

const router = Router();

// rutas para los malditos projectos
// para crear un projecto nuevo
router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  body("clientName")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  body("description")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  handleInputErrors,
  ProjectController.createProject
);

// para jalar todos los projectos
router.get("/", ProjectController.getAllProjects);

// obtener un projecto por su id unico de MongoDB
router.get(
  "/:id",
  param("id").isMongoId().withMessage("este ID no es valido"),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.getProjectById
);

// oactualizar un registro.. lo mas dificil
router.put(
  "/:id",
  param("id").isMongoId().withMessage("este ID no es valido"), // validamos el 'id' y despues validamos los datos
  body("projectName")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  body("clientName")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  body("description")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.updateProject
);

// la mas facil 'delete'
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("este ID no es valido"),
  handleInputErrors, // el middleware uque creamos para los errores
  ProjectController.deleteProject
);

/* podriamos crear un nuevo archivo de rutas para las tareas.. pero como las tareas dependen de los proyectos lo vamos a crear aqui mismo */

/** Route para las tareas */

// implementamos un 'param' para no repetir el middleware de validacion en cada ruta
router.param("projectId", validateProjectExists);

router.post(
  "/:projectId/tasks",
  /* validateProjectExists, */ // si existe el projecto se pasa al controlador
  body("name")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  body("description")
    .notEmpty()
    .withMessage("todos los malditos campos son obligatorios vrga..!"),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.get(
  "/:projectId/:tasks/:taskId",
  param("taskId").isMongoId().withMessage("este ID no es valido"),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.getTaskById
);

export default router;

/* primero teniamos la sigiente sintasis
  router.get('/:projectId/:tasks/:taskId',
  validateProjectExists,
  TaskController.getTaskById
)
.. pero luego implementamos el 'router.param' y le quitamos el 'middleware a las rutas para no estarlo repitiendo en todas las rutas

y tambien validamos las tareas igual que validamos los projectos.. con el mismo metodo. nada mas lo copiamos porque ya es noche
*/
