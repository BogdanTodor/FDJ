import swaggerjsdoc from 'swagger-jsdoc';
import { schemas } from './swagger.schemas.';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tasks API',
            description: 'Documentation for the Tasks API endpoints. ',
            version: '1.0.0',
        },
        servers: [
            {
                // Future TODO: don't hardcode port number but create helper function that accepts port from server.ts
                // and configure url dynamically.
                url: 'http://localhost:3000',
            }
        ],
        components: {
            schemas,
        }
    },
    apis: ['./src/routes/*.ts']
  };
  
 export const swaggerDocs = swaggerjsdoc(swaggerOptions);
 