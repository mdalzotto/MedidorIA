import { DataSource } from 'typeorm';
import { Reading } from '../models/Reading';

export const DB = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Reading],
    synchronize: true,
    logging: false,
});
