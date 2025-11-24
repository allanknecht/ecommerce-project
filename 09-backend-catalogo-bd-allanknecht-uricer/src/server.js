const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const produtosRoutes = require('./routes/produtos.routes');

const app = express();

app.use(cors(config.cors));
app.use(express.json());

const path = require('path');
const fs = require('fs');

let swaggerSpec;
try {
    const possiblePaths = [
        path.join(__dirname, '../openapi.json'),
        path.join(process.cwd(), 'openapi.json'),
        path.join(__dirname, '../../openapi.json'),
    ];
    
    let openApiPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            openApiPath = possiblePath;
            break;
        }
    }
    
    if (!openApiPath) {
        throw new Error('openapi.json não encontrado');
    }
    
    const fileContent = fs.readFileSync(openApiPath, 'utf8');
    swaggerSpec = JSON.parse(fileContent);
    swaggerSpec.servers = [
        {
            url: `http://localhost:${config.port}`,
            description: 'Servidor de desenvolvimento',
        },
    ];
} catch (error) {
    console.warn('Erro ao carregar openapi.json, usando swagger-jsdoc como fallback:', error.message);
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API de Catálogo',
                version: config.apiVersion,
                description: 'API para gerenciamento de catálogo de produtos',
            },
            servers: [
                {
                    url: `http://localhost:${config.port}/api/${config.apiVersion}`,
                    description: 'Servidor de desenvolvimento',
                },
            ],
        },
        apis: ['./src/routes/*.js', './src/controllers/*.js'],
    };
    swaggerSpec = swaggerJsdoc(swaggerOptions);
}

app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/produtos`, produtosRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Catálogo funcionando!',
        version: config.apiVersion,
        environment: config.nodeEnv,
        docs: '/api-docs'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

app.listen(config.port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${config.port} (${config.nodeEnv} mode)`);
    console.log(`📡 Listening on http://0.0.0.0:${config.port}`);
});
