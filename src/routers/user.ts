import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user';

const userRouter = Router();


// GET /api/users
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna una lista de todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Una lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/users
  /**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Mínimo 6 caracteres.
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de entrada inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
  userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // El router solo extrae los datos y se los pasa al servicio
      const savedUser = await userService.createUser(req.body);
      res.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  });
  
  export default userRouter;

