import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Se extiende la interfaz de Request para incluir la propiedad 'user'
export interface AuthenticatedRequest extends Request {
  user?: { id: string; username: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
    req.user = decoded; // Se añaden los datos del usuario a la petición
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export default authMiddleware;
