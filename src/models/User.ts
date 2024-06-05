import mongoose, { Document, Schema } from "mongoose"

// definimos el type
export interface IUser extends Document {
  email: string
  password: string
  name: string
  confirmed: boolean
}

// ahora definimos el schema
const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
})

// definimos el modelo
const User = mongoose.model<IUser>('User', userSchema)

// y finalmente lo exportamos
export default User