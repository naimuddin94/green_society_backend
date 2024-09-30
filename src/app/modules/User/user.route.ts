import { Router } from 'express';
import multer from 'multer';
import { validateRequest, validateRequestCookies } from '../../middlewares';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const upload = multer();

const router = Router();

router
  .route('/profile')
  .patch(
    upload.single('image'),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserController.updateUser
  );

router
  .route('/block/:userId')
  .patch(
    validateRequestCookies(UserValidation.accessTokenValidationSchema),
    UserController.blockUser
  );

export const userRouters = router;
