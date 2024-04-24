import mongoose, { Schema, Document, Types} from "mongoose";


// este es el type de typeScript
export interface ITask extends Document {
  name: string
  description: string
  project: Types.ObjectId // aqui agregamos el id del projecto 
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
  // una tarea va a tener un projecto
  project: Types.ObjectId,
  ref: 'Project'
  /* aqui lo que le estamos diciendo practicamente es creame el docuemto tiene que ser con el 'objectId y la referencia va ser el modelo 'project' */
}, {timestamps: true})
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task