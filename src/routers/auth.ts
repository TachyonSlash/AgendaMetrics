import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario con email y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterPayload'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de entrada inválidos (ej. contraseña corta).
 *       409:
 *         description: El correo electrónico ya está en uso.
 */
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const savedUser = await authService.registerUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión con email y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPayload'
 *     responses:
 *       200:
 *         description: Login exitoso. Retorna un token JWT y los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas.
 */
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { token, user } = await authService.loginUser(req.body);
      res.json({ token, user });
  } catch (error) {
      next(error);
  }
});

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Inicia sesión o registra a un usuario usando un ID Token de Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: El ID Token proporcionado por el SDK de Google en el cliente.
 *     responses:
 *       200:
 *         description: Login o registro exitoso. Retorna un token JWT propio de la API.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Token de Google inválido o incompleto.
 */
authRouter.post('/google', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token: idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: 'El token de Google es requerido.' });
        }

        const { token, user } = await authService.loginWithGoogle(idToken);
        res.json({ token, user });
    } catch (error) {
        next(error);
    }
});

export default authRouter;
