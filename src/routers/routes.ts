import { Router } from 'express';
import userRouter from './user';
import routineRouter from './routine';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/routines', routineRouter);


console.log('API funcionando')

export default apiRouter;