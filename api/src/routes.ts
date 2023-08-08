import { Router } from 'express';
import { authController } from './modules/auth/auth.controller.js';

export const routes: { [route: string]: Router } = {
    "/auth": authController
}