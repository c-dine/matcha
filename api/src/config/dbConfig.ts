import pkg from 'pg';
const { Pool } = pkg;

const dbConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
  };

export const dbPool = new Pool(dbConfig);