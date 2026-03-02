'use strict'

import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { dbConnection } from './db.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const BASE_PATH = '/banco33/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
};

const routes = (app) => {
    app.use(`${BASE_PATH}/fields`, fieldRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'Banco 33 Banking Service'
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
        middlewares(app);
        await dbConnection();
        routes(app);
        app.use(errorHandler);
        app.listen(PORT, () => {
            console.log(`Banco 33 banking service running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`)
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
}