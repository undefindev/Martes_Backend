import type { Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  let errors = validationResult(req) // aqui es donde aparecen los errores
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }) // lo retornamos como .json y lo convertimos a un array
  }
  next() // nos pasamos al siguiente middleware
}


// esta funcion es para detener la ejecucion en caso de que falle la validacion. que no entre al controlador y que muestre los resutados.. la pusimos en un middleware para que sea reutilizable.