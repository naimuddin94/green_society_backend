import { Router } from 'express';
import { authRouters } from '../modules/Auth/auth.route';
import { userRouters } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRouters,
  },
  {
    path: '/user',
    route: userRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
