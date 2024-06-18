import mongoose, { Document, Schema, Types } from "mongoose"

// definimos el type
export interface IToken extends Document {
  token: string
  user: Types.ObjectId
  createdAt: Date
}

const tokeSchema: Schema = new Schema({
  token: {
    type: String,
    requiered: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    default: Date.now(),
    expires: "10m"
  }
})

const Token = mongoose.model<IToken>('Token', tokeSchema)
export default Token