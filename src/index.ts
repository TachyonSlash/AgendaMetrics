import 'dotenv/config';
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import apiRouter from './routers/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API de Usuarios',
      version: '1.0.0',
      description: 'Una API simple para gestionar usuarios, documentada con Swagger.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'El ID auto-generado del usuario.',
            },
            username: {
              type: 'string',
              description: 'El nombre de usuario.',
            },
            email: {
              type: 'string',
              description: 'El email del usuario.',
            },
            joinDate: {
              type: 'string',
              format: 'date-time',
              description: 'La fecha de registro del usuario.',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined')
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err))

app.get('/', (req, res) => {
  res.send(`API funcionando`);
});

app.use('/api', apiRouter);

app.use(errorHandler)

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});



