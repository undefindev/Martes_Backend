import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

// tomamos el env de coneccion antes
dotenv.config()  // para que tome el string de connecion

// nos conectamos a la db antes de que inicie la app
connectDB()

// creamos la instancia de express.. que no se que vrga es una instancia todavia a ciencia cierta por cierto
const app = express()

// una vez que creamos la coneccion.. peromitimos las conecciones
app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

// Leer los datos del formulario

// avilitamos la lectura de los .json
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)






// la exportamos para que este disponible a nivel global
export default app