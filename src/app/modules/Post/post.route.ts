import { Router } from 'express';
import multer from 'multer';
import { validateRequest, validateRequestCookies } from '../../middlewares';
import { PostController } from './post.controller';
import { PostValidation } from './post.validation';
import { UserValidation } from '../User/user.validation';

const upload = multer();

const router = Router();

// Route for creating a post
router
  .route('/')
  .get(PostController.fetchPosts)
  .post(
    upload.array('images'),
    validateRequest(PostValidation.createPostValidationSchema),
    PostController.createPost
  );

// Route for updating a post
router
  .route('/:postId')
  .get(PostController.fetchPost)
  .patch(
    upload.array('images'),
    validateRequest(PostValidation.updatePostValidationSchema),
    PostController.updatePost
  )
  .delete(PostController.deletePost);

// Route for reacting to a post
router
  .route('/reaction')
  .post(
    validateRequest(PostValidation.reactToPostValidationSchema),
    PostController.reactToPost
  );

router
  .route('/premium/:postId')
  .patch(
    validateRequestCookies(UserValidation.accessTokenValidationSchema),
    PostController.makePremium
  );

export const postRouters = router;
