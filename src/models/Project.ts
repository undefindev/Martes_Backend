import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";


// este es el type de typeScript
export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask & Document>[] // esto lo hicimos porque typeScript interpreta los subdocumentos de mongo como arreglos..
  manager: PopulatedDoc<IUser & Document>
  team: PopulatedDoc<IUser & Document>[]
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
  // pero un projecto va a tener multiples tareas.. esta es la referencia
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    }
  ],
  manager: {
    type: Types.ObjectId,
    ref: 'User'
  },
  team: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ],
}, { timestamps: true })

// Middelware .. ojo tiene que ser antes del modelo, si no no funciona, es para eliminar el projecto, tareas y notas
ProjectSchema.pre('deleteOne', { document: true }, async function () {
  const projecId = this._id // aqui recuperamos el 'projectId'
  if (!projecId) return

  // aqui nos traemos todas as tareas relacionadas al projecto
  const tasks = await Task.find({ project: projecId })
  for (const task of tasks) {
    await Note.deleteMany({ task: task.id })
  } // con esta mamada estamos eliminando las notas porque no se eliminaban al eliminar el projecto, se quedaba en la DB.. que horror

  await Task.deleteMany({ project: projecId })
})

// aqui definimos el modelo y se registra en la instancia de mongoos
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project