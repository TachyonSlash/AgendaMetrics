import { Router, Request, Response, NextFunction } from 'express';
import { routineService } from '../services/routine';
import { Types } from 'mongoose';


// Se extiende la interfaz Request de Express para incluir los datos del usuario
// que se añadirían en un middleware de autenticación.
interface AuthenticatedRequest extends Request {
    user?: {
        id: string | Types.ObjectId;
    };

}

const routineRouter = Router();


// Get de todas las rutinas de un usuario
/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Retorna todas las rutinas del usuario autenticado
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de las rutinas del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Routine'
 *       401:
 *         description: No autorizado (token no provisto o inválido).
 */
routineRouter.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Autenticación requerida.' })
        }
        const routines = await routineService.getAllUserRoutines(req.user.id);
        res.json(routines)

    } catch(error) {
        next(error);
    }
});

// Get de todas las rutinas
/**
 * @swagger
 * /api/routines/all:
 *   get:
 *     summary: (Admin) Retorna todas las rutinas de todos los usuarios
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de todas las rutinas en el sistema.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Routine'
 *       403:
 *         description: Acceso denegado (el usuario no es administrador).
 */
routineRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allRoutines = await routineService.getAllRoutines();
        res.json(allRoutines);
    } catch(error) {
        next(error);
    }

});

// Get de una rutina especifica de un usuario
/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Retorna una rutina específica por su ID
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la rutina
 *     responses:
 *       200:
 *         description: Los detalles de la rutina.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rutina no encontrada o no pertenece al usuario.
 */
routineRouter.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Si el ID no coincide con el usuario
        if(!req.user) {
            return res.status(401).json({ message: 'Autenticación requerida.' })
        }
        const { id } = req.params;
        const routine = await routineService.getRoutineById(id, req.user.id)
        // Si no encuentra la rutina
        if(!routine){
            return res.status(404).json({ message: 'Rutina no encontrada.' })
        }
        res.json(routine)

    } catch(error){
        next(error)
    }

});

/**
 * @swagger
 * /api/routines:
 *   post:
 *     summary: Crea una nueva rutina
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoutineInput'
 *     responses:
 *       201:
 *         description: Rutina creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 */
routineRouter.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: 'Autenticación requerida.' })
        }
        const savedRoutine = await routineService.createRoutine(req.body, req.user.id);
        res.status(201).json(savedRoutine);
    } catch(error){
        next(error)
    }
});

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Actualiza una rutina existente
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la rutina a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoutineInput'
 *     responses:
 *       200:
 *         description: Rutina actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rutina no encontrada o no pertenece al usuario.
 */
routineRouter.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: 'Autenticación requerida.' })
        }
        const { id } = req.params;
        const updatedRoutine = await routineService.updateRoutine(id, req.body, req.user.id);
        res.json(updatedRoutine);
    } catch(error){
        next(error)
    }
});

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Elimina una rutina
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la rutina a eliminar
 *     responses:
 *       204:
 *         description: Rutina eliminada exitosamente (Sin contenido).
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rutina no encontrada o no pertenece al usuario.
 */
routineRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: 'Autenticación requerida.' })
        }
        const { id } = req.params;
        await routineService.deleteRoutine(id, req.user.id);
        res.status(204).send();
    } catch(error) {
        next(error)
    }
});

export default routineRouter;