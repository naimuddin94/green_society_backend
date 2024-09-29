import { Router } from 'express';
import { authRouters } from '../modules/Auth/auth.route';
import { commentRouters } from '../modules/Comment/comment.route';
import { postRouters } from '../modules/Post/post.route';
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
  {
    path: '/posts',
    route: postRouters,
  },
  {
    path: '/comments',
    route: commentRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
