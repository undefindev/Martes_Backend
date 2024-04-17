import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'

// tomamos el env de coneccion antes
dotenv.config()  // para que tome el string de connecion

// nos conectamos a la db antes de que inicie la app
connectDB()

// creamos la instancia de express.. que no se que vrga es una instancia todavia a ciencia cierta por cierto
const app = express()

// avilitamos la lectura de los .json
app.use(express.json())

// Routes
app.use('/api/projects', projectRoutes)






// la exportamos para que este disponible a nivel global
export default app