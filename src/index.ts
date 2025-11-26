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
      title: 'API AgendaMetrics',
      version: '1.0.0',
      description: 'Una API para gestionar usuarios y sus rutinas diarias.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID autogenerado del usuario.',
              example: '69262057b9a4e5b26f375465'
            },
            username: {
              type: 'string',
              example: 'JuanPerez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com'
            },
            joinDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de registro del usuario.'
            }
          }
        },
        Routine: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID autogenerado de la rutina.',
            },
            user: {
              type: 'string',
              description: 'ID del usuario propietario.'
            },
            name: {
              type: 'string',
              example: 'Correr por la mañana'
            },
            category: {
              type: 'string',
              enum: ['trabajo', 'estudio', 'sueño', 'ejercicio', 'otro'],
              example: 'ejercicio'
            },
            frequency: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['diaria', 'semanal', 'mensual', 'dias_especificos'],
                },
                days: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [1, 3, 5]
                }
              }
            },
            estimatedDuration: {
              type: 'number',
              description: 'Duración en minutos',
              example: 45
            },
            suggestedTime: {
              type: 'string',
              example: '07:00'
            },
            notifications: {
              type: 'boolean',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
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



