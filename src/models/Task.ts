import mongoose, { Schema, Document, Types } from "mongoose";

// creamos el stado para las tareas.. creamos un diccionario
const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed'
} as const // esto comvierte el objeto en 'readonly'

// creamos el type para que nada mas acepte los valores
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]


// este es el type de typeScript
export interface ITask extends Document {
  name: string
  description: string
  project: Types.ObjectId // aqui agregamos el id del projecto
  status: TaskStatus
  completedBy: {
    user: Types.ObjectId,
    status: TaskStatus
  }[] // le ponemos la sintaxis de array para que no se confunda
}

// creamos el schema de mongo
// creamos la funcion, luego creamos la variable de coneccion y despues la exportamos
export const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // una tarea va a tener un projecto.. esta es la referencia
  project: {
    type: Types.ObjectId,
    ref: 'Project'
  },
  status: {
    type: String,
    enum: Object.values(taskStatus), // esto porque no podemos pasarle el type directamente
    default: taskStatus.PENDING // este sera el valor que tenga por defecto cada tarea nueva.. hasta que se le asigne un chango que se ponga a trabajar en ella
  },
  completedBy: [
    {
      user: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
      },
      status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
      }
    }
  ]
}, { timestamps: true })

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task