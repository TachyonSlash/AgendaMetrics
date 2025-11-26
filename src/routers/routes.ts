import { Router } from 'express';
import userRouter from './user';
import routineRouter from './routine';
import authRouter from './auth';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/routines', routineRouter);


console.log('API funcionando')

export default apiRouter;