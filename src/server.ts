import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'

// tomamos el env de coneccion antes
dotenv.config()  // para que tome el string de connecion

// nos conectamos a la db antes de que inicie la app
connectDB()

// creamos la instancia de express
const app = express()






// la exportamos para que este disponible a nivel global
export default app