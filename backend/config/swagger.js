const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'CrowdHelp API Documentation',
            version: '1.0.0',
            description: 'API documentation for CrowdHelp - A Crowdfunding Platform for NGOs',
            contact: {
                name: 'CrowdHelp Support',
                email: 'support@crowdhelp.com'
            },
            servers: [
                {
                    url: 'http://localhost:5000',
                    description: 'Development Server'
                }
            ]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    // Path to the API docs
    apis: ['./routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
