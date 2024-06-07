import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
  body('name').notEmpty().withMessage('Nombre Obligatorio'),
  body('password').isLength({ min: 8 }).withMessage('Minimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los Malditos Password no son iguales')
    }
    return true
  }),
  body('email').isEmail().withMessage('eMail no valido'),
  handleInputErrors,
  AuthController.createAccount
)

router.post('/confirm-account',
  body('token')
    .notEmpty().withMessage('Token no puede estar vacio'),
  handleInputErrors,
  AuthController.confirmAccount
)





export default router