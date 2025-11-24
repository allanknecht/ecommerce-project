module.exports = {
    port: process.env.PORT || 5732,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'abacate',
    apiVersion: process.env.API_VERSION || 'v1',
    
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    }
};
