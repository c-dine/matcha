import { PoolClient } from 'pg';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    dbClient: PoolClient;
  }
}