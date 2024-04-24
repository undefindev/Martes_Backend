import mongoose, { Schema, Document} from "mongoose";


// este es el type de typeScript
export interface ITask extends Document {
  name: string
  description: string
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
})
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task