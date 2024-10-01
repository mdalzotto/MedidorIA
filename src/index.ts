import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { DB } from './config/database';

const app = express();
app.use(express.json());
app.use(cors());

DB.initialize()
    .then(() => {
        console.log('Banco de dados conectado');

        app.use('/', routes);

        app.listen(3000, () => {
            console.log('O servidor está rodando na porta 3000');
        });
    })
    .catch((error) => console.log('Erro de conexão com banco de dados:', error));
