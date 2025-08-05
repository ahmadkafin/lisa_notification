const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const path = require('path')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');


module.exports = (app) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: "DIGIO MOBILE BACKEND",
                version: "1.0.0",
                description: "Backend for DIGIO MOBILE",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                }
            },
            servers: [
                {
                    url: "https://gis.pgn.co.id/digiomobile/api/v1/",
                    description: "Production Server"
                },
                {
                    url: "http://localhost:8080/api/v1/",
                    description: "Development Server"
                }
            ],
            components: {
                securitySchemas: {
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
            ],
        },
        apis: [
            path.join(__dirname, "../../app/routes/", "*.routes.js"),
        ]
    }
    // const specs = swaggerJsDocs(options);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}