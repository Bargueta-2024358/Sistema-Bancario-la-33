'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './db.js';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import swaggerSpec from '../swagger.js';
import accountTypeRoutes from '../src/accountTypes/accountType.routes.js';
import currencyRoutes from '../src/currencies/currency.routes.js';
import exchangeRateRoutes from '../src/exchangeRates/exchangeRate.routes.js';
import productRoutes from '../src/products/product.routes.js';

const BASE_PATH = '/BancoLa33/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
};

const routes = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(`${BASE_PATH}/accountTypes`, accountTypeRoutes);
    app.use(`${BASE_PATH}/currencies`, currencyRoutes);
    app.use(`${BASE_PATH}/exchangeRates`, exchangeRateRoutes);
    app.use(`${BASE_PATH}/products`, productRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) =>{
        res.status(200).json({
            status: 'healthy',
            service: 'Banco la 33 Products & Currencies Service',
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Ruta no existe en el servidor'
        })
    })
}

export const initServer = async() => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try{
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);
        app.listen(PORT, () => {
            console.log(`Banco la 33 server running on port: ${PORT}`)
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`)
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`)
        process.exit(1);
    }
};