import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user';
import authMiddleware, { AuthenticatedRequest } from '../middlewares/auth';

const userRouter = Router();

userRouter.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de datos de usuarios (requiere autenticación)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: (Admin) Retorna una lista de todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de usuarios.
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Aquí se podría añadir una verificación para asegurar que solo los administradores pueden ver todos los usuarios.
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
});
  
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener.
 *     responses:
 *       200:
 *         description: Datos del usuario.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualiza los datos del usuario autenticado (username, email, contraseña)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Un objeto con los campos a actualizar. Todos son opcionales.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPayload'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos (ej. contraseña corta).
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 *       409:
 *         description: El email ya está en uso por otro usuario.
 */
userRouter.put('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
      const userId = req.user!.id;
      const updatedUser = await userService.updateUser(userId, req.body);
      res.json(updatedUser);
  } catch (error) {
      next(error);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Elimina la cuenta del usuario autenticado y todas sus rutinas
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cuenta de usuario y datos asociados eliminados exitosamente.
 *       401:
 *         description: No autorizado (token no válido o no provisto).
 *       404:
 *         description: Usuario no encontrado (esto sería raro si el token es válido).
 */
userRouter.delete('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
      // Extraer el ID del usuario directamente del token (añadido por el authMiddleware)
      const userId = req.user!.id;

      // Llamar al servicio para que realice el borrado en cascada
      await userService.deleteUser(userId);
      
      res.status(204).send();
  } catch (error) {
      next(error);
  }
});
  
export default userRouter;
