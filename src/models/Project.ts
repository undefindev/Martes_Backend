import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";


// este es el type de typeScript
export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask & Document>[] // esto lo hicimos porque typeScript interpreta los subdocumentos de mongo como arreglos.. y es un pedo
}

// y este el schema
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true, // tenemos validacion con express validator pero esto es para la DB
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // pero un projecto va a tener multiples tareas
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    }
  ]
}, {timestamps: true})

// aqui definimos el modelo y se registra en la instancia de mongoos
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project