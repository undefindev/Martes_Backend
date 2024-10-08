import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { checkPassword } from '../utils/auth';

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


// confirmar una cuenta
router.post('/confirm-account',
  body('token')
    .notEmpty().withMessage('Token no puede estar vacio'),
  handleInputErrors,
  AuthController.confirmAccount
)

// login
router.post('/login',
  body('email').isEmail().withMessage('eMail no valido'),
  body('password').notEmpty().withMessage('se requiere el password'),
  handleInputErrors,
  AuthController.login
)

// resend code
router.post('/forgot-password',
  body('email').isEmail().withMessage('eMail no valido'),
  handleInputErrors,
  AuthController.forgotPassword
)

/* validando el token de forgot password */
router.post('/validate-token',
  body('token')
    .notEmpty().withMessage('Token no puede estar vacio'),
  handleInputErrors,
  AuthController.validateToken
)

/* validando el token de forgot password */
router.post('/update-password/:token',
  param('token').isNumeric().withMessage('token no valido'),
  body('password').isLength({ min: 8 }).withMessage('Minimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los Malditos Password no son iguales')
    }
    return true
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
)

/* redireccionar al usuario despues de hacer login */
router.get('/user',
  authenticate,
  AuthController.user
)

/* Profile */
router.put('/profile',
  authenticate,
  body('name').notEmpty().withMessage('Se requiere el Nombre'),
  body('email').isEmail().withMessage('Email no Valido'),
  handleInputErrors,
  AuthController.updateProfile
)

// primero revisamos que el password actual sea el correcot y luego le pasamos el nuevo password
router.post('/update-password',
  authenticate,
  body('current_password').notEmpty().withMessage('Se requiere el password actual'),
  body('password').isLength({ min: 8 }).withMessage('Minimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los Malditos password no son iguales')
    }
    return true
  }),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
)

router.post('/check-password',
  authenticate,
  body('password').notEmpty().withMessage('El password no puede ir vacio'),
  handleInputErrors,
  AuthController.checkPassword

)




export default router