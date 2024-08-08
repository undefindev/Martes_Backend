import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBeLongToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMeamberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate) // este es para protejer las rutas.. segun..!!

// rutas para los malditos projectos


// para crear un projecto nuevo
router.post("/",
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
router.param("projectId", projectExists);

router.post(
  "/:projectId/tasks", hasAuthorization, // esto para que el maldito no pueda crear tareas en un proyecto que no es de el
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

// routa para listar todas las tareas
router.get("/:projectId/tasks", TaskController.getProjectTasks);

// ruta para una tarea en especifico

// implemenamos los param para el middleware igual que arriba
router.param("taskId", taskExists);
router.param("taskId", taskBeLongToProject);

router.get(
  "/:projectId/:tasks/:taskId",
  param("taskId").isMongoId().withMessage("este ID no es valido"),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.getTaskById
);

// ruta para actualizar una tarea una tarea en especifico

router.put(
  "/:projectId/:tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("este ID no es valido"), // validamos que sea un registro de mongo valido y despues
  // validamos los campos
  body("name").notEmpty().withMessage("el nombre de la TAREA es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("la descricion de la TAREA es obligatorio"),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.updateTask // hacemos referencia la funcion del controlador
);

// ruta para eliminar una tarea en especifico
router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization, // el middleware que revisa si el usuario es manager
  param("taskId").isMongoId().withMessage("este ID no es valido"),
  handleInputErrors, // el middleware uque creamos para los errores
  TaskController.deleteTask
);

// actualizar el status de una tarea
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("este ID no es valido"),
  body("status").notEmpty().withMessage("el estado es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

/* Router for teams */
router.post(
  "/:projectId/team/find",
  body('email').isEmail().toLowerCase().withMessage('email.. no valido'),
  handleInputErrors,
  TeamMeamberController.findMemberByEmail
)

router.get('/:projectId/team',
  TeamMeamberController.getProjectTeam
)

router.post(
  "/:projectId/team",
  body('id')
    .isMongoId().withMessage('ID No valido'),
  handleInputErrors,
  TeamMeamberController.addMemberById

)

router.delete(
  "/:projectId/team/:userId",
  param('userId')
    .isMongoId().withMessage('ID No valido'),
  handleInputErrors,
  TeamMeamberController.removeMemberById
)

/* route for notes */
router.post('/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('la nota no puede estar vacia'),
  handleInputErrors,
  NoteController.createNote
)



export default router;

/* primero teniamos la sigiente sintasis
  router.get('/:projectId/:tasks/:taskId',
  validateProjectExists,
  TaskController.getTaskById
)
.. pero luego implementamos el 'router.param' y le quitamos el 'middleware a las rutas para no estarlo repitiendo en todas las rutas

y tambien validamos las tareas igual que validamos los projectos.. con el mismo metodo. nada mas lo copiamos porque ya es noche
*/
