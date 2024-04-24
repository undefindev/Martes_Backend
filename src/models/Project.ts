import mongoose, { Schema, Document} from "mongoose";


// este es el type de typeScript
export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
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
  }
})

// aqui definimos el modelo y se registra en la instancia de mongoos
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project